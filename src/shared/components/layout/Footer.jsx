"use client";

import React from "react";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Navigation,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-[#003843] text-slate-300 text-xs border-t border-brand-500/20">
      {/* Top Banner Feature Bar */}
      <div className="bg-[#004f5e] py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-400/20 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Chất Lượng Vượt Trội</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Vải kháng khuẩn, co giãn 4 chiều</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-400/20 text-brand-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Thiết Kế Độc Quyền</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Miễn phí phác thảo 3D & may mẫu thử</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-400/20 text-brand-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Giá Cạnh Tranh Tận Xưởng</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Quy mô 2.500m², không qua trung gian</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-400/20 text-brand-400 flex items-center justify-center shrink-0">
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
              {/* Footer logo — icon.png (chỉ symbol HDC, không có chữ FASHION) */}
              <div className="relative w-12 h-12 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-md shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/icon.png"
                  alt="HDC FASHION Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-wider block">HDC FASHION</span>
                <span className="text-[10px] text-brand-400 uppercase tracking-widest font-semibold">
                  HDC GROUP VN • ĐỒNG PHỤC DOANH NGHIỆP
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Sở hữu bởi <strong>HDC GROUP VN</strong>, thương hiệu đồng phục HDC với gần 10 năm kinh nghiệm
              đồng hành cùng hơn 50.000+ tập đoàn, doanh nghiệp, trường học và các giải thể thao trên toàn quốc.
            </p>

            <div className="p-3 bg-[#004f5e] rounded-2xl border border-brand-400/20 space-y-1 text-[11px]">
              <div className="text-brand-300 font-bold">Người sáng lập & Điều hành:</div>
              <div className="text-white font-extrabold text-sm">{BRAND_INFO.ceo.name}</div>
              <div className="text-slate-400">{BRAND_INFO.ceo.title}</div>
            </div>
          </div>

          {/* Core Categories Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-brand-400">
              Dịch Vụ Đồng Phục
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/dong-phuc-doanh-nghiep" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>Đồng phục doanh nghiệp (Hub)</span>
                </Link>
              </li>
              <li className="pl-3">
                <Link href="/dong-phuc-doanh-nghiep/ao-so-mi" className="hover:text-brand-300 transition-colors flex items-center gap-1 text-[11px] text-brand-300 font-semibold">
                  <span>★ Áo sơ mi nam công sở</span>
                </Link>
              </li>
              <li className="pl-3">
                <Link href="/dong-phuc-doanh-nghiep/ao-polo" className="hover:text-brand-300 transition-colors flex items-center gap-1 text-[11px]">
                  <span>• Áo polo đồng phục cao cấp</span>
                </Link>
              </li>
              <li>
                <Link href="/dong-phuc-may-do" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>Vest &amp; May đo lãnh đạo bespoke</span>
                </Link>
              </li>
              <li>
                <Link href="/dong-phuc-the-thao" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>Đồng phục Golf &amp; Pickleball</span>
                </Link>
              </li>
              <li>
                <Link href="/dong-phuc-truong-hoc" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>Đồng phục học sinh &amp; giáo viên</span>
                </Link>
              </li>
              <li>
                <Link href="/phu-kien-doanh-nghiep" className="hover:text-brand-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>Phụ kiện nón, cặp da, cà vạt</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office & Branches */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider text-brand-400">
              Hệ Thống Trụ Sở &amp; Showroom
            </h4>

            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-300 font-bold">VP Công ty (Hà Nội):</strong>{" "}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=S%E1%BB%91+6+Kim+%C4%90%E1%BB%93ng,+Ho%C3%A0ng+Mai,+H%C3%A0+N%E1%BB%99i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {BRAND_INFO.contact.branchHanoi} 📍
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Trụ sở Phú Thọ:</strong> {BRAND_INFO.contact.headquarters}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Xưởng sản xuất:</strong> {BRAND_INFO.contact.factory}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <div>
                  Hotline / Zalo:{" "}
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="text-brand-400 font-extrabold text-sm hover:underline"
                  >
                    {BRAND_INFO.contact.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <div>Email: {BRAND_INFO.contact.email}</div>
              </div>

              {/* Bản đồ Google Map trực tiếp tại chân trang */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-brand-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-brand-400" />
                    Bản đồ Google Map VP Hà Nội (Số 6 Kim Đồng):
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=S%E1%BB%91+6+Kim+%C4%90%E1%BB%93ng,+Ho%C3%A0ng+Mai,+H%C3%A0+N%E1%BB%99i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand-400 hover:text-white font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Mở bản đồ lớn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-900">
                  <iframe
                    src="https://maps.google.com/maps?q=S%E1%BB%91%206%20Kim%20%C4%90%E1%BB%93ng%2C%20Gi%C3%A1p%20B%C3%A1t%2C%20Ho%C3%A0ng%20Mai%2C%20H%C3%A0%20N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ Google Map VP Hà Nội Số 6 Kim Đồng"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Quick Links: Blog & Technical Hub */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase text-[11px] text-brand-400">Cẩm Nang 2026:</span>
            <Link href="/blog/size-ao-so-mi-nam" className="hover:text-brand-300">
              Bảng size sơ mi nam
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/blog/bao-gia-dong-phuc-cong-ty" className="hover:text-brand-300">
              Báo giá may đồng phục
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/blog/xu-huong-dong-phuc-2026" className="hover:text-brand-300">
              Xu hướng 2026
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/bang-vai" className="hover:text-brand-300">
              Bảng so sánh 9 loại vải
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/quy-trinh-may" className="hover:text-brand-300">
              Quy trình may 5 bước
            </Link>
          </div>

          <div>
            <Link
              href="/so-do-website"
              className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
            >
              <span>Sơ Đồ Website (37 URL)</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong>HDC GROUP VN - THƯƠNG HIỆU HDC FASHION</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <Link
              href="/chinh-sach-bao-mat"
              className="hover:text-brand-300 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              href="/chinh-sach-doi-tra"
              className="hover:text-brand-300 transition-colors"
            >
              Chính sách đổi trả 30 ngày
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              href="/dieu-khoan-su-dung"
              className="hover:text-brand-300 transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              href="/so-do-website"
              className="hover:text-brand-300 transition-colors font-bold text-brand-400"
            >
              Sơ đồ website
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}