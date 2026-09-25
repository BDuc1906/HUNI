"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

const PARTNER_LOGOS = [
  "VIETCOMBANK",
  "TECHCOMBANK",
  "MB BANK",
  "VINCITY",
  "SUN GROUP",
  "FPT TELECOM",
  "HỌC VIỆN TƯ PHÁP",
  "TRƯỜNG ĐH QUỐC GIA",
  "VNPT",
  "VIETTEL"
];

export default function TrustBar() {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Label */}
        <div className="text-center mb-5 sm:mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          <p className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500">
            ĐỒNG HÀNH CÙNG HƠN 50.000+ TẬP ĐOÀN & TỔ CHỨC
          </p>
        </div>

        {/* Logo strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {PARTNER_LOGOS.map((logo, idx) => (
            <div
              key={idx}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs font-extrabold text-[10px] sm:text-xs text-slate-600 tracking-wider hover:text-amber-700 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}