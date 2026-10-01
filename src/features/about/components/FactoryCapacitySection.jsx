"use client";

import React from "react";
import Image from "next/image";
import {
  Factory,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  Boxes,
  ArrowRight,
  Gauge,
  Workflow
} from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

export default function FactoryCapacitySection() {
  const { setIsQuickQuoteOpen } = useShop();

  const facilities = [
    {
      title: "Dàn Máy Thêu Vi Tính Tajima (Nhật Bản)",
      desc: "Hệ thống máy thêu 12 - 20 đầu đa kim độ phân giải cao, thêu sắc nét từng chi tiết logo siêu nhỏ, chỉ thêu bền màu chống xù lông tuyệt đối.",
      icon: Cpu,
      badge: "Tajima Japan",
    },
    {
      title: "Công Nghệ May Ép Seamless Không Đường May",
      desc: "Dây chuyền ép nhiệt cao tần phẳng mịn tuyệt đối, loại bỏ đường may truyền thống ở cổ áo và lai áo, đem lại cảm giác êm ái và đẳng cấp tối thượng.",
      icon: Sparkles,
      badge: "Độc Quyền HDC",
    },
    {
      title: "Hệ Thống Cắt Rập Tự Động CAD/CAM",
      desc: "Thiết kế rập vi tính và máy cắt laser/tự động với sai số dưới 0.1mm, đảm bảo 100% sản phẩm đồng đều form dáng theo từng size số cơ thể.",
      icon: Layers,
      badge: "Chuẩn Xác 100%",
    },
    {
      title: "In Nhiệt Kỹ Thuật Số & In PET 4K Siêu Bền",
      desc: "Mực in gốc nước thân thiện môi trường, tái hiện chuẩn 99% dải màu Pantone doanh nghiệp, không nứt gãy hay bong tróc sau 100 lần giặt máy.",
      icon: Zap,
      badge: "Bền Màu Cấp 4-5",
    },
  ];

  const kcsSteps = [
    {
      step: "01",
      title: "Kiểm Định Vải Mộc",
      desc: "Đo độ co dãn, kiểm tra độ bền màu ma sát, kiểm định chứng chỉ an toàn sợi vải trước khi đưa vào sản xuất.",
    },
    {
      step: "02",
      title: "Kiểm Soát Bán Thành Phẩm",
      desc: "KCS bám sát từng công đoạn cắt, thêu logo, may ráp chuyền; loại bỏ ngay các chi tiết lỗi nhỏ nhất.",
    },
    {
      step: "03",
      title: "Đo Form & Hoàn Thiện",
      desc: "Đo kích thước áo theo bảng thông số rập, kiểm tra độ chắc chắn của cúc áo, đường may mí và nhãn mác.",
    },
    {
      step: "04",
      title: "Rà Kim & Đóng Gói",
      desc: "100% sản phẩm đi qua máy rà kim loại tự động, là hơi công nghiệp và đóng gói màng seal chuyên nghiệp.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f6f8ff] border-t border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-300 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Factory className="w-3.5 h-3.5 text-brand-600" />
            Cơ Sở Vật Chất &amp; Năng Lực Sản Xuất
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] tracking-tight">
            XƯỞNG SẢN XUẤT 2.500M² <br className="hidden sm:inline" />
            <span className="text-brand-600">CÔNG NGHỆ MAY ĐO CÔNG NGHIỆP HIỆN ĐẠI</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
            HDC Fashion chủ động 100% quy trình khép kín từ dệt nhuộm vải, thiết kế rập 3D, cắt may đến in thêu hoàn thiện, đáp ứng linh hoạt từ <strong>20 bộ đến 50.000 sản phẩm/tháng</strong> với chất lượng đồng nhất.
          </p>
        </div>

        {/* 4 Highlight Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-3">
              <Factory className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#004f5e]">2.500 m²</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Xưởng Trực Tiếp</div>
            <div className="text-[11px] text-slate-500 mt-1">KCN Thụy Vân, Việt Trì, Phú Thọ</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-3">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brand-600">50.000+</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Sản Phẩm / Tháng</div>
            <div className="text-[11px] text-slate-500 mt-1">Dây chuyền LEAN liên tục</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-3">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#004f5e]">50+ Tấn</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Vải Sẵn Tại Kho</div>
            <div className="text-[11px] text-slate-500 mt-1">Đáp ứng đơn gấp 24h - 48h</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">KCS Đạt Chuẩn</div>
            <div className="text-[11px] text-slate-500 mt-1">Rà kim loại &amp; chứng chỉ an toàn</div>
          </div>
        </div>

        {/* Dây chuyền & Công nghệ máy móc */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-brand-600" />
                Hệ Thống Thiết Bị Công Nghệ Chủ Lực
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Trang bị 100% máy may điện tử tự động và thiết bị nhập khẩu chính hãng
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm">
              Tiêu chuẩn sản xuất công nghiệp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {facilities.map((f, i) => {
              const IconComp = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-brand-400 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50/80 border border-brand-200/70 px-2.5 py-1 rounded-full">
                        {f.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                      {f.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-600 gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" /> Vận hành trực tiếp tại nhà máy HDC
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quy trình kiểm soát chất lượng KCS 4 bước */}
        <div className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-200 border border-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Kiểm Định Nghiêm Ngặt
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              QUY TRÌNH KCS 4 CẤP ĐỘ KHÉP KÍN
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Mỗi chiếc áo trước khi bàn giao cho doanh nghiệp đều phải vượt qua 4 chốt chặn kiểm duyệt khắt khe, cam kết không lỗi chỉ, không bay màu, đúng form dáng mẫu đã duyệt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {kcsSteps.map((k) => (
              <div
                key={k.step}
                className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:bg-white/15 transition-all"
              >
                <div className="text-3xl font-black text-brand-300 mb-2">
                  {k.step}
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {k.title}
                </h4>
                <p className="text-xs text-slate-200/90 leading-relaxed">
                  {k.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-200 text-center sm:text-left">
              Quý doanh nghiệp muốn xem trực tiếp mẫu vải hoặc tham quan nhà xưởng?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-400 hover:bg-brand-300 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                Đăng Ký Nhận Mẫu Thử 0đ
              </button>
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
              >
                Hotline: {BRAND_INFO.contact.hotline}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
