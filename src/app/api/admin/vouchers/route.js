// ==================================================
// src/app/api/admin/vouchers/route.js
// API Quản trị Voucher (Mục 9.7 — API_CONTRACT.md)
// POST /api/admin/vouchers 🔒 ADMIN — Tạo voucher mới
// GET  /api/admin/vouchers 🔒 ADMIN — Danh sách voucher
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { voucherCreateSchema, formatZodErrors } from "@/server/validators";

export async function GET(request) {
  try {
    const session = await auth().catch(() => null);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng đăng nhập để truy cập tài nguyên này.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền truy cập.",
        },
        { status: 403 }
      );
    }

    const vouchers = await db.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        vouchers,
        total: vouchers.length,
      },
    });
  } catch (error) {
    console.error("[admin/vouchers] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách voucher" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth().catch(() => null);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng đăng nhập để thực hiện thao tác này.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền tạo voucher.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = voucherCreateSchema.safeParse(body);

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

    // Kiểm tra trùng code
    const existing = await db.voucher.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Mã voucher "${data.code}" đã tồn tại trên hệ thống.`,
        },
        { status: 409 }
      );
    }

    const voucher = await db.voucher.create({
      data: {
        code: data.code,
        discount: data.discount,
        type: data.type,
        minOrder: data.minOrder ?? 0,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: data.active ?? true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tạo voucher thành công",
        data: voucher,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/vouchers] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo voucher" },
      { status: 500 }
    );
  }
}
