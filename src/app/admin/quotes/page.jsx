"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { adminService } from "@/shared/services/apiClient";
import QuotesTable from "./components/QuotesTable";
import QuoteDetailPanel from "./components/QuoteDetailPanel";
import QuoteUpdateModal from "./components/QuoteUpdateModal";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "NEW", label: "🔔 Mới tiếp nhận" },
  { value: "CONTACTED", label: "📞 Đã liên hệ" },
  { value: "QUOTED", label: "📄 Đã báo giá" },
  { value: "CONVERTED", label: "✅ Đã chuyển đơn" },
  { value: "CLOSED", label: "🔒 Đã đóng" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả danh mục" },
  { value: "polo", label: "Áo Polo Đồng Phục" },
  { value: "shirt", label: "Sơ Mi Công Sở" },
  { value: "vest", label: "Vest / Suit Cao Cấp" },
  { value: "golf", label: "Trang Phục Golf" },
  { value: "school", label: "Đồng Phục Học Sinh" },
  { value: "accessories", label: "Phụ Kiện Đồng Phục" },
  { value: "corporate", label: "Đồng Phục Doanh Nghiệp" },
];

export default function AdminQuotesPage() {
  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  // Dữ liệu từ API
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Modal & Drawer State
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [quoteToUpdate, setQuoteToUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch danh sách báo giá
  const loadQuotes = useCallback(async () => {
    try {
      const params = {
        page,
        limit: 20,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };

      const res = await adminService.getQuotes(params);
      if (res?.success && res?.data) {
        setQuotes(res.data.quotes || []);
        if (res.data.total !== undefined) {
          setPagination({
            page: res.data.page || 1,
            limit: res.data.limit || 20,
            total: res.data.total,
            totalPages: res.data.totalPages || 1,
          });
        }
      } else {
        setQuotes([]);
        setPagination({ page: 1, limit: 20, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    loadQuotes().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadQuotes]);

  const handleManualRefresh = () => {
    setLoading(true);
    loadQuotes();
  };

  // Xử lý khi cập nhật báo giá thành công
  const handleUpdateSuccess = (updatedQuote) => {
    setToastMessage("✅ Đã cập nhật yêu cầu báo giá thành công");
    setTimeout(() => setToastMessage(""), 4000);

    setQuotes((prev) =>
      prev.map((q) => (q.id === updatedQuote.id ? { ...q, ...updatedQuote } : q))
    );

    if (selectedQuote && selectedQuote.id === updatedQuote.id) {
      setSelectedQuote((prev) => ({ ...prev, ...updatedQuote }));
    }

    loadQuotes();
  };

  // Mở Detail Drawer
  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  // Mở Update Modal
  const handleOpenUpdateModal = (quote) => {
    setQuoteToUpdate(quote);
    setIsUpdateModalOpen(true);
  };

  // Xuất file CSV
  const handleExportCSV = () => {
    if (quotes.length === 0) {
      alert("Không có báo giá nào để xuất file!");
      return;
    }

    const headers = [
      "Khách hàng",
      "SĐT",
      "Email",
      "Công ty",
      "Danh mục",
      "Số lượng",
      "Báo giá đề xuất (VNĐ)",
      "Trạng thái",
      "Ngày gửi",
    ];

    const rows = quotes.map((q) => [
      `"${q.fullName}"`,
      `"${q.phone}"`,
      `"${q.email || ""}"`,
      `"${q.company || ""}"`,
      `"${q.category}"`,
      q.quantity,
      q.estimatedPrice || 0,
      `"${q.status}"`,
      `"${new Date(q.createdAt).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bao-gia-hdc-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset filter
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setCategoryFilter("");
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
            <span>Quản Lý Yêu Cầu Báo Giá</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              {pagination.total} yêu cầu
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tiếp nhận nhu cầu may đo doanh nghiệp, tư vấn chất liệu vải và chốt đơn
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

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên khách, SĐT, email, công ty..."
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

          {/* Chọn danh mục */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center gap-2">
            {(searchTerm || statusFilter || categoryFilter) ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            ) : (
              <div className="w-full py-2 text-center text-[11px] text-slate-500 font-medium">
                Bộ lọc đang mặc định
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bảng báo giá */}
      <QuotesTable
        quotes={quotes}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onSelectQuote={handleSelectQuote}
        onOpenUpdateModal={handleOpenUpdateModal}
        loading={loading}
      />

      {/* Slide-in Quote Detail Panel */}
      <QuoteDetailPanel
        quote={selectedQuote}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenUpdateModal={(quote) => {
          setIsDetailOpen(false);
          handleOpenUpdateModal(quote);
        }}
      />

      {/* Quote Update Modal */}
      <QuoteUpdateModal
        quote={quoteToUpdate}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
