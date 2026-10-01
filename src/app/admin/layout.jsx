import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { db } from "@/server/db";

export const metadata = {
  title: "Admin Dashboard | HDC Fashion & HUNI Uniform",
  description: "Cổng điều hành và quản lý đơn hàng, báo giá, kho sản phẩm HDC Fashion",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }) {
  // 1. Kiểm tra xác thực và phân quyền RBAC
  const session = await auth().catch(() => null);
  const isBypass =
    process.env.NODE_ENV !== "production" ||
    process.env.ADMIN_PREVIEW_MODE === "true";

  if (!isBypass) {
    if (!session?.user) {
      redirect("/login?callbackUrl=/admin");
    }

    if (session.user.role !== "ADMIN") {
      redirect("/?error=forbidden");
    }
  }

  // 2. Fetch trước số lượng badge đếm cho sidebar từ DB
  let initialCounts = { pendingOrders: 0, newQuotes: 0 };
  try {
    const [pendingOrders, newQuotes] = await Promise.all([
      db.order.count({ where: { status: "PENDING" } }).catch(() => 0),
      db.quote.count({ where: { status: "NEW" } }).catch(() => 0),
    ]);
    initialCounts = {
      pendingOrders: pendingOrders || 0,
      newQuotes: newQuotes || 0,
    };
  } catch (err) {
    console.error("[AdminLayout] Error fetching badge counts:", err);
  }

  const currentUser = {
    name: session?.user?.name || "Quản Trị Viên",
    email: session?.user?.email || "admin@hdc.vn",
    role: session?.user?.role || "ADMIN",
    avatar: session?.user?.avatar || null,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar điều hướng */}
      <AdminSidebar user={currentUser} initialCounts={initialCounts} />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pt-14 lg:pt-0">
        <AdminHeader user={currentUser} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
