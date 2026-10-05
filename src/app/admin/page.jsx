import React from "react";
import StatsCard from "./components/StatsCard";
import OrderStatusChart from "./components/OrderStatusChart";
import RevenueTargetCard from "./components/RevenueTargetCard";
import RecentOrdersTable from "./components/RecentOrdersTable";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_ORDERS,
  MOCK_QUOTES,
} from "@/shared/data/adminMockData";

export const metadata = {
  title: "Dashboard Overview | Spark Pixel Admin",
  description: "Executive analytics and operations platform",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalOrders = 10320;
  let totalRevenue = "$20,320";
  let totalCustomers = 4305;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. Page Title Header: Welcome back, Salung (Như trong ảnh mẫu 1 & 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Welcome back, Salung
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track business growth, daily customer interactions, and revenue insights.
          </p>
        </div>

        {/* Live sync pill badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* 2. STATS CARDS ROW: 3 Thẻ hàng ngang chuẩn xác như ảnh mẫu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: TOTAL REVENUE */}
        <StatsCard
          title="TOTAL REVENUE"
          value="$20,320"
          unit=""
          sparkHeights={[25, 40, 35, 60, 50, 75, 95, 80, 100]}
          trend={{ isPositive: true, label: "+0,94% last year" }}
        />

        {/* Card 2: TOTAL ORDERS */}
        <StatsCard
          title="TOTAL ORDERS"
          value="10,320"
          unit="Orders"
          sparkHeights={[30, 20, 50, 45, 65, 55, 70, 90, 85, 100]}
          trend={{ isPositive: true, label: "+0,12% last year" }}
        />

        {/* Card 3: NEW CUSTOMERS */}
        <StatsCard
          title="NEW CUSTOMERS"
          value="4,305"
          unit="New Users"
          sparkHeights={[20, 35, 30, 45, 70, 60, 80, 85, 95, 100]}
          trend={{ isPositive: true, label: "+0,93% last year" }}
        />
      </div>

      {/* 3. HERO CHART & REVENUE TARGET ROW: SALES TREND + REVENUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Pixel Matrix Column Chart (Chiếm 2 cột) */}
        <div className="lg:col-span-2">
          <OrderStatusChart />
        </div>

        {/* Revenue Target Widget Card (Chiếm 1 cột như trong ảnh 2) */}
        <div className="lg:col-span-1">
          <RevenueTargetCard />
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS DATA TABLE (Bảng danh sách đơn hàng như trong ảnh 2) */}
      <div className="pt-2">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
