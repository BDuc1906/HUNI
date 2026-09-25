"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/context/ShopContext";
import { Phone, MessageCircle, Calculator, ArrowUp, Sparkles } from "lucide-react";

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
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* 1. Quick Quote Floating Button */}
      <button
        onClick={() => setIsQuickQuoteOpen(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-[#071b34] font-extrabold text-xs uppercase shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-cyan-300/40"
      >
        <Sparkles className="w-4 h-4" />
        <span>Báo Giá May 3 Phút</span>
      </button>

      {/* 2. Zalo Connect Button */}
      <a
        href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo cùng chuyên viên HUNI"
        className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* 3. Hotline Call Button with radar pulse animation */}
      <a
        href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
        title={`Gọi Hotline tư vấn 24/7: ${BRAND_INFO.contact.hotline}`}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-400 text-[#071b34] flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 border-2 border-white animate-radar"
      >
        <Phone className="w-7 h-7 animate-bounce" />
        <span className="sr-only">Hotline {BRAND_INFO.contact.hotline}</span>
      </a>

      {/* 4. Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          className="w-10 h-10 rounded-full bg-[#071b34] hover:bg-slate-800 text-cyan-400 flex items-center justify-center shadow-lg transition-all border border-cyan-400/30"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}