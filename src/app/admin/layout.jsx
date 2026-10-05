import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export const metadata = {
  title: "Dashboard Overview | HDC Fashion Admin",
  description: "Executive analytics and operations platform",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }) {
  const session = null;
  const initialCounts = { pendingOrders: 12, newQuotes: 9 };

  const currentUser = {
    name: "Salung",
    agency: "HDC Fashion Studio",
    role: "ADMIN",
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col lg:flex-row font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-200 bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-white">
      {/* Sidebar - fixed left */}
      <AdminSidebar user={currentUser} initialCounts={initialCounts} />

      {/* Main Area: Top Header + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pt-12 lg:pt-0">
        <AdminHeader user={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors duration-200">
          <div className="max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-7 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
