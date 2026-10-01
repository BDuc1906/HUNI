"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { Phone, MessageCircle, ArrowUp, ShieldCheck } from "lucide-react";
import ChatWidget from "@/features/chatbot/components/ChatWidget";

export default function FloatingActions() {
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
        {/* 1. Zalo — Icon tròn */}
        <a
          href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo cùng chuyên viên HDC"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* 2. Hotline — Icon tròn (cùng size với Zalo & Chat AI) */}
        <a
          href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
          title={`Gọi Hotline tư vấn 24/7: ${BRAND_INFO.contact.hotline}`}
          className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500 to-brand-400 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
        >
          <Phone className="w-5 h-5 animate-bounce" />
          <span className="sr-only">Hotline {BRAND_INFO.contact.hotline}</span>
        </a>

        {/* 3. Chat AI — Icon tròn */}
        <ChatWidget />

        {/* 4. Scroll to top — Icon tròn nhỏ hơn (chỉ hiện khi scroll xuống) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="Cuộn lên đầu trang"
            className="w-12 h-12 rounded-full bg-[#004f5e] hover:bg-slate-800 text-brand-400 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
          >
            <ArrowUp className="w-5 h-5" />
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
            <Phone className="w-5 h-5 text-brand-600" />
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
          <a
            href="/lien-he"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 active:bg-brand-50 transition-colors"
          >
            <Phone className="w-5 h-5 text-brand-600" />
            <span className="text-[11px] font-bold text-brand-700">Liên hệ</span>
          </a>
        </div>
      </div>

      {/* Chat AI — mobile, nổi phía trên bottom bar */}
      <div className="md:hidden fixed bottom-20 right-3 z-30">
        <ChatWidget />
      </div>

      {/* Scroll to top — mobile, phía trên bottom bar */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          className="md:hidden fixed bottom-20 right-16 z-30 w-10 h-10 rounded-full bg-[#004f5e]/90 backdrop-blur text-brand-400 flex items-center justify-center shadow-lg border border-brand-400/30 active:scale-95 transition-transform"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Nút chuyển nhanh sang Admin (Demo) nổi góc dưới bên trái */}
      <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-30 pointer-events-auto">
        <Link
          href="/admin"
          title="Chuyển sang Cổng Quản Trị Admin (Demo)"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold shadow-2xl backdrop-blur-md transition-all transform hover:scale-105 group"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse group-hover:bg-white" />
          <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
          <span>Admin (Demo)</span>
        </Link>
      </div>
    </>
  );
}