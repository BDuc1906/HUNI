"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

export default function ContactHero() {
  const { showToast } = useShop();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      showToast("Đã sao chép số điện thoại Hotline!");
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      showToast("Đã sao chép email doanh nghiệp!");
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 lg:py-20 border-b border-brand-400/20 overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-brand-400/15 rounded-full blur-3xl pointer-events-none animate-brand-glow" />
      <div className="absolute -bottom-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-brand-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-6"
        >
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-white font-semibold">Liên Hệ &amp; Showroom</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Intro */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang trực tuyến • Phản hồi trong 15 phút</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
              KẾT NỐI VỚI <br />
              <span className="text-brand-gradient">CHUYÊN GIA MAY ĐO HDC</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Quý doanh nghiệp cần tư vấn chất liệu, nhận báo giá sỉ tận xưởng,
              đăng ký may mẫu thử <strong>0 đồng</strong> hoặc xem showroom tại Phú Thọ &amp; Hà Nội?
              Đội ngũ chuyên viên HDC luôn sẵn sàng hỗ trợ tận tâm 24/7.
            </p>

            {/* Value badges */}
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs text-brand-100 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                May mẫu thử 0đ
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Zap className="w-3.5 h-3.5 text-brand-300" />
                Thiết kế 3D trong 2 giờ
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Bảo hành 1 đổi 1
              </span>
            </div>
          </div>

          {/* Right Column: Direct Quick Contact Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {/* Hotline Card */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 transition-all group shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-500/30 text-brand-300 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <Phone className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">Hotline / Zalo tư vấn 24/7</div>
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="text-lg sm:text-xl font-black text-white hover:text-brand-300 transition-colors block"
                  >
                    {BRAND_INFO.contact.hotline}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(BRAND_INFO.contact.hotline, "phone")}
                  title="Sao chép số điện thoại"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-brand-200 hover:text-white transition-colors"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Zalo
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 transition-all group shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-brand-500/30 text-brand-300 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-300 font-medium">Email phòng kinh doanh</div>
                  <a
                    href={`mailto:${BRAND_INFO.contact.email}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-brand-300 transition-colors truncate block"
                  >
                    {BRAND_INFO.contact.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(BRAND_INFO.contact.email, "email")}
                title="Sao chép email"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-brand-200 hover:text-white transition-colors shrink-0 ml-2"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Work Time Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-lg flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-brand-500/30 text-brand-300 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Thời gian tiếp khách &amp; làm việc</div>
                <div className="text-sm sm:text-base font-bold text-white">
                  08:00 - 18:00 (Thứ 2 - Thứ 7)
                </div>
                <div className="text-[11px] text-brand-300 mt-0.5">
                  Hotline &amp; Zalo trực 24/7 kể cả Chủ nhật &amp; ngày lễ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
