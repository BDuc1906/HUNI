"use client";

import React from "react";
import {
  Users2,
  FileDown,
  PhoneCall,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

export default function EnterpriseClientsSection() {
  const { setIsQuickQuoteOpen } = useShop();

  // Danh sách đối tác tiêu biểu với Logo chính thức chuẩn 2026
  const partners = [
    {
      id: "vcb",
      name: "Vietcombank",
      logo: "/images/partners/vietcombank.png",
    },
    {
      id: "tcb",
      name: "Techcombank",
      logo: "/images/partners/techcombank.png",
    },
    {
      id: "mbbank",
      name: "MB Bank",
      logo: "/images/partners/mbbank.png",
    },
    {
      id: "bidv",
      name: "BIDV",
      logo: "/images/partners/bidv.png",
    },
    {
      id: "vietinbank",
      name: "VietinBank",
      logo: "/images/partners/vietinbank.png",
    },
    {
      id: "vpbank",
      name: "VPBank",
      logo: "/images/partners/vpbank.png",
    },
    {
      id: "viettel",
      name: "Viettel",
      logo: "/images/partners/viettel.svg",
    },
    {
      id: "fpt",
      name: "FPT Telecom",
      logo: "/images/partners/fpt.svg",
    },
    {
      id: "sungroup",
      name: "Sun Group",
      logo: "/images/partners/sungroup.svg",
    },
    {
      id: "vingroup",
      name: "Vingroup",
      logo: "/images/partners/vingroup.svg",
    },
    {
      id: "vnpt",
      name: "VNPT",
      logo: "/images/partners/vnpt.svg",
    },
    {
      id: "dahop",
      name: "Dạ Hợp Group",
      logo: "/images/partners/dahop.svg",
    },
    {
      id: "tuphap",
      name: "Học Viện Tư Pháp",
      logo: "/images/partners/hocvientuphap.svg",
    },
    {
      id: "vnu",
      name: "ĐHQG Hà Nội",
      logo: "/images/partners/vnu.svg",
    },
  ];

  return (
    <section id="enterprise-partners" className="py-14 sm:py-20 bg-white relative overflow-hidden">
      {/* Decorative ambient blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header tinh gọn */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Users2 className="w-3.5 h-3.5 text-brand-500" />
            Khách Hàng &amp; Đối Tác Tiêu Biểu
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e] tracking-tight">
            ĐỒNG HÀNH CÙNG CÁC <br className="hidden sm:inline" />
            <span className="text-brand-600">TẬP ĐOÀN &amp; TỔ CHỨC TIÊU BIỂU</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
          <p className="text-slate-600 text-xs sm:text-sm">
            Tự hào được hơn 50.000 doanh nghiệp, tập đoàn kinh tế và ngân hàng hàng đầu Việt Nam tin tưởng lựa chọn.
          </p>
        </div>

        {/* ============================================================
            BĂNG CHUYỀN LOGO CHẠY NGANG (INFINITE MARQUEE SLIDER)
            Đã cập nhật chuẩn logo 2026 chính thức
            ============================================================ */}
        <div className="mb-12 sm:mb-16">
          <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 via-[#f6f8ff] to-slate-50 border border-slate-200/80 py-5 sm:py-6 shadow-inner">
            {/* 2 mép làm mờ gradient để logo xuất hiện và lặn mượt mà */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee flex items-center gap-4 sm:gap-6">
              {/* Vòng lặp thứ nhất */}
              {partners.map((p) => (
                <div
                  key={`marquee-1-${p.id}`}
                  className="w-48 sm:w-56 h-20 sm:h-24 bg-white rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-3.5 shrink-0 cursor-pointer group"
                  title={p.name}
                >
                  <img
                    src={p.logo}
                    alt={`Logo ${p.name}`}
                    className="max-h-12 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}

              {/* Vòng lặp thứ hai để hiệu ứng chạy ngang liên tục không bị giật */}
              {partners.map((p) => (
                <div
                  key={`marquee-2-${p.id}`}
                  className="w-48 sm:w-56 h-20 sm:h-24 bg-white rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-3.5 shrink-0 cursor-pointer group"
                  title={p.name}
                >
                  <img
                    src={p.logo}
                    alt={`Logo ${p.name}`}
                    className="max-h-12 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-3">
            <span className="text-[11px] font-medium text-slate-400">
              (Rê chuột vào thanh logo để tạm dừng)
            </span>
          </div>
        </div>

        {/* ============================================================
            BANNER HỢP TÁC B2B TINH GỌN
            ============================================================ */}
        <div className="rounded-2xl bg-gradient-to-r from-[#00222a] via-[#003843] to-[#004f5e] p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-300" />
              Doanh Nghiệp Cần Hồ Sơ Năng Lực &amp; Báo Giá Dự Thầu?
            </h4>
            <p className="text-xs text-slate-300">
              HDC Fashion hỗ trợ may mẫu thử 0đ, xuất hóa đơn VAT 100% và bảo hành 1 đổi 1 trong 30 ngày.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-400 hover:bg-brand-300 text-slate-900 font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              Báo Giá Thầu <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/2023-12-28_Catalogue%20%C4%91%E1%BB%93ng%20ph%E1%BB%A5c_1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-brand-300" /> Tải Catalogue
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
