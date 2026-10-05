import React from "react";
import { Calendar, Download } from "lucide-react";
import StatsCard from "./components/StatsCard";
import SalesTrendChart from "./components/SalesTrendChart";
import RevenueGaugeChart from "./components/RevenueGaugeChart";
import FunnelB2BChart from "./components/FunnelB2BChart";
import OrderStatusChart from "./components/OrderStatusChart";
import RevenueByCategoryChart from "./components/RevenueByCategoryChart";
import TopProductsChart from "./components/TopProductsChart";
import AlertsPanel from "./components/AlertsPanel";
import RecentOrdersTable from "./components/RecentOrdersTable";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_ORDERS,
  MOCK_REVENUE_KPI,
  MOCK_FUNNEL_B2B,
  MOCK_REVENUE_BY_CATEGORY,
  MOCK_TOP_PRODUCTS,
  MOCK_ALERTS,
} from "@/shared/data/adminMockData";

export const metadata = {
  title: "Dashboard | HDC Fashion Admin",
};

export const dynamic = "force-dynamic";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default async function AdminDashboardPage() {
  let stats = { totalOrders: 0, totalRevenue: 0, totalQuotes: 0, totalCustomers: 0 };
  let statusCounts = { orders: { pending: 0, producing: 0, completed: 0, cancelled: 0 } };
  let recentOrders = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/admin/dashboard`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const data = json?.data;
      if (data) {
        stats = data.stats || stats;
        statusCounts = data.statusCounts || statusCounts;
        recentOrders = data.recentOrders || [];
      }
    }
  } catch (err) {
    console.error("[AdminDashboard]", err);
  }

  // Fallback mock
  if (!stats.totalOrders && !stats.totalRevenue) {
    stats = {
      totalOrders: MOCK_DASHBOARD_STATS.totalOrders,
      totalRevenue: MOCK_DASHBOARD_STATS.totalRevenue,
      totalQuotes: MOCK_DASHBOARD_STATS.totalQuotes,
      totalCustomers: MOCK_DASHBOARD_STATS.totalCustomers,
    };
    statusCounts = MOCK_DASHBOARD_STATS.statusCounts;
    recentOrders = MOCK_ORDERS.slice(0, 5);
  }

  const revenueFormatted = formatVND(stats.totalRevenue);
  const conversionRate = Math.round((stats.totalOrders / Math.max(1, stats.totalQuotes + stats.totalOrders)) * 100);

  return (
    <div className="space-y-5">

      {/* ============================================================
          HEADER BAR
          ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan hoạt động kinh doanh HDC Fashion hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#0097B2] hover:text-[#0097B2] text-slate-700 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all">
            <Calendar className="w-4 h-4" />
            <span>Daily</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0097B2] hover:bg-[#007f96] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-[#0097B2]/20 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          TIER 1 — 5 KPI CARDS
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="DOANH THU"
          value={revenueFormatted}
          trendValue="+12.5%"
          trendDirection="up"
          trendLabel="last year"
          accentColor="#0097B2"
          sparkline={[35, 55, 40, 70, 55, 85, 65, 90]}
        />
        <StatsCard
          title="ĐƠN HÀNG"
          value={stats.totalOrders.toLocaleString("vi-VN")}
          subValue="Orders"
          trendValue="+8.2%"
          trendDirection="up"
          trendLabel="last year"
          accentColor="#10b981"
          sparkline={[40, 50, 55, 62, 58, 75, 82, 88]}
        />
        <StatsCard
          title="BÁO GIÁ MỚI"
          value={stats.totalQuotes.toLocaleString("vi-VN")}
          subValue="Quotes"
          trendValue="+5.1%"
          trendDirection="up"
          trendLabel="last month"
          accentColor="#f59e0b"
          sparkline={[30, 35, 42, 38, 55, 48, 62, 58]}
        />
        <StatsCard
          title="KHÁCH HÀNG"
          value={stats.totalCustomers.toLocaleString("vi-VN")}
          subValue="New Users"
          trendValue="-2.1%"
          trendDirection="down"
          trendLabel="last year"
          accentColor="#a855f7"
          sparkline={[80, 75, 72, 68, 65, 62, 60, 58]}
        />
        <StatsCard
          title="TỶ LỆ CHỐT"
          value={`${conversionRate}%`}
          subValue="Conversion"
          trendValue="+3.4%"
          trendDirection="up"
          trendLabel="vs Q trước"
          accentColor="#0ea5e9"
          sparkline={[35, 38, 40, 42, 44, 46, 48, 52]}
        />
      </div>

      {/* ============================================================
          TIER 2 — HERO CHART (2/3) + GAUGE (1/3)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesTrendChart totalRevenue={revenueFormatted} totalOrders={stats.totalOrders} />
        </div>
        <div>
          <RevenueGaugeChart
            current={MOCK_REVENUE_KPI.current}
            target={MOCK_REVENUE_KPI.target}
            delta={MOCK_REVENUE_KPI.delta}
          />
        </div>
      </div>

      {/* ============================================================
          TIER 3 — 2x2 GRID: Funnel + Status + Category + Top Products
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelB2BChart data={MOCK_FUNNEL_B2B} />
        <OrderStatusChart statusCounts={statusCounts.orders} />
        <RevenueByCategoryChart data={MOCK_REVENUE_BY_CATEGORY} />
        <TopProductsChart products={MOCK_TOP_PRODUCTS} />
      </div>

      {/* ============================================================
          TIER 4 — Alerts (1/3) + Recent Orders (2/3)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <AlertsPanel alerts={MOCK_ALERTS} />
        </div>
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>

    </div>
  );
}