// ==================================================
// GET /api/tracking?code=HN-XXXXXX — Tra cứu đơn
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";

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

    const query = code.trim();
    const upperQuery = query.toUpperCase();

    // Tìm theo orderNumber HOẶC SĐT khách
    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: upperQuery },
          { customer: { phone: query } },
        ],
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return NextResponse.json({
        success: true,
        order: null,
      });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("[tracking] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tra cứu" },
      { status: 500 }
    );
  }
}