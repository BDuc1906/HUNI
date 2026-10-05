import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | HDC Fashion",
  description: "Cổng điều hành HDC Fashion",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }) {
  const session = null;

  let initialCounts = { pendingOrders: 12, newQuotes: 9 };
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/admin/dashboard`, {
      cache: "no-store",
    }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.data?.statusCounts) {
        initialCounts = {
          pendingOrders: json.data.statusCounts.orders?.pending ?? 12,
          newQuotes: json.data.statusCounts.quotes?.new ?? 9,
        };
      }
    }
  } catch {
    /* ignore */
  }

  const currentUser = {
    name: session?.user?.name || "Quản Trị Viên",
    email: session?.user?.email || "admin@hdcfashion.vn",
    role: session?.user?.role || "ADMIN",
    avatar: session?.user?.avatar || null,
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-white text-slate-900 flex flex-col lg:flex-row font-sans">
      <AdminSidebar user={currentUser} initialCounts={initialCounts} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pt-14 lg:pt-0 bg-white">
        <AdminHeader user={currentUser} />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}