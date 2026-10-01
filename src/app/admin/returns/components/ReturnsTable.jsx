"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const STATUS_BADGES = {
  PENDING: {
    label: "Chờ Tiếp Nhận",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  PROCESSING: {
    label: "Đang Xử Lý",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  EXCHANGED: {
    label: "Đã Đổi Hàng",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  REFUNDED: {
    label: "Đã Hoàn Tiền",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  REJECTED: {
    label: "Từ Chối",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
};

export default function ReturnsTable({
  returns = [],
  pagination = {},
  onPageChange,
  onUpdateStatus,
  onDeleteReturn,
  onDeleteMultipleReturns,
  onOpenDetailModal,
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
    returns.length > 0 && returns.every((r) => selectedIds.includes(r.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(returns.map((r) => r.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newSelected = new Set(selectedIds);
      returns.forEach((r) => newSelected.add(r.id));
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
      if (onDeleteReturn) await onDeleteReturn(deleteTarget.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting return request:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkSubmitting(true);
    try {
      if (onDeleteMultipleReturns) {
        await onDeleteMultipleReturns(selectedIds);
      } else if (onDeleteReturn) {
        for (const id of selectedIds) {
          await onDeleteReturn(id);
        }
      }
      setSelectedIds([]);
      setIsBulkDeleting(false);
    } catch (err) {
      console.error("Error bulk deleting return requests:", err);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleBulkStatusChange = async (status) => {
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
    <div className="space-y-4">
      {/* THANH THAO TÁC HÀNG LOẠT (BULK ACTIONS BAR) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-indigo-950/90 to-slate-900 border border-indigo-700/50 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 text-xs font-black text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Đang chọn {selectedIds.length} yêu cầu đổi trả
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatusChange("PROCESSING")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chuyển sang Đang xử lý</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStatusChange("EXCHANGED")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Duyệt Đã đổi hàng</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStatusChange("REFUNDED")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Duyệt Đã hoàn tiền</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xoá {selectedIds.length} mục</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider select-none">
                <th className="py-3.5 px-4 w-12 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="p-1 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                    title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : isPartiallySelected ? (
                      <div className="w-4 h-4 rounded bg-indigo-500/30 border border-indigo-400 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-indigo-400" />
                      </div>
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Mã Yêu Cầu</th>
                <th className="py-3.5 px-4">Khách Hàng & Đơn Hàng</th>
                <th className="py-3.5 px-4">Sản Phẩm & SL</th>
                <th className="py-3.5 px-4">Loại Yêu Cầu</th>
                <th className="py-3.5 px-4">Tiền Hoàn (VNĐ)</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {loading && returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Đang tải danh sách yêu cầu đổi trả & hoàn tiền...</span>
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <RotateCcw className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="font-semibold text-slate-300">Không tìm thấy yêu cầu đổi trả nào</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Thử điều chỉnh lại từ khoá tìm kiếm hoặc bộ lọc trạng thái
                    </p>
                  </td>
                </tr>
              ) : (
                returns.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const badge = STATUS_BADGES[item.status] || STATUS_BADGES.PENDING;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* Checkbox chọn */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(item.id)}
                          className="p-1 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* Mã Yêu Cầu */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onOpenDetailModal(item)}
                          className="font-bold text-white font-mono hover:text-indigo-400 transition-colors text-left"
                        >
                          {item.id}
                        </button>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>

                      {/* Khách hàng & Đơn hàng */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{item.customerName}</div>
                        <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                        <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                          Đơn: {item.orderNumber}
                        </div>
                      </td>

                      {/* Sản phẩm & SL */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200 line-clamp-1 max-w-[200px]" title={item.productTitle}>
                          {item.productTitle}
                        </div>
                        <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                          SL: {item.quantity} cái
                        </div>
                      </td>

                      {/* Loại yêu cầu */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.type === "REFUND"
                              ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                              : "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {item.type === "REFUND" ? "💸 Hoàn Tiền" : "🔄 Đổi 1 - 1"}
                        </span>
                      </td>

                      {/* Số tiền hoàn */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {item.refundAmount > 0 ? (
                          <span className="text-emerald-400">
                            {item.refundAmount.toLocaleString("vi-VN")} đ
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">--</span>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenDetailModal(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Xem chi tiết & Xử lý"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Xoá yêu cầu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phân Trang */}
        {returns.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
            <div>
              Tổng cộng: <span className="font-bold text-white">{total}</span> yêu cầu
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-white">
                Trang {page} / {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN XOÁ ĐƠN LẺ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Xác nhận xoá yêu cầu {deleteTarget.id}?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Yêu cầu đổi trả của khách hàng{" "}
                <span className="font-semibold text-white">{deleteTarget.customerName}</span> sẽ
                bị xoá khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmSingleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/25 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Xoá Vĩnh Viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XOÁ HÀNG LOẠT */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Xoá hàng loạt {selectedIds.length} yêu cầu?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả {selectedIds.length} yêu cầu đổi trả đang chọn sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleting(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                disabled={isBulkSubmitting}
                onClick={confirmBulkDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/25 flex items-center gap-1.5"
              >
                {isBulkSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Xác Nhận Xoá Tất Cả</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
