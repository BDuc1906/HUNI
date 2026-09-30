"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

/* =========================================================
   ALBUM — Ảnh tập thể làm social proof
   Các ảnh đông người không dùng làm ảnh sản phẩm nữa,
   chuyển thành album giới thiệu khách hàng thực tế.
   ========================================================= */
const ALBUM = [
  {
    src: "/images/uniform_school_students.jpg",
    caption: "Đồng phục học sinh chuẩn quốc tế",
    client: "Hệ thống trường liên cấp",
    tag: "Trường học",
    span: "col-span-2 row-span-2", // ô lớn
  },
  {
    src: "/images/09_kids_school_01.jpg",
    caption: "Niềm vui ngày khai giảng",
    client: "Trường Tiểu học",
    tag: "Học sinh",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/09_kids_school_02.jpg",
    caption: "Đồng phục chuẩn form cho các em",
    client: "Trường THCS",
    tag: "Học sinh",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/09_kids_school_03.jpg",
    caption: "Tự hào khoác lên đồng phục trường",
    client: "Trường THPT",
    tag: "Học sinh",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/12_kids_bestseller_01.jpg",
    caption: "Đồng phục mẫu giáo ngộ nghĩnh",
    client: "Trường Mầm non Quốc tế",
    tag: "Mẫu giáo",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/12_kids_bestseller_02.jpg",
    caption: "Đồng phục thể dục năng động",
    client: "Trường Tiểu học",
    tag: "Thể dục",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/12_kids_bestseller_03.jpg",
    caption: "Đồng phục trung học hiện đại",
    client: "Trường THPT Chuyên",
    tag: "Học sinh",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/12_kids_bestseller_04.jpg",
    caption: "Đồng phục tiểu học đẹp bền",
    client: "Trường Tiểu học Tư thục",
    tag: "Học sinh",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/images/08_golf_event_01.jpg",
    caption: "Giải Golf Doanh Nhân HDC 2026",
    client: "CLB Golf Doanh Nhân Hà Nội",
    tag: "Giải Golf",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/08_golf_event_02.jpg",
    caption: "Đồng phục đồng bộ toàn giải",
    client: "Giải Golf từ thiện",
    tag: "Giải Golf",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/08_golf_event_03.jpg",
    caption: "Trao giải cùng HDC",
    client: "Giải Golf Doanh Nghiệp",
    tag: "Sự kiện",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/07_corporate_golf_01.jpg",
    caption: "Đội Golf Doanh Nghiệp 2026",
    client: "Tập đoàn Bất động sản",
    tag: "Doanh nghiệp",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/07_corporate_golf_02.jpg",
    caption: "Đồng phục Teambuilding năng động",
    client: "Ngân hàng TMCP",
    tag: "Teambuilding",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/07_corporate_golf_03.jpg",
    caption: "Đồng phục thể thao doanh nghiệp",
    client: "Công ty Công nghệ",
    tag: "Doanh nghiệp",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/07_corporate_golf_04.jpg",
    caption: "Giải Pickleball Doanh Nhân",
    client: "CLB Pickleball",
    tag: "Thể thao",
    span: "col-span-1 row-span-1",
  },
];

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % ALBUM.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + ALBUM.length) % ALBUM.length);
  };

  return (
    <section
      id="gallery-section"
      className="py-14 sm:py-20 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Album Khách Hàng Thực Tế
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            HÌNH ẢNH TỪ ĐỐI TÁC &amp; KHÁCH HÀNG
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Hơn <strong className="text-[#004f5e]">50.000+ doanh nghiệp, tổ chức, trường học</strong>{" "}
            đã tin dùng đồng phục HDC. Cùng xem những khoảnh khắc đáng nhớ của họ.
          </p>
        </div>

        {/* =============================================
            Masonry Grid
            ============================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[170px] lg:auto-rows-[200px] gap-2 sm:gap-3">
          {ALBUM.map((item, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx)}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={80}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#004f5e] via-[#004f5e]/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Tag */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-brand-400 text-white font-bold text-[10px] sm:text-[11px] shadow-md">
                {item.tag}
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 text-left">
                <div className="text-white font-bold text-[11px] sm:text-sm leading-tight line-clamp-2">
                  {item.caption}
                </div>
                <div className="text-brand-200/90 text-[10px] sm:text-[11px] mt-0.5 line-clamp-1">
                  {item.client}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* =============================================
            Bottom CTA
            ============================================= */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] sm:text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span>Muốn đồng phục công ty bạn xuất hiện tại đây?</span>
            <a
              href="#final-cta-section"
              className="text-brand-700 hover:text-brand-800 font-bold hover:underline"
            >
              Đặt ngay →
            </a>
          </div>
        </div>
      </div>

      {/* =============================================
          LIGHTBOX
          ============================================= */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Đóng"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Ảnh trước"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Ảnh sau"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={ALBUM[lightboxIndex].src}
              alt={ALBUM[lightboxIndex].caption}
              fill
              sizes="100vw"
              quality={90}
              className="object-contain"
              priority
            />

            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-brand-400 text-white font-bold text-[11px] mb-2">
                {ALBUM[lightboxIndex].tag}
              </div>
              <div className="text-white font-bold text-base sm:text-lg">
                {ALBUM[lightboxIndex].caption}
              </div>
              <div className="text-brand-200/80 text-xs sm:text-sm mt-0.5">
                {ALBUM[lightboxIndex].client}
              </div>
            </div>

            {/* Counter */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
              {lightboxIndex + 1} / {ALBUM.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
