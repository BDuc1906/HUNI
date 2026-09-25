
// ==================================================
// POST /api/register — Đăng ký tài khoản mới
// (đặt ngoài /api/auth/ để tránh xung đột NextAuth)
// ==================================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { registerSchema, formatZodErrors } from "@/server/validators";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate
    const parseResult = registerSchema.safeParse(body);
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

    const { fullName, email, phone, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check email đã tồn tại
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email này đã được đăng ký" },
        { status: 409 }
      );
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Tạo user
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName,
        phone,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể đăng ký. Vui lòng thử lại.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}


