"use client";

import React from "react";
import { BRAND_INFO } from "@/data/products";
import { Phone, Mail, MapPin, ShieldCheck, Award, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Top 4 Key Commitments Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 py-8 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">Chất Lượng Vượt Trội</div>
              <div className="text-neutral-500 text-xs">Vải kháng khuẩn, co giãn 4 chiều</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">Thiết Kế Độc Quyền</div>
              <div className="text-neutral-500 text-xs">Miễn phí phác thảo 3D & may mẫu thử 0đ</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">Giá Gốc Tận Xưởng</div>
              <div className="text-neutral-500 text-xs">Quy mô 2.500m², không qua trung gian</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">Hỗ Trợ Đo Tận Nơi</div>
              <div className="text-neutral-500 text-xs">Hotline: {BRAND_INFO.contact.hotline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-sm">
                HN
              </div>
              <span className="font-extrabold text-base text-neutral-900 dark:text-white">
                HUNI UNIFORM
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Sở hữu bởi <strong>HDC GROUP VN</strong>, thương hiệu đồng phục HUNI với gần 10 năm kinh nghiệm
              đồng hành cùng hơn 50.000+ tập đoàn, doanh nghiệp, trường học và giải thể thao trên toàn quốc.
            </p>

            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-0.5 text-[11px]">
              <div className="text-neutral-500">Founder & CEO:</div>
              <div className="font-bold text-neutral-900 dark:text-white">{BRAND_INFO.ceo.name}</div>
              <div className="text-neutral-500">{BRAND_INFO.ceo.title}</div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <a href="#catalog-section" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Đồng phục Polo doanh nghiệp</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Vest & Sơ mi lãnh đạo may đo</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Đồng phục Golf & Pickleball thể thao</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Đồng phục học sinh & giáo viên</span>
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Phụ kiện nón, cặp da, túi quà tặng</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Headquarters & Branches matching Image 1 */}
          <div className="lg:col-span-5 space-y-2.5">
            <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
              Hệ Thống Trụ Sở & Cơ Sở
            </h4>

            <div className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 dark:text-white">Trụ sở Phú Thọ:</strong> {BRAND_INFO.contact.headquarters}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 dark:text-white">Chi nhánh Hà Nội:</strong> {BRAND_INFO.contact.branchHanoi}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 dark:text-white">Xưởng sản xuất:</strong> {BRAND_INFO.contact.factory}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                <div>
                  Hotline / Zalo:{" "}
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="font-bold text-neutral-900 dark:text-white hover:underline"
                  >
                    {BRAND_INFO.contact.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                <div>Email: {BRAND_INFO.contact.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © 2026 <strong>HDC GROUP VN - THƯƠNG HIỆU HUNI UNIFORM</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Bảo hành 30 ngày</span>
            <span>•</span>
            <span>Đổi trả 1 đổi 1</span>
            <span>•</span>
            <span>Hóa đơn điện tử VAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
