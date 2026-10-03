"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Truck,
  PackageX,
} from "lucide-react";
import { adminService } from "@/shared/services/apiClient";
import ReturnsTable from "./components/ReturnsTable";
import ReturnDetailModal from "./components/ReturnDetailModal";

const TYPE_FILTERS = [
  { value: "", label: "Tất cả loại yêu cầu" },
  { value: "EXCHANGE", label: "🔄 1 Đổi 1 (Sản phẩm mới)" },
  { value: "REFUND", label: "💸 Hoàn tiền (Chuyển khoản)" },
];

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "🟡 Chờ tiếp nhận" },
  { value: "PROCESSING", label: "🔵 Đang xử lý / Kiểm hàng" },
  { value: "EXCHANGED", label: "🟣 Đã đổi hàng mới" },
  { value: "REFUNDED", label: "🟢 Đã hoàn tiền" },
  { value: "REJECTED", label: "🔴 Từ chối yêu cầu" },
];

export default function AdminReturnsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [returns, setReturns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [activeModalItem, setActiveModalItem] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadReturns = useCallback(async () => {
    try {
      const params = {
        page,
        limit: 10,
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };

      const res = await adminService.getReturns(params);
      if (res?.success && res?.data) {
        setReturns(res.data.returns || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error loading return requests:", err);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    loadReturns().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadReturns]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleManualRefresh = () => {
    setLoading(true);
    loadReturns();
  };

  const handleUpdateStatus = async (id, data) => {
    try {
      const res = await adminService.updateReturn(id, data);
      if (res?.success) {
        setReturns((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data, ...(res.data || {}) } : r))
        );
        showToast("✅ Đã cập nhật yêu cầu đổi trả");
        return;
      }
    } catch (err) {
      console.error("Error updating return request:", err);
    }
    // Fallback UI
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
    showToast("✅ Đã cập nhật yêu cầu đổi trả (Demo)");
  };

  const handleDeleteReturn = async (id) => {
    try {
      const res = await adminService.deleteReturn(id);
      if (res?.success) {
        setReturns((prev) => prev.filter((r) => r.id !== id));
        setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        showToast("✅ Đã xoá yêu cầu đổi trả");
        return;
      }
    } catch (err) {
      console.error("Error deleting return request:", err);
    }
    // Fallback UI
    setReturns((prev) => prev.filter((r) => r.id !== id));
    setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    showToast("✅ Đã xoá yêu cầu đổi trả (Demo)");
  };

  const handleDeleteMultipleReturns = async (ids) => {
    try {
      const res = await adminService.deleteReturn(ids);
      if (res?.success) {
        setReturns((prev) => prev.filter((r) => !ids.includes(r.id)));
        setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - ids.length) }));
        showToast(`✅ Đã xoá ${ids.length} yêu cầu thành công`);
        return;
      }
    } catch (err) {
      console.error("Error deleting multiple returns:", err);
    }
    // Fallback UI
    setReturns((prev) => prev.filter((r) => !ids.includes(r.id)));
    setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - ids.length) }));
    showToast(`✅ Đã xoá ${ids.length} yêu cầu thành công (Demo)`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setTypeFilter("");
    setStatusFilter("all");
    setPage(1);
  };

  // Tính toán nhanh số liệu thống kê
  const totalCount = pagination.total || returns.length;
  const pendingCount = returns.filter((r) => r.status === "PENDING").length;
  const processingCount = returns.filter((r) => r.status === "PROCESSING").length;
  const resolvedCount = returns.filter(
    (r) => r.status === "EXCHANGED" || r.status === "REFUNDED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span>Đổi Trả & Hoàn Tiền</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              {totalCount} yêu cầu
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tiếp nhận khiếu nại, thẩm định chất lượng đồng phục, giải quyết chính sách 1 đổi 1 và hoàn tiền
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

      {/* Thẻ Thống Kê Tổng Quan (Stats Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng yêu cầu */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tổng Yêu Cầu
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tất cả thời gian</div>
          </div>
        </div>

        {/* Card 2: Chờ tiếp nhận */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Chờ Tiếp Nhận
            </div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{pendingCount}</div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Cần liên hệ khách ngay</div>
          </div>
        </div>

        {/* Card 3: Đang kiểm hàng */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Đang Xử Lý / Thu Hồi
            </div>
            <div className="text-2xl font-black text-brand-600 mt-0.5">{processingCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Shipper đang giao nhận</div>
          </div>
        </div>

        {/* Card 4: Đã hoàn tất */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Đã Giải Quyết Xong
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{resolvedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Đổi mới & Hoàn tiền đủ</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Ô tìm kiếm (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã RT, đơn hàng, khách hàng, số điện thoại..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Lọc theo loại hình (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo trạng thái (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nút đặt lại bộ lọc (1 col) */}
          <div className="lg:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="w-full sm:w-auto p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bảng Dữ Liệu Đổi Trả */}
      <ReturnsTable
        returns={returns}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteReturn={handleDeleteReturn}
        onDeleteMultipleReturns={handleDeleteMultipleReturns}
        onOpenDetailModal={(item) => setActiveModalItem(item)}
        loading={loading}
      />

      {/* Modal Chi Tiết & Xử Lý */}
      {activeModalItem && (
        <ReturnDetailModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
