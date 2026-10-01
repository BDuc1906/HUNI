"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  RefreshCw,
  RotateCcw,
  Package,
} from "lucide-react";
import { productsService } from "@/shared/services/apiClient";
import ProductsTable from "./components/ProductsTable";

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả danh mục" },
  { value: "corporate", label: "Đồng Phục Doanh Nghiệp" },
  { value: "bespoke_suit", label: "May Đo / Vest Suit" },
  { value: "sport_golf", label: "Thể Thao / Golf" },
  { value: "school", label: "Học Sinh & Trường Học" },
  { value: "accessories", label: "Phụ Kiện Doanh Nghiệp" },
];

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đã xuất bản" },
  { value: "draft", label: "Bản nháp" },
  { value: "featured", label: "Nổi bật" },
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadProducts = useCallback(async () => {
    try {
      const params = {
        page,
        limit: 12,
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };

      if (statusFilter === "published") {
        params.published = "true";
      } else if (statusFilter === "draft") {
        params.published = "false";
      } else if (statusFilter === "featured") {
        params.featured = "true";
        params.published = "all";
      } else {
        params.published = "all";
      }

      const res = await productsService.getProducts(params);
      if (res?.success && res?.data) {
        setProducts(res.data.products || []);
        if (res.data.total !== undefined) {
          setPagination({
            page: res.data.page || 1,
            limit: res.data.limit || 12,
            total: res.data.total,
            totalPages: res.data.totalPages || 1,
          });
        }
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    loadProducts().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadProducts]);

  const handleManualRefresh = () => {
    setLoading(true);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    const res = await productsService.deleteProduct(id);
    if (res?.success) {
      setToastMessage("✅ Đã xoá sản phẩm thành công");
      setTimeout(() => setToastMessage(""), 4000);
      loadProducts();
    } else {
      alert(res?.error || "Không thể xoá sản phẩm");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCategoryFilter("");
    setStatusFilter("all");
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
            <span>Quản Lý Sản Phẩm</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              {pagination.total} sản phẩm
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị danh mục áo thun polo, sơ mi, vest suit, bảng giá sỉ và bộ sưu tập
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
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Ô tìm kiếm (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã SKU, chất liệu..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Chọn danh mục (4 cols) */}
          <div className="lg:col-span-4">
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

          {/* Toggle trạng thái (3 cols) */}
          <div className="lg:col-span-3 flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  setPage(1);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                  statusFilter === f.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || categoryFilter || statusFilter !== "all") && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xoá tất cả bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Bảng sản phẩm */}
      <ProductsTable
        products={products}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
}
