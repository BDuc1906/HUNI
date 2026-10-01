// ==================================================
// src/app/api/admin/quotes/[id]/route.js
// API Cập nhật trạng thái báo giá (Mục 9.4 — API_CONTRACT.md)
// PATCH /api/admin/quotes/[id] 🔒 ADMIN
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { adminQuoteUpdateSchema, formatZodErrors } from "@/server/validators";

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
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền cập nhật báo giá.",
        },
        { status: 403 }
      );
    }

    const id = await resolveParamId(params);
    const body = await request.json();

    const parseResult = adminQuoteUpdateSchema.safeParse(body);
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

    const existingQuote = await db.quote.findUnique({
      where: { id },
    });

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy yêu cầu báo giá" },
        { status: 404 }
      );
    }

    const updatedQuote = await db.quote.update({
      where: { id: existingQuote.id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.estimatedPrice !== undefined
          ? { estimatedPrice: data.estimatedPrice }
          : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái báo giá thành công",
      data: updatedQuote,
    });
  } catch (error) {
    console.error("[admin/quotes/[id]] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật báo giá" },
      { status: 500 }
    );
  }
}
