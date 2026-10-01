"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Edit,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const CATEGORY_NAMES = {
  corporate: "Doanh Nghiệp",
  bespoke_suit: "Vest / Suit",
  sport_golf: "Thể Thao / Golf",
  school: "Học Sinh / Trường Học",
  accessories: "Phụ Kiện",
};

export default function ProductsTable({
  products = [],
  pagination = {},
  onPageChange,
  onDeleteProduct,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;

  // State cho dialog xác nhận xoá
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (onDeleteProduct) {
        await onDeleteProduct(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-50" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">
              Chưa có sản phẩm nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold w-16">Ảnh</th>
                <th className="py-3.5 px-4 font-semibold">Tên sản phẩm / SKU</th>
                <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                <th className="py-3.5 px-4 font-semibold">Giá bán</th>
                <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-center">Nổi bật</th>
                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((product) => {
                const thumbnail =
                  product.images?.[0] ||
                  product.image ||
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200";
                const categoryLabel =
                  CATEGORY_NAMES[product.category] || product.category || "Đồng phục";

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Ảnh thumbnail (48x48) */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative shrink-0">
                        <Image
                          src={thumbnail}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    {/* Tên SP + SKU */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-bold text-slate-200 hover:text-blue-400 transition-colors line-clamp-1 max-w-[280px]"
                      >
                        {product.title}
                      </Link>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <Link
                          href={`/san-pham/${product.slug || product.id}`}
                          target="_blank"
                          className="text-slate-400 hover:text-white flex items-center gap-0.5 hover:underline"
                        >
                          <span>Xem ngoài web</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60">
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Giá bán */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-400">
                        {formatVND(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[11px] font-mono text-slate-400 line-through">
                          {formatVND(product.originalPrice)}
                        </div>
                      )}
                    </td>

                    {/* Trạng thái (Published) */}
                    <td className="py-3.5 px-4 text-center">
                      {product.published ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Bản nháp
                        </span>
                      )}
                    </td>

                    {/* Nổi bật (Featured) */}
                    <td className="py-3.5 px-4 text-center">
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>Ghim</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Hành động */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="px-2.5 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Sửa</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xoá</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Hiển thị <span className="font-bold text-white">{products.length}</span>{" "}
          trên tổng số <span className="font-bold text-white">{total}</span> sản phẩm
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-300 px-2 font-medium">
            Trang {page} / {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
            aria-label="Trang tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Xác nhận xoá sản phẩm?</h3>
              <p className="text-xs text-slate-400">
                Bạn có chắc chắn muốn xoá sản phẩm{" "}
                <span className="text-white font-bold">&quot;{deleteTarget.title}&quot;</span>?
                Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xoá...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xoá vĩnh viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
