// ==================================================
// POST /api/orders — Nhận đơn hàng
// GET  /api/orders — Danh sách (admin)
// ==================================================

import { NextResponse } from "next/server";
import { db, generateOrderNumber } from "@/server/db";
import {
  createOrderSchema,
  formatZodErrors,
} from "@/server/validators";
import {
  sendOrderNotificationEmail,
  sendCustomerConfirmationEmail,
} from "@/server/mailer";

// ==================================================
// POST — Tạo đơn hàng mới
// ==================================================
export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate input
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

    // 2. Tìm hoặc tạo customer (theo SĐT)
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

    // 3. Tạo order + items
    const orderNumber = generateOrderNumber();
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "PENDING",
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        notes: data.notes || null,
        vatInfo: data.vatInfo || undefined,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            color: item.color || null,
            size: item.size || null,
            customLogo: item.customLogo || undefined,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // 4. Gửi email (không block response nếu lỗi)
    Promise.all([
      sendOrderNotificationEmail(order),
      sendCustomerConfirmationEmail(order),
    ]).catch((err) => console.error("[orders] Email error:", err));

    // 5. Response
    return NextResponse.json(
      {
        success: true,
        message: "Đơn hàng đã được tiếp nhận",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
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
// GET — Danh sách đơn (admin)
// ==================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");

    const orders = await db.order.findMany({
      where: status ? { status } : undefined,
      take: Math.min(limit, 100),
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
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