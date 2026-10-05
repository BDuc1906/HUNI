"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const progressTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  // Bắt đầu thanh loading
  const startLoading = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setIsVisible(true);
    setIsLoading(true);
    setProgress(20);

    // Tăng dần tiến độ mượt mà
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressTimerRef.current);
          return 85;
        }
        // Nhảy ngẫu nhiên từ 5% - 15% tạo cảm giác load mạng chân thực
        const step = Math.floor(Math.random() * 10) + 5;
        return Math.min(prev + step, 85);
      });
    }, 180);
  };

  // Hoàn tất thanh loading khi chuyển trang xong
  const finishLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setProgress(100);
    setIsLoading(false);

    finishTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 250);
    }, 200);
  };

  // Lắng nghe thay đổi route để hoàn tất tiến trình
  useEffect(() => {
    finishLoading();
  }, [pathname, searchParams]);

  // Bắt sự kiện click vào các thẻ link nội bộ để kích hoạt loading tức thì
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Bỏ qua các liên kết đặc biệt, tab mới hoặc liên kết ngoài
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Bỏ qua anchor link cùng trang hoặc mailto/tel
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
      }

      // Kiểm tra URL nội bộ
      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        if (targetUrl.origin === window.location.origin) {
          // Nếu click vào chính trang hiện tại thì không load lại
          if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
            return;
          }
          startLoading();
        }
      } catch (_) {}
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-[3px] sm:h-[3.5px] loading-progress-bar transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
        }}
      >
        {/* Hạt phát sáng ở đầu thanh tiến trình */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-300 blur-sm opacity-80" />
      </div>
    </div>
  );
}
