"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO } from "@/shared/data";
import {
  X,
  CreditCard,
  Building,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  FileText,
  Truck,
  Phone,
  Sparkles,
  Loader2
} from "lucide-react";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartTotal,
    saveOrder,
    showToast
  } = useShop();

  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // VAT
  const [needVat, setNeedVat] = useState(false);
  const [taxCode, setTaxCode] = useState("");
  const [vatCompanyAddress, setVatCompanyAddress] = useState("");
  const [vatEmail, setVatEmail] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("vietqr");
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isCheckoutOpen) return null;

  const depositAmount = Math.round(cartTotal * 0.3);
  const currentPayAmount =
    paymentMethod === "deposit30"
      ? depositAmount
      : paymentMethod === "vietqr"
      ? cartTotal
      : 0;

  const vietQrUrl = `https://api.vietqr.io/image/970422-0984959586-compact2.jpg?amount=${currentPayAmount}&addInfo=HUNI%20${phone || "DONHANG"}&accountName=HDC%20GROUP%20VN`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BRAND_INFO.bankInfo.accountNumber);
    setCopiedBank(true);
    showToast("Đã sao chép số tài khoản MB Bank!");
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // ==================================================
  // Submit đơn hàng qua API thật
  // ==================================================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast("Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ", "error");
      return;
    }

    const orderData = {
      customer: { fullName, phone, email, address, companyName },
      vatInfo: needVat
        ? {
            taxCode,
            companyName,
            companyAddress: vatCompanyAddress,
            email: vatEmail,
          }
        : null,
      paymentMethod:
        paymentMethod === "vietqr"
          ? "Chuyển khoản VietQR 100%"
          : paymentMethod === "deposit30"
          ? `Đặt cọc 30% (${depositAmount.toLocaleString("vi-VN")} đ)`
          : "Đặt lịch may mẫu thử 0đ",
      notes: orderNotes,
    };

    try {
      setSubmitting(true);
      const newOrder = await saveOrder(orderData);
      setPlacedOrder(newOrder);
      setStep(2);
    } catch (error) {
      console.error("[Checkout] Save order error:", error);
      showToast(
        error.message || "Không thể gửi đơn. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setPlacedOrder(null);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
        {/* =============================================
            Header
            ============================================= */}
        <div className="bg-[#071b34] text-white p-3 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-full aspect-square overflow-hidden border-2 border-amber-400/60 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <span className="absolute font-black text-sm text-[#071b34]">HN</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HUNI Logo"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-lg truncate">
                {step === 1 ? "Đặt Hàng & May Đồng Phục" : "Đặt May Thành Công!"}
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-200/80 truncate">
                HDC GROUP VN • Xưởng sản xuất trực tiếp
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Đóng"
            disabled={submitting}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* =============================================
            STEP 1 — Form & Payment
            ============================================= */}
        {step === 1 ? (
          <form
            onSubmit={handleSubmitOrder}
            className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6"
          >
            {/* =========================================
                1. Customer Information
                ========================================= */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071b34] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>1. Thông Tin Doanh Nghiệp</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    SĐT / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0984.xxx.xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tên công ty / Tổ chức
                  </label>
                  <input
                    type="text"
                    placeholder="Công ty CP Tập Đoàn..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email nhận hợp đồng
                  </label>
                  <input
                    type="email"
                    placeholder="email@doanhnghiep.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Địa chỉ nhận hàng / Đo số đo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, Tòa nhà, Đường, Quận/Huyện, Tỉnh/TP..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Cần giao trước 20/10, logo thêu màu vàng..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 resize-none disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* =========================================
                2. VAT Invoice
                ========================================= */}
            <div className="p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="flex items-start gap-2 cursor-pointer text-xs sm:text-sm font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={needVat}
                  onChange={(e) => setNeedVat(e.target.checked)}
                  disabled={submitting}
                  className="w-4 h-4 text-amber-600 rounded mt-0.5 shrink-0"
                />
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                  <span>Yêu cầu xuất hóa đơn VAT điện tử</span>
                </span>
              </label>

              {needVat && (
                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Mã số thuế
                    </label>
                    <input
                      type="text"
                      placeholder="010xxxxxxx"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      disabled={submitting}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Email nhận HĐ điện tử
                    </label>
                    <input
                      type="email"
                      placeholder="ketoan@congty.com"
                      value={vatEmail}
                      onChange={(e) => setVatEmail(e.target.value)}
                      disabled={submitting}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-medium text-slate-700 block mb-1">
                      Địa chỉ đăng ký kinh doanh
                    </label>
                    <input
                      type="text"
                      placeholder="Địa chỉ theo giấy ĐKKD"
                      value={vatCompanyAddress}
                      onChange={(e) => setVatCompanyAddress(e.target.value)}
                      disabled={submitting}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* =========================================
                3. Payment Method
                ========================================= */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071b34] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>2. Phương Thức Thanh Toán</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("vietqr")}
                  disabled={submitting}
                  className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all active:scale-[0.98] disabled:opacity-60 ${
                    paymentMethod === "vietqr"
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === "vietqr"
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        VietQR 100%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Chuyển khoản nhanh 24/7
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("deposit30")}
                  disabled={submitting}
                  className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all active:scale-[0.98] disabled:opacity-60 ${
                    paymentMethod === "deposit30"
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === "deposit30"
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        Đặt cọc 30%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Còn lại khi nhận hàng
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("freesample")}
                  disabled={submitting}
                  className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all active:scale-[0.98] disabled:opacity-60 ${
                    paymentMethod === "freesample"
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === "freesample"
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        May mẫu 0đ
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Duyệt mẫu trước khi cọc
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* VietQR Display Box */}
              {(paymentMethod === "vietqr" || paymentMethod === "deposit30") && (
                <div className="p-3 sm:p-4 bg-[#071b34] text-white rounded-xl sm:rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg text-center">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={vietQrUrl}
                        alt="VietQR HUNI Uniform"
                        fill
                        sizes="144px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="text-[9px] text-slate-600 font-bold mt-1">
                      VietQR NAPAS 24/7
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs flex-1 min-w-0 w-full">
                    <div className="text-amber-400 font-extrabold text-sm sm:text-base">
                      Số tiền: {currentPayAmount.toLocaleString("vi-VN")} đ
                    </div>
                    <div className="text-[11px] sm:text-xs">
                      Ngân hàng: <strong className="text-white">{BRAND_INFO.bankInfo.bankName}</strong>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] sm:text-xs">
                      <span>
                        STK: <strong className="text-white">{BRAND_INFO.bankInfo.accountNumber}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="text-amber-400 hover:text-amber-300 p-1 active:scale-90 transition-transform"
                        title="Sao chép STK"
                        aria-label="Sao chép số tài khoản"
                      >
                        {copiedBank ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] sm:text-xs">
                      Chủ TK: <strong className="text-white">{BRAND_INFO.bankInfo.accountHolder}</strong>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 pt-1 border-t border-slate-700 mt-2">
                      Nội dung CK:{" "}
                      <strong className="text-amber-300">HUNI {phone || "DONHANG"}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================
                4. Total & Submit
                ========================================= */}
            <div className="pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <div className="text-[11px] sm:text-xs text-slate-500">
                  Tổng thanh toán đơn hàng:
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#071b34]">
                  {cartTotal.toLocaleString("vi-VN")} đ
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                  (Bao gồm phí may mẫu, thiết kế 3D và giao hàng)
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Đang gửi đơn...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Xác Nhận Đặt Hàng</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* =============================================
              STEP 2 — Success
              ============================================= */
          <div className="p-6 sm:p-8 text-center space-y-4 sm:space-y-5 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#071b34]">
                ĐẶT HÀNG THÀNH CÔNG!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Cảm ơn quý khách đã tin tưởng lựa chọn thương hiệu đồng phục{" "}
                <strong>HUNI Uniform</strong>.
              </p>
            </div>

            {placedOrder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Mã đơn hàng:</span>
                  <strong className="text-amber-900 font-black text-xs sm:text-sm text-right">
                    {placedOrder.orderNumber || placedOrder.id}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Khách hàng:</span>
                  <strong className="text-slate-800 text-right truncate">
                    {placedOrder.customer?.fullName}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Số điện thoại:</span>
                  <strong className="text-slate-800 text-right">
                    {placedOrder.customer?.phone}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Tổng thanh toán:</span>
                  <strong className="text-amber-800 font-bold text-right">
                    {(placedOrder.total || 0).toLocaleString("vi-VN")} đ
                  </strong>
                </div>
                <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-amber-200">
                  <span className="text-slate-500 shrink-0">Trạng thái:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] text-right">
                    {placedOrder.status || "Đã tiếp nhận"}
                  </span>
                </div>
              </div>
            )}

            <div className="text-[11px] sm:text-xs text-slate-500 max-w-md mx-auto">
              Chuyên viên thiết kế của HUNI sẽ gọi lại cho quý khách trong vòng{" "}
              <strong className="text-[#071b34]">15 phút</strong> để xác nhận logo và gửi bản vẽ phối màu 3D!
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-5 sm:px-6 py-2.5 bg-[#071b34] text-amber-300 font-bold text-xs sm:text-sm rounded-xl shadow active:scale-95 transition-transform"
              >
                Tiếp tục xem sản phẩm
              </button>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-5 sm:px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Hotline: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}