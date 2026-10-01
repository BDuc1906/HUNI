"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import { adminService } from "@/shared/services/apiClient";
import OrdersTable from "./components/OrdersTable";
import OrderDetailPanel from "./components/OrderDetailPanel";
import OrderStatusUpdateModal from "./components/OrderStatusUpdateModal";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "⏳ Chờ xử lý" },
  { value: "QUOTED", label: "📋 Đã báo giá" },
  { value: "CONFIRMED", label: "✅ Đã xác nhận" },
  { value: "PRODUCING", label: "🔧 Đang may" },
  { value: "SHIPPED", label: "🚚 Đã giao hàng" },
  { value: "COMPLETED", label: "✔️ Hoàn thành" },
  { value: "CANCELLED", label: "❌ Đã huỷ" },
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Dữ liệu từ API
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({
    pending: 0,
    producing: 0,
    completed: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // State cho Detail Panel & Update Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch danh sách đơn hàng
  const loadOrders = useCallback(async () => {
    try {
      const params = {
        page,
        limit: 20,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      };

      const res = await adminService.getOrders(params);
      if (res?.success && res?.data) {
        setOrders(res.data.orders || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch, dateFrom, dateTo]);

  useEffect(() => {
    let ignore = false;
    loadOrders().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadOrders]);

  const handleManualRefresh = () => {
    setLoading(true);
    loadOrders();
  };

  // Xử lý khi cập nhật trạng thái đơn hàng thành công
  const handleUpdateSuccess = (updatedOrder) => {
    setToastMessage("✅ Đã cập nhật trạng thái đơn hàng thành công");
    setTimeout(() => setToastMessage(""), 4000);

    // Cập nhật lại trong danh sách
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
    );

    // Cập nhật detail panel nếu đang mở đúng đơn này
    if (selectedOrder && selectedOrder.id === updatedOrder.id) {
      setSelectedOrder((prev) => ({ ...prev, ...updatedOrder }));
    }

    // Làm mới lại bảng và summary
    loadOrders();
  };

  // Mở Detail Panel
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Mở Update Modal
  const handleOpenUpdateModal = (order) => {
    setOrderToUpdate(order);
    setIsUpdateModalOpen(true);
  };

  // Xuất file CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Không có đơn hàng nào để xuất file!");
      return;
    }

    const headers = [
      "Mã đơn",
      "Khách hàng",
      "SĐT",
      "Email",
      "Công ty",
      "Tổng tiền (VNĐ)",
      "PT Thanh toán",
      "Trạng thái",
      "Ngày tạo",
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.customer?.fullName || o.fullName || ""}"`,
      `"${o.customer?.phone || o.phone || ""}"`,
      `"${o.customer?.email || o.email || ""}"`,
      `"${o.customer?.company || o.company || ""}"`,
      o.total,
      `"${o.paymentMethod || ""}"`,
      `"${o.status}"`,
      `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `don-hang-hdc-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Quản Lý Đơn Hàng</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              {pagination.total} đơn
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến độ đơn may đồng phục, thanh toán và xử lý đơn hàng
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            ⏳
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Chờ xử lý</div>
            <div className="text-base font-extrabold text-amber-400 font-mono">
              {summary.pending} đơn
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold">
            🔧
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Đang may</div>
            <div className="text-base font-extrabold text-blue-400 font-mono">
              {summary.producing} đơn
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            ✔️
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Hoàn thành</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono">
              {summary.completed} đơn
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
            💰
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Tổng doanh thu</div>
            <div className="text-base font-extrabold text-white font-mono truncate">
              {formatVND(summary.totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Thanh Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã đơn, tên KH, SĐT, công ty..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Chọn trạng thái */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Từ ngày */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              title="Từ ngày"
            />
          </div>

          {/* Đến ngày + Nút Reset */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              title="Đến ngày"
            />
            {(searchTerm || statusFilter || dateFrom || dateTo) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors shrink-0"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bảng Đơn Hàng */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onSelectOrder={handleSelectOrder}
        onOpenUpdateModal={handleOpenUpdateModal}
        loading={loading}
      />

      {/* 5. Slide-in Order Detail Panel */}
      <OrderDetailPanel
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenUpdateModal={(order) => {
          setIsDetailOpen(false);
          handleOpenUpdateModal(order);
        }}
      />

      {/* 6. Order Status Update Modal */}
      <OrderStatusUpdateModal
        order={orderToUpdate}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
