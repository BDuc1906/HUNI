"use client";

import React from "react";
import {
  ShieldCheck,
  Landmark,
  Building2,
  GraduationCap,
  Radio,
  Sparkles
} from "lucide-react";

/* =========================================================
   ĐỐI TÁC — Chia theo loại để gán icon phù hợp
   - bank:     ngân hàng / tài chính
   - group:    tập đoàn / doanh nghiệp lớn
   - edu:      trường học / học viện
   - telecom:  viễn thông
   ========================================================= */
const PARTNERS = [
  { name: "VIETCOMBANK",     type: "bank" },
  { name: "TECHCOMBANK",     type: "bank" },
  { name: "MB BANK",         type: "bank" },
  { name: "VINCITY",         type: "group" },
  { name: "SUN GROUP",       type: "group" },
  { name: "FPT TELECOM",     type: "telecom" },
  { name: "HỌC VIỆN TƯ PHÁP", type: "edu" },
  { name: "TRƯỜNG ĐH QUỐC GIA", type: "edu" },
  { name: "VNPT",            type: "telecom" },
  { name: "VIETTEL",         type: "telecom" },
];

/* Icon tương ứng với từng loại đối tác */
const ICON_MAP = {
  bank:    Landmark,
  group:   Building2,
  edu:     GraduationCap,
  telecom: Radio,
};

export default function TrustBar() {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            Label — căn giữa, icon + text
            ============================================= */}
        <div className="text-center mb-6 sm:mb-7 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
          <p className="text-[11px] sm:text-xs uppercase font-extrabold tracking-[0.15em] text-slate-600">
            Đồng hành cùng hơn{" "}
            <span className="text-[#071b34]">50.000+</span> tập đoàn &amp; tổ chức
          </p>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:block" />
        </div>

        {/* =============================================
            MARQUEE — 2 dải chạy nối tiếp để không gián đoạn
            Kỹ thuật: container cha có overflow-hidden,
            track bên trong chạy animation infinite
            ============================================= */}
        <div className="relative">
          {/* Fade mép trái + phải để marquee "biến mất" mượt */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Track — 2 lần mảng PARTNERS để loop liền mạch */}
          <div className="flex gap-3 sm:gap-4 marquee-track">
            {[...PARTNERS, ...PARTNERS].map((partner, idx) => {
              const Icon = ICON_MAP[partner.type] || Building2;
              return (
                <PartnerChip
                  key={`${partner.name}-${idx}`}
                  name={partner.name}
                  Icon={Icon}
                />
              );
            })}
          </div>
        </div>

        {/* =============================================
            Custom CSS animation — không dùng Tailwind để
            chạy mượt, có pause on hover
            ============================================= */}
        <style jsx>{`
          .marquee-track {
            width: max-content;
            animation: marquee 45s linear infinite;
            will-change: transform;
          }

          /* Pause khi rê chuột vào để khách đọc tên đối tác */
          .marquee-track:hover {
            animation-play-state: paused;
          }

          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              /* Dịch đúng bằng 1 nửa track (vì đã nhân đôi mảng) */
              transform: translateX(-50%);
            }
          }

          /* Ưu tiên người dùng có prefers-reduced-motion: tắt animation */
          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
              flex-wrap: wrap;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

/* =========================================================
   Chip đối tác — icon + tên, hover nhẹ
   ========================================================= */
function PartnerChip({ name, Icon }) {
  return (
    <div
      className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md hover:border-amber-400 hover:bg-amber-50/40 transition-all duration-200 shrink-0 whitespace-nowrap cursor-default"
      title={name}
    >
      {/* Icon */}
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 group-hover:bg-amber-500 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors shrink-0">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      {/* Tên đối tác */}
      <span className="font-extrabold text-[11px] sm:text-xs tracking-wider text-slate-700 group-hover:text-amber-800 transition-colors">
        {name}
      </span>
    </div>
  );
}