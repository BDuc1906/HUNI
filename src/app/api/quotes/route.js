// ==================================================
// POST /api/quotes — Nhận yêu cầu báo giá
// ==================================================

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // TODO: Validate + lưu DB + gửi email

    return NextResponse.json({
      success: true,
      message: "Yêu cầu báo giá đã được tiếp nhận",
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
