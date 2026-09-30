"use client";

import React from "react";
import { ShieldCheck, Award, Building2, CheckCircle2 } from "lucide-react";

const PARTNERS = [
  { name: "Vietcombank", sub: "Ngân hàng Ngoại thương", tag: "Banking" },
  { name: "Techcombank", sub: "Ngân hàng Kỹ Thương", tag: "Banking" },
  { name: "MB Bank", sub: "Ngân hàng Quân Đội", tag: "Finance" },
  { name: "VinCity", sub: "Tập đoàn Vingroup", tag: "Real Estate" },
  { name: "Sun Group", sub: "Tập đoàn Mặt Trời", tag: "Tourism" },
  { name: "FPT Telecom", sub: "Tập đoàn FPT", tag: "Technology" },
  { name: "Học Viện Tư Pháp", sub: "Bộ Tư Pháp", tag: "Education" },
  { name: "ĐH Quốc Gia", sub: "Đại học Quốc gia", tag: "Education" },
  { name: "VNPT", sub: "Tập đoàn Bưu chính VN", tag: "Telecom" },
  { name: "Viettel", sub: "Tập đoàn Viễn thông", tag: "Telecom" }
];

export default function TrustBar() {
  return (
    <section className="py-8 sm:py-10 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header Label */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs uppercase font-black tracking-widest text-[#004f5e]">
                ĐỒNG HÀNH CÙNG DOANH NGHIỆP & TỔ CHỨC TOÀN QUỐC
              </p>
              <p className="text-[10px] text-slate-500">
                Được 50.000+ tập đoàn, trường học và tổ chức lớn tin cậy lựa chọn
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Xuất VAT 100%
            </span>
            <span className="inline-flex items-center gap-1.5 text-brand-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> May mẫu thử 0đ
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <Award className="w-3.5 h-3.5" /> Bảo hành 30 ngày
            </span>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          {PARTNERS.map((p, idx) => (
            <div
              key={idx}
              className="group p-2.5 sm:p-3 bg-white hover:bg-gradient-to-br hover:from-white hover:to-brand-50/50 rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                  {p.tag}
                </span>
                <Building2 className="w-3 h-3 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-800 group-hover:text-[#004f5e] transition-colors truncate">
                  {p.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {p.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
