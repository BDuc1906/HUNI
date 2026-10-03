import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  FileText,
  Users,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import StatsCard from "./components/StatsCard";
import OrderStatusChart from "./components/OrderStatusChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import RecentQuotesTable from "./components/RecentQuotesTable";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_ORDERS,
  MOCK_QUOTES,
} from "@/shared/data/adminMockData";

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

  // Tự động kích hoạt Mock Data chuẩn nghiệp vụ khi chưa kết nối backend
  if (!totalOrders && !totalRevenue) {
    totalOrders = MOCK_DASHBOARD_STATS.totalOrders;
    totalRevenue = MOCK_DASHBOARD_STATS.totalRevenue;
    totalQuotes = MOCK_DASHBOARD_STATS.totalQuotes;
    totalCustomers = MOCK_DASHBOARD_STATS.totalCustomers;
    pendingOrders = MOCK_DASHBOARD_STATS.statusCounts.orders.pending;
    producingOrders = MOCK_DASHBOARD_STATS.statusCounts.orders.producing;
    completedOrders = MOCK_DASHBOARD_STATS.statusCounts.orders.completed;
    cancelledOrders = MOCK_DASHBOARD_STATS.statusCounts.orders.cancelled;
    newQuotes = MOCK_DASHBOARD_STATS.statusCounts.quotes.new;
    recentOrders = MOCK_ORDERS.slice(0, 5);
    recentQuotes = MOCK_QUOTES.slice(0, 5);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Tổng Quan Hoạt Động</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Demo
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi doanh thu, trạng thái sản xuất và yêu cầu báo giá theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-brand-600" />
            <span>Xem Đơn Hàng</span>
          </Link>
          <Link
            href="/admin/quotes"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5"
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
          subtext={`${pendingOrders} đơn đang chờ duyệt`}
          icon={ShoppingBag}
          iconBgColor="bg-brand-50"
          iconTextColor="text-brand-600"
          trend={{ isPositive: true, label: "+14.8% tuần này" }}
        />

        {/* Tổng doanh thu */}
        <StatsCard
          title="Doanh Thu Ghi Nhận"
          value={formatVND(totalRevenue)}
          subtext="Doanh số tích lũy B2B"
          icon={TrendingUp}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
          trend={{ isPositive: true, label: "+18.2% tháng này" }}
        />

        {/* Yêu cầu báo giá */}
        <StatsCard
          title="Yêu Cầu Báo Giá"
          value={totalQuotes}
          subtext={`${newQuotes} yêu cầu mới cần gửi báo giá`}
          icon={FileText}
          iconBgColor="bg-amber-50"
          iconTextColor="text-amber-600"
          trend={{ isPositive: true, label: "5 phản hồi hôm nay" }}
        />

        {/* Khách hàng */}
        <StatsCard
          title="Khách Hàng Doanh Nghiệp"
          value={totalCustomers}
          subtext="Đối tác & tập đoàn lớn"
          icon={Users}
          iconBgColor="bg-purple-50"
          iconTextColor="text-purple-600"
          trend={{ isPositive: true, label: "+8 đối tác mới" }}
        />
      </div>

      {/* 3. Biểu đồ & Tóm tắt nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderStatusChart statusCounts={statusCounts} />
        </div>

        {/* Thẻ chỉ dẫn & trạng thái xưởng */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tiến Độ Xưởng May</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Quy trình may đo khép kín từ tiếp nhận mẫu thử 0đ, cắt vải, thêu vi tính đến QC xuất xưởng.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Đơn chờ duyệt sản xuất:
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {pendingOrders} đơn
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  Đơn đang cắt may / thêu:
                </span>
                <span className="font-mono font-bold text-brand-700">
                  {producingOrders} đơn
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Báo giá mới cần phản hồi:
                </span>
                <span className="font-mono font-bold text-sky-700">
                  {newQuotes} yêu cầu
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Đơn vị: VNĐ / Chiếc</span>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
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
