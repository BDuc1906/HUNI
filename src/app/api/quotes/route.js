// ==================================================
// POST /api/quotes — Nhận yêu cầu báo giá
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  createQuoteSchema,
  formatZodErrors,
} from "@/server/validators";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate
    const parseResult = createQuoteSchema.safeParse(body);
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

    // 2. Tìm hoặc tạo customer theo SĐT
    let customer = await db.customer.findUnique({
      where: { phone: data.phone },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || null,
          company: data.company || null,
        },
      });
    }

    // 3. Tạo Quote
    const quote = await db.quote.create({
      data: {
        customerId: customer.id,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        company: data.company || null,
        category: data.category,
        quantity: data.quantity,
        estimatedPrice: data.estimatedPrice || null,
        notes: data.notes || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Yêu cầu báo giá đã được tiếp nhận",
        quoteId: quote.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[quotes] POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể xử lý yêu cầu. Vui lòng thử lại.",
      },
      { status: 500 }
    );
  }
}