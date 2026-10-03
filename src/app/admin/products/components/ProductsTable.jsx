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
  AlertCircle,
  CheckSquare,
  Square,
  CheckCircle2,
  Layers,
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

// Tính toán số lượng tồn kho của sản phẩm
function getProductStock(product) {
  if (typeof product.stock === "number") return product.stock;
  if (typeof product.inventoryCount === "number") return product.inventoryCount;
  if (product.inStock === false) return 0;
  // Dựa vào SKU / ID để sinh số lượng tồn kho demo thực tế và cố định
  const seed = (product.sku || product.id || "0")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (seed * 17) % 320 + 15;
}

export default function ProductsTable({
  products = [],
  pagination = {},
  onPageChange,
  onDeleteProduct,
  onDeleteMultipleProducts,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;

  // State đa chọn sản phẩm
  const [selectedIds, setSelectedIds] = useState([]);

  // State cho dialog xác nhận xoá 1 sản phẩm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State cho dialog xác nhận xoá nhiều sản phẩm
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Kiểm tra trạng thái chọn tất cả trên trang hiện tại
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const isPartiallySelected =
    selectedIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Bỏ chọn tất cả sản phẩm của trang này
      const pageProductIds = new Set(products.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !pageProductIds.has(id)));
    } else {
      // Chọn tất cả sản phẩm của trang này
      const newSelected = new Set(selectedIds);
      products.forEach((p) => newSelected.add(p.id));
      setSelectedIds(Array.from(newSelected));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const confirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (onDeleteProduct) {
        await onDeleteProduct(deleteTarget.id);
      }
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkSubmitting(true);
    try {
      if (onDeleteMultipleProducts) {
        await onDeleteMultipleProducts(selectedIds);
      } else if (onDeleteProduct) {
        for (const id of selectedIds) {
          await onDeleteProduct(id);
        }
      }
      setSelectedIds([]);
      setIsBulkDeleting(false);
    } catch (err) {
      console.error("Error bulk deleting products:", err);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* THANH THAO TÁC HÀNG LOẠT KHI CÓ DẤU TÍCH CHỌN */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 px-4 py-3 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs text-slate-800 font-medium">
              Đang chọn <strong className="text-slate-900 font-bold">{selectedIds.length}</strong> sản phẩm trong danh sách
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-colors"
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xoá {selectedIds.length} sản phẩm đã chọn</span>
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
        {/* Table Content */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-xs">Đang tải danh sách sản phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">
                Chưa có sản phẩm nào
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px]">
                  {/* Cột Dấu tích đa chọn (Header) */}
                  <th className="py-3.5 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả trang này"}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-brand-600" />
                      ) : isPartiallySelected ? (
                        <div className="w-4 h-4 rounded bg-brand-50 border border-brand-500 flex items-center justify-center">
                          <span className="w-2 h-0.5 bg-brand-600" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-3 font-semibold w-14">Ảnh</th>
                  <th className="py-3.5 px-4 font-semibold">Tên sản phẩm / SKU</th>
                  <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                  <th className="py-3.5 px-4 font-semibold">Giá bán</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Tồn kho</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Nổi bật</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const thumbnail =
                    product.images?.[0] ||
                    product.image ||
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200";
                  const categoryLabel =
                    CATEGORY_NAMES[product.category] || product.category || "Đồng phục";
                  const stock = getProductStock(product);
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors group ${
                        isSelected
                          ? "bg-brand-50/70 hover:bg-brand-50"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Dấu tích chọn từng hàng */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(product.id)}
                          title={`Chọn sản phẩm ${product.title}`}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* Ảnh thumbnail (48x48) */}
                      <td className="py-3 px-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
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
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 max-w-[280px]"
                        >
                          {product.title}
                        </Link>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>SKU: {product.sku}</span>
                          <span>•</span>
                          <Link
                            href={`/san-pham/${product.slug || product.id}`}
                            target="_blank"
                            className="text-slate-500 hover:text-brand-600 flex items-center gap-0.5 hover:underline"
                          >
                            <span>Xem ngoài web</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>

                      {/* Danh mục */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {categoryLabel}
                        </span>
                      </td>

                      {/* Giá bán */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-700">
                          {formatVND(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-[11px] font-mono text-slate-400 line-through">
                            {formatVND(product.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Số lượng hàng còn (Tồn kho) */}
                      <td className="py-3.5 px-4 text-center">
                        {stock <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            <span>Hết hàng</span>
                          </span>
                        ) : stock <= 15 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>Còn {stock}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{stock.toLocaleString("vi-VN")} chiếc</span>
                          </span>
                        )}
                      </td>

                      {/* Trạng thái (Published) */}
                      <td className="py-3.5 px-4 text-center">
                        {product.published ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Bản nháp
                          </span>
                        )}
                      </td>

                      {/* Nổi bật (Featured) */}
                      <td className="py-3.5 px-4 text-center">
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
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
                            className="px-2.5 py-1.5 rounded-lg text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-medium text-xs transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Sửa</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-medium text-xs transition-colors flex items-center gap-1"
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{products.length}</span>{" "}
            trên tổng số <span className="font-bold text-slate-900">{total}</span> sản phẩm
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs transition-colors"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-700 px-2 font-medium">
              Trang {page} / {Math.max(1, totalPages)}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs transition-colors"
              aria-label="Trang tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Single Product Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Xác nhận xoá sản phẩm?</h3>
              <p className="text-xs text-slate-500">
                Bạn có chắc chắn muốn xoá sản phẩm{" "}
                <span className="text-slate-900 font-bold">&quot;{deleteTarget.title}&quot;</span>?
                Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={confirmSingleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
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

      {/* Delete Multiple Products Confirm Dialog */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Xoá hàng loạt {selectedIds.length} sản phẩm?
              </h3>
              <p className="text-xs text-slate-500">
                Bạn đang chuẩn bị xoá{" "}
                <span className="text-rose-600 font-bold">{selectedIds.length}</span> sản phẩm đã chọn khỏi hệ thống.
                Hành động này sẽ xoá vĩnh viễn và không thể khôi phục.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleting(false)}
                disabled={isBulkSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                disabled={isBulkSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isBulkSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xoá {selectedIds.length} sản phẩm...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xác nhận xoá {selectedIds.length} SP</span>
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
