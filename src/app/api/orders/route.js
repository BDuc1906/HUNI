// ==================================================
// POST /api/orders — Nhận đơn hàng (BẢO MẬT)
// GET  /api/orders — Danh sách (admin)
// ==================================================

import { NextResponse } from "next/server";
import { db, generateOrderNumber } from "@/server/db";
import { auth } from "@/server/auth";
import {
  createOrderSchema,
  formatZodErrors,
} from "@/server/validators";
import {
  sendOrderNotificationEmail,
  sendCustomerConfirmationEmail,
} from "@/server/mailer";
import { validateVoucher } from "@/server/vouchers";
import { PRODUCTS } from "@/shared/data";
import { calculateTierPrice } from "@/shared/lib/pricing";

// ==================================================
// RATE LIMIT — In-memory (đủ cho 1 serverless instance)
// Nếu cần scale lớn → dùng Upstash Redis
// ==================================================
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5; // 5 đơn / IP / giờ
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ==================================================
// VALIDATE + TÍNH LẠI GIÁ ITEMS TỪ DB
// Không tin bất kỳ giá nào từ client
// ==================================================
function validateAndPriceItems(items) {
  const errors = [];
  const verifiedItems = [];
  let subtotal = 0;

  for (const item of items) {
    // 1. Tìm sản phẩm thật
    const product = PRODUCTS.find((p) => p.id === item.productId);

    if (!product) {
      errors.push({
        field: `items.${item.productId}`,
        message: `Sản phẩm "${item.productId}" không tồn tại`,
      });
      continue;
    }

    // 2. Tính lại giá chuẩn theo tier
    const correctUnitPrice = calculateTierPrice(product, item.quantity);

    // 3. So sánh giá client gửi (cho phép lệch 1% do làm tròn)
    const priceDiff = Math.abs(item.unitPrice - correctUnitPrice);
    const pricePercent = correctUnitPrice > 0 ? priceDiff / correctUnitPrice : 0;

    if (pricePercent > 0.01) {
      errors.push({
        field: `items.${item.productId}.unitPrice`,
        message: `Giá sản phẩm "${product.title}" không khớp (client: ${item.unitPrice}đ, server: ${correctUnitPrice}đ)`,
      });
      continue;
    }

    // 4. Tính subtotal cho item này (bao gồm phí logo nếu có)
    const logoCost = item.customLogo ? 15000 : 0;
    const itemSubtotal = (correctUnitPrice + logoCost) * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      productId: item.productId,
      productName: product.title,
      quantity: item.quantity,
      unitPrice: correctUnitPrice,
      color: item.color || null,
      size: item.size || null,
      customLogo: item.customLogo || null,
      subtotal: itemSubtotal,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    items: verifiedItems,
    subtotal,
  };
}

