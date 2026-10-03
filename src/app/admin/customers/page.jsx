"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Users,
  Crown,
  ShoppingBag,
  RefreshCw,
  RotateCcw,
  Building2,
} from "lucide-react";
import { adminService } from "@/shared/services/apiClient";
import CustomersTable from "./components/CustomersTable";
import CustomerDetailPanel from "./components/CustomerDetailPanel";

const SORT_OPTIONS = [
  { value: "latest", label: "Mới đăng ký nhất" },
  { value: "mostOrders", label: "Nhiều đơn hàng nhất" },
  { value: "alphabetical", label: "Theo tên (A - Z)" },
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadCustomers = useCallback(async () => {
    try {
      const params = {
        page,
        limit: 20,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };

      const res = await adminService.getCustomers(params);
      if (res?.success && res?.data) {
        setCustomers(res.data.customers || []);
        if (res.data.total !== undefined) {
          setPagination({
            page: res.data.page || 1,
            limit: res.data.limit || 20,
            total: res.data.total,
            totalPages: res.data.totalPages || 1,
          });
        }
      } else {
        setCustomers([]);
        setPagination({ page: 1, limit: 20, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error loading customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    loadCustomers().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadCustomers]);

  const handleManualRefresh = () => {
    setLoading(true);
    loadCustomers();
  };

  // Client-side sorting for display
  const sortedCustomers = useMemo(() => {
    const list = [...customers];
    if (sortBy === "mostOrders") {
      list.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "vi"));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [customers, sortBy]);

  // Summary counts
  const vipCount = useMemo(
    () => customers.filter((c) => (c.orderCount || 0) >= 5).length,
    [customers]
  );
  const totalOrdersCount = useMemo(
    () => customers.reduce((sum, c) => sum + (c.orderCount || 0), 0),
    [customers]
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSortBy("latest");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản Lý Khách Hàng (CRM)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              {pagination.total} hồ sơ
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu thông tin liên hệ, lịch sử đặt may đồng phục và phân nhóm khách hàng VIP
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Tổng số khách hàng</div>
            <div className="text-base font-black text-slate-900 font-mono">
              {pagination.total} khách
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Khách hàng VIP (≥ 5 đơn)</div>
            <div className="text-base font-black text-amber-600 font-mono">
              {vipCount} đối tác
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Tổng đơn từ khách hàng</div>
            <div className="text-base font-black text-emerald-600 font-mono">
              {totalOrdersCount} đơn hàng
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {/* Ô tìm kiếm */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách hàng, số điện thoại, email, tên công ty..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Sắp xếp */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {searchTerm && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                title="Xoá tìm kiếm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <CustomersTable
        customers={sortedCustomers}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onSelectCustomer={handleSelectCustomer}
        loading={loading}
      />

      {/* Slide-in Customer Detail Panel */}
      <CustomerDetailPanel
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
