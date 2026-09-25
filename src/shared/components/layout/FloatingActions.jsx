"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import { Phone, MessageCircle, ArrowUp, Sparkles } from "lucide-react";

export default function FloatingActions() {
  const { setIsQuickQuoteOpen } = useShop();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* =============================================
          DESKTOP / TABLET — Floating stack bên phải
          ============================================= */}
      <div className="hidden md:flex fixed bottom-6 right-5 z-30 flex-col items-end gap-3 pointer-events-auto">
        {/* 1. Quick Quote Button — chỉ desktop lg+ */}
        <button
          onClick={() => setIsQuickQuoteOpen(true)}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-xs uppercase shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-amber-300/40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Báo Giá May 3 Phút</span>
        </button>

        {/* 2. Zalo */}
        <a
          href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo cùng chuyên viên HUNI"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* 3. Hotline */}
        <a
          href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
          title={`Gọi Hotline tư vấn 24/7: ${BRAND_INFO.contact.hotline}`}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-[#071b34] flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
        >
          <Phone className="w-6 h-6 animate-bounce" />
          <span className="sr-only">Hotline {BRAND_INFO.contact.hotline}</span>
        </a>

        {/* 4. Scroll to top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="Cuộn lên đầu trang"
            className="w-10 h-10 rounded-full bg-[#071b34] hover:bg-slate-800 text-amber-400 flex items-center justify-center shadow-lg transition-all border border-amber-400/30"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* =============================================
          MOBILE — Bottom action bar cố định
          ============================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3 divide-x divide-slate-200">
          {/* Hotline */}
          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 active:bg-slate-50 transition-colors"
          >
            <Phone className="w-5 h-5 text-amber-600" />
            <span className="text-[11px] font-bold text-slate-800">Gọi ngay</span>
          </a>

          {/* Zalo */}
          <a
            href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 active:bg-slate-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-[11px] font-bold text-slate-800">Chat Zalo</span>
          </a>

          {/* Quick Quote */}
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 active:bg-amber-50 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-700">Báo giá</span>
          </button>
        </div>
      </div>

      {/* Scroll to top — mobile, phía trên bottom bar */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          className="md:hidden fixed bottom-20 right-3 z-30 w-10 h-10 rounded-full bg-[#071b34]/90 backdrop-blur text-amber-400 flex items-center justify-center shadow-lg border border-amber-400/30 active:scale-95 transition-transform"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
}