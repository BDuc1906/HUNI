// ==================================================
// GET /api/tracking?code=HN-XXXXXX — Tra cứu đơn
// ==================================================

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng" },
        { status: 400 }
      );
    }

    // TODO: Query DB theo mã đơn hoặc SĐT

    return NextResponse.json({
      success: true,
      order: null,
    });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tra cứu" },
      { status: 500 }
    );
  }
}
