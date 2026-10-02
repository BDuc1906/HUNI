import React, { Suspense } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  FileText,
  Users,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Package,
} from "lucide-react";
import StatsCard from "./components/StatsCard";
import OrderStatusChart from "./components/OrderStatusChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import RecentQuotesTable from "./components/RecentQuotesTable";

export const metadata = {
  title: "Dashboard Tổng Quan | Admin HDC Fashion",
  description: "Bảng điều khiển tổng hợp số liệu vận hành và đơn hàng",
};

export const dynamic = "force-dynamic";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default async function AdminDashboardPage() {
  let totalOrders = 0;
  let totalQuotes = 0;
  let totalCustomers = 0;
  let totalRevenue = 0;
  let pendingOrders = 0;
  let producingOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;
  let newQuotes = 0;
  let recentOrders = [];
  let recentQuotes = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/admin/dashboard`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const data = json?.data;
      if (data) {
        totalOrders = data.stats?.totalOrders || 0;
        totalRevenue = data.stats?.totalRevenue || 0;
        totalQuotes = data.stats?.totalQuotes || 0;
        totalCustomers = data.stats?.totalCustomers || 0;

        pendingOrders = data.statusCounts?.orders?.pending || 0;
        producingOrders = data.statusCounts?.orders?.producing || 0;
        completedOrders = data.statusCounts?.orders?.completed || 0;
        cancelledOrders = data.statusCounts?.orders?.cancelled || 0;
        newQuotes = data.statusCounts?.quotes?.new || 0;

        recentOrders = data.recentOrders || [];
        recentQuotes = data.recentQuotes || [];
      }
    }
  } catch (error) {
    console.error("[AdminDashboard] Error fetching stats:", error);
  }

  const statusCounts = {
    pending: pendingOrders,
    producing: producingOrders,
    completed: completedOrders,
    cancelled: cancelledOrders,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Tổng Quan Hoạt Động</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Live
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi doanh thu, trạng thái sản xuất và yêu cầu báo giá theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Xem Đơn Hàng</span>
          </Link>
          <Link
            href="/admin/quotes"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Xử Lý Báo Giá ({newQuotes})</span>
          </Link>
        </div>
      </div>

      {/* 2. Stats Cards (4 thẻ hàng ngang) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng đơn hàng */}
        <StatsCard
          title="Tổng Đơn Hàng"
          value={totalOrders}
          subtext={`${pendingOrders} đơn đang chờ xử lý`}
          icon={ShoppingBag}
          iconBgColor="bg-blue-500/10"
          iconTextColor="text-blue-400"
          borderColor="border-blue-500/20"
        />

        {/* Tổng doanh thu */}
        <StatsCard
          title="Doanh Thu"
          value={formatVND(totalRevenue)}
          subtext="Tổng doanh số ghi nhận"
          icon={TrendingUp}
          iconBgColor="bg-emerald-500/10"
          iconTextColor="text-emerald-400"
          borderColor="border-emerald-500/20"
        />

        {/* Yêu cầu báo giá */}
        <StatsCard
          title="Yêu Cầu Báo Giá"
          value={totalQuotes}
          subtext={`${newQuotes} yêu cầu mới chưa xử lý`}
          icon={FileText}
          iconBgColor="bg-amber-500/10"
          iconTextColor="text-amber-400"
          borderColor="border-amber-500/20"
        />

        {/* Khách hàng */}
        <StatsCard
          title="Khách Hàng"
          value={totalCustomers}
          subtext="Doanh nghiệp & đối tác"
          icon={Users}
          iconBgColor="bg-purple-500/10"
          iconTextColor="text-purple-400"
          borderColor="border-purple-500/20"
        />
      </div>

      {/* 3. Biểu đồ & Tóm tắt nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderStatusChart statusCounts={statusCounts} />
        </div>

        {/* Thẻ chỉ dẫn & trạng thái xưởng */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Quy Trình Xử Lý</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Theo dõi tiến độ từ tiếp nhận báo giá, dựng mẫu demo, sản xuất đến bàn giao khách hàng.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Đơn chờ duyệt sản xuất:
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {pendingOrders} đơn
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Đơn đang cắt may / thêu:
                </span>
                <span className="font-mono font-bold text-blue-400">
                  {producingOrders} đơn
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Báo giá mới cần phản hồi:
                </span>
                <span className="font-mono font-bold text-sky-400">
                  {newQuotes} yêu cầu
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Đơn vị: VNĐ / Chiếc</span>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
            >
              <span>Quản lý xưởng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Hai bảng dữ liệu gần nhất: Đơn hàng & Báo giá */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={recentOrders} />
        <RecentQuotesTable quotes={recentQuotes} />
      </div>
    </div>
  );
}
