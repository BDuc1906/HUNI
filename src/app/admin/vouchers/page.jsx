"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Tag,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { adminService } from "@/shared/services/apiClient";
import VouchersTable from "./components/VouchersTable";
import CreateVoucherModal from "./components/CreateVoucherModal";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadVouchers = useCallback(async () => {
    try {
      const res = await adminService.getVouchers();
      if (res?.success && res?.data) {
        setVouchers(res.data.vouchers || []);
      }
    } catch (err) {
      console.error("Error loading vouchers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    loadVouchers().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [loadVouchers]);

  const handleManualRefresh = () => {
    setLoading(true);
    loadVouchers();
  };

  const handleToggleActive = async (voucher) => {
    const newActiveState = !voucher.active;
    try {
      const res = await adminService.updateVoucherStatus(voucher.id, newActiveState);
      if (res?.success) {
        setToastMessage(
          newActiveState
            ? `✅ Đã kích hoạt voucher ${voucher.code}`
            : `ℹ️ Đã vô hiệu hoá voucher ${voucher.code}`
        );
        setTimeout(() => setToastMessage(""), 4000);
        // Cập nhật state
        setVouchers((prev) =>
          prev.map((v) => (v.id === voucher.id ? { ...v, active: newActiveState } : v))
        );
      } else {
        alert(res?.error || "Không thể cập nhật trạng thái voucher");
      }
    } catch (err) {
      console.error("Error toggling voucher:", err);
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleCreateSuccess = (newVoucher) => {
    setToastMessage(`✅ Đã tạo voucher ${newVoucher.code} thành công`);
    setTimeout(() => setToastMessage(""), 4000);
    loadVouchers();
  };

  // Thống kê nhanh
  const stats = useMemo(() => {
    const now = new Date();
    const activeCount = vouchers.filter(
      (v) => v.active && (!v.expiresAt || new Date(v.expiresAt) >= now)
    ).length;
    const expiredCount = vouchers.filter(
      (v) => v.expiresAt && new Date(v.expiresAt) < now
    ).length;
    const totalUsage = vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);

    return { activeCount, expiredCount, totalUsage };
  }, [vouchers]);

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
            <span>Quản Lý Voucher & Mã Khuyến Mãi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              {vouchers.length} mã
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Thiết lập chiết khấu đơn may đồng phục, mã ưu đãi doanh nghiệp và theo dõi lượt dùng
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
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo voucher mới</span>
          </button>
        </div>
      </div>

      {/* Summary Banner (3 Thống kê nhanh) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Đang hoạt động</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono">
              {stats.activeCount} voucher
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Đã hết hạn</div>
            <div className="text-base font-extrabold text-rose-400 font-mono">
              {stats.expiredCount} voucher
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Tổng lượt đã dùng</div>
            <div className="text-base font-extrabold text-white font-mono">
              {stats.totalUsage} lượt áp dụng
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <VouchersTable
        vouchers={vouchers}
        onToggleActive={handleToggleActive}
        loading={loading}
      />

      {/* Create Voucher Modal */}
      <CreateVoucherModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
