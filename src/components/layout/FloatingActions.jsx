"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/data/products";
import { useShop } from "@/hooks/useShop";
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
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* 1. Quick Quote Floating Button */}
      <button
        onClick={() => setIsQuickQuoteOpen(true)}
        className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs shadow-md hover:opacity-90 transition-all border border-neutral-800 dark:border-neutral-200"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Báo Giá Nhanh</span>
      </button>

      {/* 2. Zalo Connect Button */}
      <a
        href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo chuyên viên HUNI"
        className="w-11 h-11 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-md hover:opacity-90 transition-all border border-neutral-700 dark:border-neutral-300"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* 3. Hotline Call Button */}
      <a
        href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
        title={`Hotline tư vấn: ${BRAND_INFO.contact.hotline}`}
        className="w-12 h-12 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform border border-neutral-800 dark:border-neutral-200"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* 4. Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shadow-sm transition-colors border border-neutral-300 dark:border-neutral-700"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
