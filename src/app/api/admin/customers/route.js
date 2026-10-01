// ==================================================
// src/app/api/admin/customers/route.js
// API Quản trị khách hàng (Mục 9.5 — API_CONTRACT.md)
// GET /api/admin/customers 🔒 ADMIN — Danh sách khách hàng
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
      100
    );
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { orders: true, quotes: true },
          },
        },
      }),
      db.customer.count({ where: whereClause }),
    ]);

    const formattedCustomers = customers.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      company: c.company,
      address: c.address,
      taxCode: c.taxCode,
      notes: c.notes,
      orderCount: c._count?.orders ?? 0,
      quoteCount: c._count?.quotes ?? 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        customers: formattedCustomers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[admin/customers] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách khách hàng" },
      { status: 500 }
    );
  }
}
