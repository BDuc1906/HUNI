"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useShop } from "@/shared/providers/ShopProvider";
import { useLanguage } from "@/shared/providers/LanguageProvider";
import { X, Gift, ArrowRight } from "lucide-react";

// Dữ liệu đa ngôn ngữ chuẩn xác cho Modal Quảng Cáo HDC
const PROMO_DATA = {
  vi: {
    title: "MỪNG ĐẠI TIỆC ĐỒNG PHỤC • NGẬP TRÀN ƯU ĐÃI",
    saleBadge: "UP TO",
    saleMain: "SALE 40%",
    giftBadge: "TẶNG THIẾT KẾ 3D 1.000.000Đ",
    dateBadge: "01.10 - 31.10 • MAY MẪU THỬ 0Đ",
    cta: "Nhận Ưu Đãi & May Mẫu 0đ Ngay",
    sub: "✨ Miễn phí thiết kế 3D • Hotline: 0984.959.586",
  },
  en: {
    title: "CORPORATE UNIFORM FESTIVAL • HUGE SAVINGS",
    saleBadge: "UP TO",
    saleMain: "SALE 40%",
    giftBadge: "FREE 3D DESIGN WORTH 1,000,000 VND",
    dateBadge: "01.10 - 31.10 • FREE SAMPLE PRODUCTION",
    cta: "Claim Offer & Free Sample Now",
    sub: "✨ Free 3D Design • Hotline: 0984.959.586",
  },
  us: {
    title: "CORPORATE UNIFORM FESTIVAL • HUGE SAVINGS",
    saleBadge: "UP TO",
    saleMain: "SALE 40%",
    giftBadge: "FREE 3D DESIGN WORTH 1,000,000 VND",
    dateBadge: "OCT 01 - OCT 31 • FREE SAMPLE PRODUCTION",
    cta: "Claim Offer & Free Sample Now",
    sub: "✨ Free 3D Design • Hotline: 0984.959.586",
  },
  ja: {
    title: "ユニフォーム大感謝祭 • 特別割引キャンペーン",
    saleBadge: "最大",
    saleMain: "40% OFF",
    giftBadge: "100万VND相当 3Dデザイン無料",
    dateBadge: "10.01 - 10.31 • 試作サンプル製作 0円",
    cta: "特別特典と無料サンプルを申込む",
    sub: "✨ 3Dデザイン無料 • ホットライン: 0984.959.586",
  },
  ko: {
    title: "기업 유니폼 페스티벌 • 특별 할인 이벤트",
    saleBadge: "최대",
    saleMain: "40% 할인",
    giftBadge: "100만동 상당 3D 디자인 무료 증정",
    dateBadge: "10.01 - 10.31 • 샘플 무료 제작 0원",
    cta: "지금 특별 혜택 및 샘플 신청하기",
    sub: "✨ 3D 디자인 무료 • 핫라인: 0984.959.586",
  },
  zh: {
    title: "企业制服盛典 • 畅享超值特惠",
    saleBadge: "最高",
    saleMain: "立减 40%",
    giftBadge: "赠送价值100万越盾3D设计",
    dateBadge: "10.01 - 10.31 • 免费打样打板 0元",
    cta: "立即获取优惠与免费打样",
    sub: "✨ 免费3D设计 • 热线: 0984.959.586",
  },
  fr: {
    title: "FESTIVAL DES UNIFORMES • GRANDES PROMOTIONS",
    saleBadge: "JUSQU'À",
    saleMain: "-40% OFF",
    giftBadge: "DESIGN 3D OFFERT VALEUR 1 000 000 VND",
    dateBadge: "01.10 - 31.10 • ÉCHANTILLON GRATUIT 0€",
    cta: "Profiter de l'offre & Échantillon",
    sub: "✨ Design 3D offert • Hotline: 0984.959.586",
  },
  de: {
    title: "UNTERNEHMENS-UNIFORM-FESTIVAL • TOP-ANGEBOTE",
    saleBadge: "BIS ZU",
    saleMain: "40% RABATT",
    giftBadge: "GRATIS 3D-DESIGN WERT 1.000.000 VND",
    dateBadge: "01.10 - 31.10 • KOSTENLOSE PROBEMUSTER",
    cta: "Jetzt Angebot & Gratismuster sichern",
    sub: "✨ Gratis 3D-Design • Hotline: 0984.959.586",
  },
  th: {
    title: "เทศกาลชุดยูนิฟอร์มองค์กร • ส่วนลดสุดพิเศษ",
    saleBadge: "ลดสูงสุด",
    saleMain: "40% OFF",
    giftBadge: "ฟรีออกแบบ 3D มูลค่า 1,000,000 ดอง",
    dateBadge: "01.10 - 31.10 • ผลิตตัวอย่างฟรี 0 ดอง",
    cta: "รับสิทธิพิเศษและตัวอย่างฟรีทันที",
    sub: "✨ ฟรีออกแบบ 3D • สายด่วน: 0984.959.586",
  },
  sg: {
    title: "CORPORATE UNIFORM FESTIVAL • HUGE SAVINGS",
    saleBadge: "UP TO",
    saleMain: "SALE 40%",
    giftBadge: "FREE 3D DESIGN WORTH 1,000,000 VND",
    dateBadge: "01.10 - 31.10 • FREE SAMPLE PRODUCTION",
    cta: "Claim Offer & Free Sample Now",
    sub: "✨ Free 3D Design • Hotline: 0984.959.586",
  },
};

