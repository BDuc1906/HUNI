"use client";

import React from "react";
import { BRAND_INFO, CATEGORIES } from "@/data/products";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-[#040e1c] text-slate-300 text-xs border-t border-amber-500/20">
      {/* Top Banner Feature Bar */}
      <div className="bg-[#071b34] py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Chất Lượng Vượt Trội</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Vải kháng khuẩn, co giãn 4 chiều</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Thiết Kế Độc Quyền</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Miễn phí phác thảo 3D & may mẫu thử</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Giá Cạnh Tranh Tận Xưởng</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Quy mô 2.500m², không qua trung gian</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Tư Vấn & Đo Tận Nơi</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Hotline 24/7: {BRAND_INFO.contact.hotline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#071b34] font-black text-lg shadow-md">
                HN
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-wider block">HUNI UNIFORM</span>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                  HDC GROUP VN • ĐỒNG PHỤC DOANH NGHIỆP
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Sở hữu bởi <strong>HDC GROUP VN</strong>, thương hiệu đồng phục HUNI với gần 10 năm kinh nghiệm
              đồng hành cùng hơn 50.000+ tập đoàn, doanh nghiệp, trường học và các giải thể thao trên toàn quốc.
            </p>

            <div className="p-3 bg-[#071b34] rounded-2xl border border-amber-400/20 space-y-1 text-[11px]">
              <div className="text-amber-300 font-bold">Người sáng lập & Điều hành:</div>
              <div className="text-white font-extrabold text-sm">{BRAND_INFO.ceo.name}</div>
              <div className="text-slate-400">{BRAND_INFO.ceo.title}</div>
            </div>
          </div>

          {/* Core Categories Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-amber-400">
              Dịch Vụ Đồng Phục
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#catalog-section" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Đồng phục Polo doanh nghiệp</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Vest & Sơ mi lãnh đạo may đo</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Đồng phục Golf & Pickleball thể thao</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Đồng phục học sinh & giáo viên</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Phụ kiện nón, cặp da, túi quà tặng</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Head Office & Branches matching Image 1 */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-amber-400">
              Hệ Thống Trụ Sở & Showroom
            </h4>

            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Trụ sở Phú Thọ:</strong> {BRAND_INFO.contact.headquarters}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Chi nhánh Hà Nội:</strong> {BRAND_INFO.contact.branchHanoi}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Xưởng sản xuất:</strong> {BRAND_INFO.contact.factory}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  Hotline / Zalo tiếp nhận:{" "}
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="text-amber-400 font-extrabold text-sm hover:underline"
                  >
                    {BRAND_INFO.contact.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>Email: {BRAND_INFO.contact.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong>HDC GROUP VN - THƯƠNG HIỆU HUNI UNIFORM</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Chính sách bảo mật</span>
            <span>•</span>
            <span>Chính sách đổi trả 30 ngày</span>
            <span>•</span>
            <span>Xuất hóa đơn VAT điện tử</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