// ==================================================
// POST — Tạo đơn hàng mới (ĐÃ BẢO MẬT)
// ==================================================
export async function POST(request) {
  try {
    // ============================================
    // 0. RATE LIMIT
    // ============================================
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Bạn đã gửi quá nhiều đơn hàng. Vui lòng thử lại sau ${Math.ceil(
            rateCheck.retryAfter / 60
          )} phút.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfter),
          },
        }
      );
    }

    // ============================================
    // 1. PARSE & VALIDATE INPUT
    // ============================================
    const body = await request.json();
    const parseResult = createOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: formatZodErrors(parseResult.error),
        },
        { status: 400 }
      );
    }
    const data = parseResult.data;

    // ============================================
    // 2. VALIDATE ITEMS + TÍNH LẠI GIÁ SERVER-SIDE
    // ============================================
    const priceCheck = validateAndPriceItems(data.items);

    if (!priceCheck.valid) {
      console.warn("[orders] Price mismatch detected:", {
        ip,
        errors: priceCheck.errors,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Giá sản phẩm không hợp lệ. Vui lòng tải lại trang và thử lại.",
          details: priceCheck.errors,
        },
        { status: 400 }
      );
    }

    const serverSubtotal = priceCheck.subtotal;

    // ============================================
    // 3. VALIDATE VOUCHER SERVER-SIDE
    // ============================================
    let serverDiscount = 0;
    let appliedVoucherCode = null;

    if (data.voucherCode) {
      const voucherResult = validateVoucher(data.voucherCode, serverSubtotal);

      if (!voucherResult.valid) {
        return NextResponse.json(
          {
            success: false,
            error: voucherResult.reason,
            field: "voucherCode",
          },
          { status: 400 }
        );
      }

      serverDiscount = voucherResult.discount;
      appliedVoucherCode = voucherResult.voucher.code;
    }

    const serverTotal = Math.max(0, serverSubtotal - serverDiscount);

    // ============================================
    // 4. TÌM HOẶC TẠO CUSTOMER (theo SĐT)
    // ============================================
    let customer = await db.customer.findUnique({
      where: { phone: data.customer.phone },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          fullName: data.customer.fullName,
          phone: data.customer.phone,
          email: data.customer.email || null,
          company: data.customer.company || null,
          address: data.customer.address,
        },
      });
    } else {
      customer = await db.customer.update({
        where: { id: customer.id },
        data: {
          fullName: data.customer.fullName,
          email: data.customer.email || customer.email,
          company: data.customer.company || customer.company,
          address: data.customer.address,
        },
      });
    }

    // ============================================
    // 5. TẠO ORDER + ITEMS (với giá đã verify)
    // ============================================
    const orderNumber = generateOrderNumber();
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "PENDING",
        paymentMethod: data.paymentMethod,
        subtotal: serverSubtotal, // ← Server-computed
        discount: serverDiscount, // ← Server-computed
        total: serverTotal, // ← Server-computed
        notes: data.notes || null,
        vatInfo: data.vatInfo || undefined,
        items: {
          create: priceCheck.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            color: item.color,
            size: item.size,
            customLogo: item.customLogo || undefined,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // ============================================
    // 6. GỬI EMAIL (không block response)
    // ============================================
    Promise.all([
      sendOrderNotificationEmail(order),
      sendCustomerConfirmationEmail(order),
    ]).catch((err) => console.error("[orders] Email error:", err));

    // ============================================
    // 7. RESPONSE — Trả về giá server-computed
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: "Đơn hàng đã được tiếp nhận",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          discount: order.discount,
          total: order.total,
          status: order.status,
          voucherApplied: appliedVoucherCode,
        },
        rateLimit: {
          remaining: rateCheck.remaining,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[orders] POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể xử lý đơn hàng. Vui lòng thử lại.",
      },
      { status: 500 }
    );
  }
}

// ==================================================
// GET — Danh sách đơn hàng (BẢO MẬT: Auth Guard & RBAC)
// - ADMIN: Xem toàn bộ đơn hàng (hỗ trợ filter status, pagination)
// - CUSTOMER (?mine=true): Xem các đơn hàng của chính tài khoản đăng nhập
// - Chưa đăng nhập: 401 Unauthorized
// - Người dùng không phải ADMIN cố xem toàn bộ: 403 Forbidden
// ==================================================
export async function GET(request) {
  try {
    const session = await auth().catch(() => null);

    // 1. Kiểm tra xác thực (Authentication Guard)
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng đăng nhập để truy cập danh sách đơn hàng.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
      100
    );
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const skip = (page - 1) * limit;
    const isMine = searchParams.get("mine") === "true";
    const isAdmin = session.user.role === "ADMIN";

    // 2. Kiểm tra phân quyền (RBAC)
    // Nếu không phải ADMIN và không yêu cầu xem đơn cá nhân (?mine=true) -> Chặn 403 Forbidden
    if (!isAdmin && !isMine) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền xem danh sách đơn hàng hệ thống.",
        },
        { status: 403 }
      );
    }

    // 3. Xây dựng điều kiện truy vấn an toàn
    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (!isAdmin || isMine) {
      // Tìm thông tin SĐT và Email của User để lấy các đơn hàng tương ứng
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, phone: true },
      });

      const orConditions = [
        ...(user?.email ? [{ customer: { email: user.email } }] : []),
        ...(user?.phone ? [{ customer: { phone: user.phone } }] : []),
      ];

      if (orConditions.length === 0) {
        return NextResponse.json({
          success: true,
          count: 0,
          total: 0,
          page,
          limit,
          totalPages: 0,
          orders: [],
        });
      }

      whereClause = {
        ...(status ? { status } : {}),
        customer: {
          OR: [
            ...(user?.email ? [{ email: user.email }] : []),
            ...(user?.phone ? [{ phone: user.phone }] : []),
          ],
        },
      };
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          items: true,
        },
      }),
      db.order.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      success: true,
      count: orders.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("[orders] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách đơn" },
      { status: 500 }
    );
  }
}