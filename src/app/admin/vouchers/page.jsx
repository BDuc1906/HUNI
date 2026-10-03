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
      } else {
        setVouchers([]);
      }
    } catch (err) {
      console.error("Error loading vouchers:", err);
      setVouchers([]);
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
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản Lý Voucher & Mã Khuyến Mãi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              {vouchers.length} mã
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập chiết khấu đơn may đồng phục, mã ưu đãi doanh nghiệp và theo dõi lượt dùng
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
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo voucher mới</span>
          </button>
        </div>
      </div>

      {/* Summary Banner (3 Thống kê nhanh) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Đang hoạt động</div>
            <div className="text-base font-black text-emerald-600 font-mono">
              {stats.activeCount} voucher
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Đã hết hạn</div>
            <div className="text-base font-black text-rose-600 font-mono">
              {stats.expiredCount} voucher
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Tổng lượt đã dùng</div>
            <div className="text-base font-black text-slate-900 font-mono">
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
