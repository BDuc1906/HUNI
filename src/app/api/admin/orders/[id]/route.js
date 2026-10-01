// ==================================================
// src/app/api/admin/orders/[id]/route.js
// API Cập nhật trạng thái đơn hàng (Mục 9.2 — API_CONTRACT.md)
// PATCH /api/admin/orders/[id] 🔒 ADMIN
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { adminOrderUpdateSchema, formatZodErrors } from "@/server/validators";

async function resolveParamId(params) {
  if (params && typeof params.then === "function") {
    const resolved = await params;
    return resolved?.id;
  }
  return params?.id;
}

export async function PATCH(request, { params }) {
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
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền cập nhật đơn hàng.",
        },
        { status: 403 }
      );
    }

    const id = await resolveParamId(params);
    const body = await request.json();

    const parseResult = adminOrderUpdateSchema.safeParse(body);
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

    const existingOrder = await db.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id: existingOrder.id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("[admin/orders/[id]] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật đơn hàng" },
      { status: 500 }
    );
  }
}
