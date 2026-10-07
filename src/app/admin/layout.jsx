import React from "react";
import { cookies } from "next/headers";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export const metadata = {
  title: "Tổng Quan Quản Trị | HDC Fashion & HUNI Uniform",
  description: "Cổng điều hành và quản lý đơn hàng, báo giá, kho sản phẩm HDC Fashion",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  let initialCounts = { pendingOrders: 0, newQuotes: 0 };

  let currentUser = {
    name: "Quản Trị Viên",
    email: "admin@huni.vn",
    role: "ADMIN",
  };

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const cookieStore = await cookies();
    const token = cookieStore.get("huni_token")?.value;
    const fetchHeaders = {};
    if (token) {
      fetchHeaders["Cookie"] = `huni_token=${token}`;
    }

    const [dashRes, userRes] = await Promise.all([
      fetch(`${apiUrl}/api/admin/dashboard`, {
        headers: fetchHeaders,
        cache: "no-store",
      }).catch(() => null),
      fetch(`${apiUrl}/api/auth/me`, {
        headers: fetchHeaders,
        cache: "no-store",
      }).catch(() => null),
    ]);

    if (dashRes && dashRes.ok) {
      const json = await dashRes.json().catch(() => null);
      if (json?.data?.statusCounts) {
        initialCounts = {
          pendingOrders: json.data.statusCounts.orders?.pending || 0,
          newQuotes: json.data.statusCounts.quotes?.new || 0,
        };
      }
    }

    if (userRes && userRes.ok) {
      const userJson = await userRes.json().catch(() => null);
      if (userJson?.user) {
        currentUser = {
          name: userJson.user.fullName || userJson.user.name || "Quản Trị Viên",
          email: userJson.user.email || "admin@huni.vn",
          role: userJson.user.role || "ADMIN",
        };
      }
    }
  } catch (err) {
    console.error("[AdminLayout] Error fetching admin data:", err);
  }

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col lg:flex-row font-sans selection:bg-[#0097B2] selection:text-white transition-colors duration-200 bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-white">
      {/* Sidebar - Cố định 100% bên trái */}
      <AdminSidebar user={currentUser} initialCounts={initialCounts} />

      {/* Main Area: Top Header + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pt-12 lg:pt-0">
        <AdminHeader user={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-200">
          <div className="max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