export default function HomePromoModal() {
  const pathname = usePathname();
  const { setIsQuickQuoteOpen } = useShop();
  const { language } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Lấy nội dung theo ngôn ngữ hiện tại
  const cur = PROMO_DATA[language] || PROMO_DATA["vi"];

  // Đánh dấu đã mount trên client
  useEffect(() => {
    setMounted(true);

    // Hỗ trợ mở lại popup thông qua custom event nếu cần test
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("hdc:open-promo", handleOpenEvent);
    return () => window.removeEventListener("hdc:open-promo", handleOpenEvent);
  }, []);

  // Khi người dùng chuyển đến hoặc về trang chủ, tự động bật popup
  useEffect(() => {
    if (pathname === "/") {
      setIsOpen(true);
    }
  }, [pathname]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const handleBannerClick = () => {
    handleClose();
    setIsQuickQuoteOpen(true);
  };

  // Khóa cuộn trang khi modal mở & hỗ trợ phím ESC
  useEffect(() => {
    if (isOpen && pathname === "/") {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, pathname, handleClose]);

  // Chỉ hiển thị ở trang chủ
  if (!mounted || !isOpen || pathname !== "/" || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop mờ nền đen */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      {/* ========================================================
          POSTER QUẢNG CÁO CĂN GIỮA — HÌNH CHỮ NHẬT DÀI THANH THOÁT
          Tỷ lệ poster đứng thời trang, vừa vặn màn hình điện thoại
          ======================================================== */}
      <div className="relative z-10 w-[calc(100vw-2.5rem)] max-w-[335px] sm:max-w-[370px] mx-auto my-auto animate-in zoom-in-95 duration-200">
        {/* Nút đóng tròn nổi bật góc trên bên phải */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          type="button"
          className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/90 hover:bg-black text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 cursor-pointer border-2 border-white backdrop-blur-xs"
          title="Đóng quảng cáo"
          aria-label="Đóng quảng cáo"
        >
          <X className="w-4 h-4 text-white stroke-[2.5]" />
        </button>

        {/* Khung Poster Bấm Được (Click để nhận ưu đãi / mở báo giá) */}
        <div
          onClick={handleBannerClick}
          className="w-full min-h-[510px] sm:min-h-[545px] max-h-[88vh] relative rounded-[26px] sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] overflow-hidden cursor-pointer group border border-white/70 bg-[#fbf9f4] flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
        >
          {/* PHẦN ĐẦU: LOGO CHÍNH THỨC + TIÊU ĐỀ + CHỮ SALE TO (ĐA NGÔN NGỮ) */}
          <div className="pt-4.5 sm:pt-5 px-4 text-center select-none bg-gradient-to-b from-[#fbf9f4] via-[#f7f5ed] to-[#f4f1e5]">
            {/* Logo HDC chính thức */}
            <div className="flex justify-center items-center mb-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HDC FASHION"
                style={{ height: "28px", width: "auto" }}
                className="h-[28px] sm:h-[32px] w-auto max-w-[130px] object-contain block"
              />
            </div>

            {/* Tiêu đề đại tiệc */}
            <div className="text-[10px] sm:text-[11px] font-black tracking-wide uppercase text-[#006373] line-clamp-1 mb-0.5">
              {cur.title}
            </div>

            {/* Chữ SALE TO ĐẬM MÀU ĐỎ GRADIENT VỚI ĐỔ BÓNG NỔI BẬT */}
            <div className="leading-none my-0.5">
              <span className="block text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-[#d92323] uppercase">
                {cur.saleBadge}
              </span>
              <span className="block text-3xl sm:text-[42px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#d92323] via-[#e53e3e] to-[#b91c1c] drop-shadow-sm font-sans my-0.5">
                {cur.saleMain}
              </span>
            </div>

            {/* Nơ / Huy hiệu Quà tặng 3D */}
            <div className="flex justify-center mt-1.5">
              <div className="py-1 px-3 sm:px-3.5 rounded-full bg-gradient-to-r from-[#cb1e24] via-[#dc2626] to-[#cb1e24] border border-amber-300/80 shadow-xs flex items-center justify-center gap-1.5 text-white">
                <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-wide truncate max-w-[280px]">
                  {cur.giftBadge}
                </span>
              </div>
            </div>

            {/* Huy hiệu thời gian & may mẫu 0đ */}
            <div className="flex justify-center mt-1 pb-1.5">
              <div className="py-0.5 px-2.5 rounded-full bg-[#8c161b] text-white/95 text-[9px] sm:text-[9.5px] font-extrabold uppercase tracking-wide shadow-2xs">
                {cur.dateBadge}
              </div>
            </div>
          </div>

          {/* PHẦN THÂN: HÌNH ẢNH 2 NGƯỜI MẪU DÀNG ĐỨNG DÀI THANH THOÁT */}
          <div className="relative w-full flex-1 min-h-[210px] sm:min-h-[240px] overflow-hidden bg-[#f4f1e5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hdc_promo_models.jpg"
              alt="HDC Uniform Models"
              className="w-full h-full object-cover object-top select-none transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient bóng mờ chân ảnh + Nút bấm CTA nhận ưu đãi */}
            <div className="absolute inset-x-0 bottom-0 pt-10 pb-3.5 sm:pb-4 px-3.5 sm:px-4 bg-gradient-to-t from-black/90 via-black/55 to-transparent flex flex-col items-center">
              <div className="w-full py-3 sm:py-3.5 px-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-[13px] text-center shadow-xl shadow-black/50 uppercase tracking-wide flex items-center justify-center gap-2 transform group-hover:scale-[1.02] active:scale-95 transition-all">
                <span className="truncate">{cur.cta}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[9.5px] sm:text-[10.5px] text-white/95 font-medium mt-1 text-center drop-shadow truncate max-w-full">
                {cur.sub}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
