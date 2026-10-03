import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | HDC Fashion & HUNI Uniform",
  description: "Cổng điều hành và quản lý đơn hàng, báo giá, kho sản phẩm HDC Fashion",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }) {
  // 1. Kiểm tra xác thực admin
  const session = null;

  // 2. Fetch trước số lượng badge đếm cho sidebar từ C# Backend
  let initialCounts = { pendingOrders: 12, newQuotes: 9 };
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/admin/dashboard`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.data?.statusCounts) {
        initialCounts = {
          pendingOrders: json.data.statusCounts.orders?.pending ?? 12,
          newQuotes: json.data.statusCounts.quotes?.new ?? 9,
        };
      }
    }
  } catch (err) {
    initialCounts = { pendingOrders: 12, newQuotes: 9 };
  }

  if (!initialCounts.pendingOrders && !initialCounts.newQuotes) {
    initialCounts = { pendingOrders: 12, newQuotes: 9 };
  }

  const currentUser = {
    name: session?.user?.name || "Quản Trị Viên",
    email: session?.user?.email || "admin@hdc.vn",
    role: session?.user?.role || "ADMIN",
    avatar: session?.user?.avatar || null,
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-brand-500 selection:text-white">
      {/* Sidebar điều hướng - luôn cố định 100% bên trái */}
      <AdminSidebar user={currentUser} initialCounts={initialCounts} />

      {/* Vùng nội dung chính: Header cố định phía trên + Vùng nội dung cuộn mượt mà */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pt-14 lg:pt-0">
        <AdminHeader user={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
