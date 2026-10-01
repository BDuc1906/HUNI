// ==================================================
// src/app/api/admin/orders/route.js
// API Quản trị đơn hàng (Mục 9.1 — API_CONTRACT.md)
// GET /api/admin/orders 🔒 ADMIN — Danh sách đơn hàng với bộ lọc đầy đủ
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
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
      100
    );
    const skip = (page - 1) * limit;

    const whereClause = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              {
                customer: {
                  OR: [
                    { fullName: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search } },
                    { email: { contains: search, mode: "insensitive" } },
                    { company: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            ],
          }
        : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {}),
    };

    const [orders, total, pendingCount, producingCount, completedCount, revenueAgg] =
      await Promise.all([
        db.order.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          include: {
            customer: true,
            items: true,
          },
        }),
        db.order.count({ where: whereClause }),
        db.order.count({ where: { status: "PENDING" } }).catch(() => 0),
        db.order.count({ where: { status: "PRODUCING" } }).catch(() => 0),
        db.order.count({ where: { status: "COMPLETED" } }).catch(() => 0),
        db.order
          .aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } },
          })
          .catch(() => ({ _sum: { total: 0 } })),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        summary: {
          pending: pendingCount,
          producing: producingCount,
          completed: completedCount,
          totalRevenue: revenueAgg?._sum?.total || 0,
        },
      },
    });
  } catch (error) {
    console.error("[admin/orders] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách đơn hàng quản trị" },
      { status: 500 }
    );
  }
}
