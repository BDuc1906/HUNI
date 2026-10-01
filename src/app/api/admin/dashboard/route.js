// ==================================================
// src/app/api/admin/dashboard/route.js
// API Thống kê tổng quan Dashboard (Mục 9.6 — API_CONTRACT.md)
// GET /api/admin/dashboard 🔒 ADMIN
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

    const [
      totalOrders,
      totalQuotes,
      totalCustomers,
      revenueAgg,
      pendingOrders,
      producingOrders,
      completedOrders,
      cancelledOrders,
      newQuotes,
      recentOrders,
      recentQuotes,
    ] = await Promise.all([
      db.order.count().catch(() => 0),
      db.quote.count().catch(() => 0),
      db.customer.count().catch(() => 0),
      db.order
        .aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        })
        .catch(() => ({ _sum: { total: 0 } })),
      db.order.count({ where: { status: "PENDING" } }).catch(() => 0),
      db.order.count({ where: { status: "PRODUCING" } }).catch(() => 0),
      db.order.count({ where: { status: "COMPLETED" } }).catch(() => 0),
      db.order.count({ where: { status: "CANCELLED" } }).catch(() => 0),
      db.quote.count({ where: { status: "NEW" } }).catch(() => 0),
      db.order
        .findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { customer: true, items: true },
        })
        .catch(() => []),
      db.quote
        .findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { customer: true },
        })
        .catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalRevenue: revenueAgg?._sum?.total || 0,
          totalQuotes,
          totalCustomers,
        },
        statusCounts: {
          orders: {
            pending: pendingOrders,
            producing: producingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders,
          },
          quotes: {
            new: newQuotes,
          },
        },
        recentOrders,
        recentQuotes,
      },
    });
  } catch (error) {
    console.error("[admin/dashboard] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải số liệu thống kê dashboard" },
      { status: 500 }
    );
  }
}
