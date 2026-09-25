"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { BRAND_INFO } from "@/shared/data";
import {
  X,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  FileText,
  Truck,
  Phone,
  Sparkles
} from "lucide-react";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    discountValue,
    cartCount,
    saveOrder,
    showToast
  } = useShop();

  const [step, setStep] = useState(1); // 1: Info & Payment, 2: Success
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // VAT Invoice Toggle
  const [needVat, setNeedVat] = useState(false);
  const [taxCode, setTaxCode] = useState("");
  const [vatCompanyAddress, setVatCompanyAddress] = useState("");
  const [vatEmail, setVatEmail] = useState("");

  // Payment Method: 'vietqr' | 'deposit30' | 'freesample'
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

  // VietQR dynamic image URL
  const vietQrUrl = `https://api.vietqr.io/image/970422-0984959586-compact2.jpg?amount=${currentPayAmount}&addInfo=HUNI%20${phone || "DONHANG"}&accountName=HDC%20GROUP%20VN`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BRAND_INFO.bankInfo.accountNumber);
    setCopiedBank(true);
    showToast("Đã sao chép số tài khoản MB Bank!");
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ", "error");
      return;
    }

    const orderData = {
      customer: {
        fullName,
        phone,
        email,
        address,
        companyName
      },
      vatInfo: needVat
        ? {
            taxCode,
            vatCompanyAddress,
            vatEmail
          }
        : null,
      paymentMethod:
        paymentMethod === "vietqr"
          ? "Chuyển khoản VietQR 100%"
          : paymentMethod === "deposit30"
          ? `Đặt cọc 30% (${depositAmount.toLocaleString("vi-VN")} đ)`
          : "Đặt lịch may mẫu thử 0đ",
      notes: orderNotes
    };

    const newOrder = saveOrder(orderData);
    setPlacedOrder(newOrder);
    setStep(2);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setPlacedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#071b34] text-white p-5 flex items-center justify-between border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 text-[#071b34] font-black flex items-center justify-center text-sm">
              HN
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {step === 1 ? "Đặt Hàng & May Đồng Phục HUNI" : "Đặt May Thành Công!"}
              </h3>
              <p className="text-xs text-cyan-200/80">HDC GROUP VN • Xưởng Sản Xuất Trực Tiếp</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Input Form & Payment */}
        {step === 1 ? (
          <form onSubmit={handleSubmitOrder} className="p-6 max-h-[85vh] overflow-y-auto space-y-6">
            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-bold text-[#071b34] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-600" />
                <span>1. Thông Tin Doanh Nghiệp & Người Đặt Hàng</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Họ và tên người liên hệ <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0984.xxx.xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tên công ty / Tổ chức / Trường học:
                  </label>
                  <input
                    type="text"
                    placeholder="Công ty CP Tập Đoàn..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email nhận hợp đồng / mẫu vẽ:</label>
                  <input
                    type="email"
                    placeholder="email@doanhnghiep.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Địa chỉ nhận hàng / Lấy số đo văn phòng <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, Tòa nhà, Đường, Quận/Huyện, Tỉnh/TP..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* VAT Invoice Accordion */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={needVat}
                  onChange={(e) => setNeedVat(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <FileText className="w-4 h-4 text-cyan-600" />
                <span>Yêu cầu xuất hóa đơn điện tử VAT (Thuế GTGT doanh nghiệp)</span>
              </label>

              {needVat && (
                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Mã số thuế doanh nghiệp:</label>
                    <input
                      type="text"
                      placeholder="010xxxxxxx"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Email nhận HĐ điện tử:</label>
                    <input
                      type="email"
                      placeholder="ketoan@congty.com"
                      value={vatEmail}
                      onChange={(e) => setVatEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-medium text-slate-700 block mb-1">Địa chỉ đăng ký kinh doanh:</label>
                    <input
                      type="text"
                      placeholder="Địa chỉ theo giấy ĐKKD"
                      value={vatCompanyAddress}
                      onChange={(e) => setVatCompanyAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-bold text-[#071b34] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-600" />
                <span>2. Chọn Phương Thức Thanh Toán & Nghiệm Thu</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("vietqr")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "vietqr"
                      ? "border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Quét Mã VietQR</span>
                    <QrCode className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Chuyển khoản nhanh qua app ngân hàng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("deposit30")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "deposit30"
                      ? "border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Đặt Cọc Xưởng 30%</span>
                    <Truck className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Cọc 30% lên chuyền may, 70% khi nhận hàng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("freesample")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "freesample"
                      ? "border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>May Mẫu Thử 0Đ</span>
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Duyệt áo mẫu trước, chưa cần thanh toán</div>
                </button>
              </div>

              {/* VietQR Display Box */}
              {(paymentMethod === "vietqr" || paymentMethod === "deposit30") && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-cyan-500/40 flex flex-col sm:flex-row items-center gap-5">
                  <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg text-center">
                    <img
                      src={vietQrUrl}
                      alt="VietQR HUNI Uniform"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="text-[9px] text-slate-600 font-bold mt-1">VietQR Chuẩn NAPAS 24/7</div>
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="text-cyan-400 font-extrabold text-sm">
                      Số tiền: {currentPayAmount.toLocaleString("vi-VN")} đ
                    </div>
                    <div>Ngân hàng: <strong>{BRAND_INFO.bankInfo.bankName}</strong></div>
                    <div className="flex items-center gap-2">
                      <span>Số tài khoản: <strong>{BRAND_INFO.bankInfo.accountNumber}</strong></span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="text-cyan-400 hover:text-cyan-300 p-0.5"
                        title="Sao chép số tài khoản"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div>Chủ tài khoản: <strong>{BRAND_INFO.bankInfo.accountHolder}</strong></div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Nội dung CK: <strong className="text-cyan-300">HUNI {phone || "DONHANG"}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total and Submit */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Tổng thanh toán đơn hàng:</div>
                <div className="text-2xl font-black text-[#071b34]">
                  {cartTotal.toLocaleString("vi-VN")} đ
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  (Bao gồm phí may mẫu, thiết kế 3D và giao hàng)
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-[#071b34] font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Xác Nhận Đặt Hàng & Lên Chuyền May</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Order Placed Successfully */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#071b34]">ĐẶT HÀNG THÀNH CÔNG!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Cảm ơn quý khách đã tin tưởng lựa chọn thương hiệu đồng phục <strong>HUNI Uniform</strong>.
              </p>
            </div>

            {placedOrder && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <strong className="text-cyan-900 font-black text-sm">{placedOrder.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <strong className="text-slate-800">{placedOrder.customer.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <strong className="text-slate-800">{placedOrder.customer.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng thanh toán:</span>
                  <strong className="text-cyan-800 font-bold">{placedOrder.total.toLocaleString("vi-VN")} đ</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-cyan-200 text-slate-700">
                  <span>Trạng thái:</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-200 text-cyan-900 font-bold text-[10px]">
                    {placedOrder.status}
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-500 max-w-md mx-auto">
              Chuyên viên thiết kế của HUNI Uniform sẽ gọi điện lại cho quý khách trong vòng{" "}
              <strong className="text-[#071b34]">15 phút</strong> để xác nhận chi tiết logo và gửi bản vẽ phối màu 3D!
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#071b34] text-cyan-300 font-bold text-xs rounded-xl shadow"
              >
                Tiếp tục xem sản phẩm
              </button>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Hotline: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}