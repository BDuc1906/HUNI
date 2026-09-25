"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    discountValue,
    cartCount,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    setIsCheckoutOpen
  } = useShop();

  const [inputVoucher, setInputVoucher] = useState("");

  if (!isCartOpen) return null;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (inputVoucher.trim()) {
      applyVoucher(inputVoucher);
      setInputVoucher("");
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-[#071b34] text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <h2 className="font-extrabold text-sm sm:text-base">
              Giỏ Hàng ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-95"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 divide-y divide-slate-100">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-20 sm:w-18 sm:h-22 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-[#071b34] text-xs sm:text-sm leading-snug line-clamp-2">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors active:scale-95"
                        title="Xóa"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-slate-500 space-y-0.5 mt-1">
                      <div className="truncate">
                        Màu: <strong className="text-slate-700">{item.color}</strong> • Size:{" "}
                        <strong className="text-slate-700">{item.size}</strong>
                      </div>
                      {item.customLogo && (
                        <div className="text-amber-700 font-semibold bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] inline-block border border-amber-200 truncate max-w-full">
                          ✓ {item.customLogo.method}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-xs">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 5)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95"
                        aria-label="Giảm số lượng"
                      >
                        -
                      </button>
                      <span className="px-2 sm:px-2.5 font-bold text-slate-800 text-[11px] sm:text-xs min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 5)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-[11px] sm:text-xs">
                        {(item.unitPrice * item.quantity).toLocaleString("vi-VN")} đ
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400">
                        {item.unitPrice.toLocaleString("vi-VN")} đ/{item.product.unit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">Giỏ hàng của bạn đang trống</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Hãy lựa chọn các mẫu đồng phục doanh nghiệp, polo, vest để nhận báo giá sỉ tốt nhất.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 bg-[#071b34] text-amber-300 font-bold text-xs rounded-xl active:scale-95"
              >
                Khám phá sản phẩm
              </button>
            </div>
          )}
        </div>

        {/* Bottom — Checkout */}
        {cart.length > 0 && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 space-y-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            {/* Voucher */}
            {appliedVoucher ? (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-semibold min-w-0">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{appliedVoucher.label}</span>
                </div>
                <button
                  onClick={removeVoucher}
                  className="text-xs text-rose-600 hover:underline font-bold shrink-0 ml-2 active:scale-95"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mã ưu đãi (HUNI2026, DOANHNGHIEP)"
                  value={inputVoucher}
                  onChange={(e) => setInputVoucher(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-[11px] sm:text-xs uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-amber-300 font-bold text-[11px] sm:text-xs rounded-xl transition-colors active:scale-95 shrink-0"
                >
                  Áp dụng
                </button>
              </form>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Tạm tính ({cartCount} sản phẩm):</span>
                <span className="font-semibold text-slate-800">
                  {cartSubtotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {discountValue > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Ưu đãi:</span>
                  <span>-{discountValue.toLocaleString("vi-VN")} đ</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                <span>Thiết kế 3D & May mẫu thử:</span>
                <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-extrabold text-[#071b34] text-xs sm:text-sm">Tổng cộng:</span>
                <span className="font-black text-[#071b34] text-base sm:text-lg">
                  {cartTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Checkout */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <span>Tiến Hành Đặt Hàng & May Mẫu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] sm:text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span>Hỗ trợ xuất hóa đơn đỏ VAT cho doanh nghiệp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}