"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  Trash2,
  CheckCircle2,
  EyeOff,
  Eye,
  AlertTriangle,
  Loader2,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ReviewsTable({
  reviews = [],
  pagination = {},
  onPageChange,
  onUpdateStatus,
  onDeleteReview,
  onDeleteMultipleReviews,
  onOpenReplyModal,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Chọn / Bỏ chọn tất cả
  const isAllSelected =
    reviews.length > 0 && reviews.every((r) => selectedIds.includes(r.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(reviews.map((r) => r.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newSelected = new Set(selectedIds);
      reviews.forEach((r) => newSelected.add(r.id));
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
      if (onDeleteReview) await onDeleteReview(deleteTarget.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkSubmitting(true);
    try {
      if (onDeleteMultipleReviews) {
        await onDeleteMultipleReviews(selectedIds);
      } else if (onDeleteReview) {
        for (const id of selectedIds) {
          await onDeleteReview(id);
        }
      }
      setSelectedIds([]);
      setIsBulkDeleting(false);
    } catch (err) {
      console.error("Error bulk deleting reviews:", err);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleBulkStatus = async (status) => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await onUpdateStatus(id, { status });
      }
      setSelectedIds([]);
    } catch (err) {
      console.error("Error updating bulk status:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* THANH THAO TÁC HÀNG LOẠT */}
      {selectedIds.length > 0 && (
        <div className="bg-[#002B34] border border-brand-500/30 px-4 py-3 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 font-bold text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs text-slate-200 font-medium">
              Đang chọn <strong className="text-white font-bold">{selectedIds.length}</strong> đánh giá
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatus("APPROVED")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Duyệt tất cả</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("HIDDEN")}
              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Ẩn tất cả</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors"
            >
              Bỏ chọn
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xoá {selectedIds.length} mục</span>
            </button>
          </div>
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-xs">Đang tải danh sách đánh giá...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Chưa có đánh giá nào
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không tìm thấy đánh giá phản hồi phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px]">
                  {/* Hộp kiểm chọn tất cả */}
                  <th className="py-3.5 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả trang này"}
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
                  <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                  <th className="py-3.5 px-4 font-semibold">Sản phẩm</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Số sao</th>
                  <th className="py-3.5 px-4 font-semibold">Nội dung nhận xét & Phản hồi</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((rev) => {
                  const isSelected = selectedIds.includes(rev.id);
                  const initial = rev.customerName?.charAt(0).toUpperCase() || "K";

                  return (
                    <tr
                      key={rev.id}
                      className={`transition-colors group ${
                        isSelected
                          ? "bg-brand-50/50 hover:bg-brand-50/80"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(rev.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* Khách hàng */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-[#003843] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {rev.customerName}
                            </div>
                            <div className="text-[11px] text-brand-600 font-mono font-medium">
                              {rev.customerPhone}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {rev.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sản phẩm */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                            <Image
                              src={rev.productImage || "/images/06_polo_01.jpg"}
                              alt={rev.productTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <div className="font-semibold text-slate-900 truncate text-xs hover:text-brand-600 transition-colors">
                              {rev.productTitle}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              SKU: {rev.productSku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Số sao */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-amber-600 font-mono">
                            {rev.rating}.0 / 5
                          </span>
                        </div>
                      </td>

                      {/* Nội dung đánh giá & Phản hồi */}
                      <td className="py-3.5 px-4 max-w-[340px]">
                        <p className="text-slate-800 text-xs line-clamp-2 leading-relaxed font-normal">
                          &ldquo;{rev.content}&rdquo;
                        </p>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Phản hồi từ Admin nếu có */}
                        {rev.adminReply && (
                          <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                            <div className="flex items-center gap-1.5 text-brand-700 font-bold">
                              <Sparkles className="w-3 h-3 text-brand-600" />
                              <span>HDC Fashion phản hồi:</span>
                            </div>
                            <p className="text-slate-600 italic line-clamp-2">
                              {rev.adminReply}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        {rev.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã duyệt</span>
                          </span>
                        ) : rev.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 animate-pulse">
                            <span>Chờ duyệt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <EyeOff className="w-3 h-3" />
                            <span>Đã ẩn</span>
                          </span>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {rev.status === "APPROVED" ? (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(rev.id, { status: "HIDDEN" })}
                              title="Ẩn đánh giá này khỏi web"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border border-slate-200 transition-colors"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(rev.id, { status: "APPROVED" })}
                              title="Duyệt hiển thị đánh giá này"
                              className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenReplyModal(rev)}
                            title="Soạn câu trả lời gửi khách hàng"
                            className="px-2.5 py-1.5 rounded-lg text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-medium text-xs transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{rev.adminReply ? "Sửa TL" : "Trả lời"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(rev)}
                            title="Xoá vĩnh viễn đánh giá này"
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Phân trang */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{reviews.length}</span>{" "}
            trên tổng số <span className="font-bold text-slate-900">{total}</span> đánh giá
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-2xs transition-colors"
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
              className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-2xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Single Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Xác nhận xoá đánh giá?</h3>
              <p className="text-xs text-slate-500">
                Xoá đánh giá của <strong className="text-slate-900">{deleteTarget.customerName}</strong> cho sản phẩm{" "}
                <strong className="text-slate-900">{deleteTarget.productTitle}</strong>?
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
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isDeleting ? "Đang xoá..." : "Xoá vĩnh viễn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Multiple Modal */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Xoá hàng loạt {selectedIds.length} đánh giá?
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ <strong className="text-rose-600 font-bold">{selectedIds.length}</strong> đánh giá đã chọn sẽ bị xoá vĩnh viễn khỏi hệ thống.
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
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isBulkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isBulkSubmitting ? "Đang xoá..." : "Xác nhận xoá"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
