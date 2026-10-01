"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Compass, Target, Heart, CheckCircle2, Award, History, ArrowRight } from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

export default function BrandStorySection() {
  const { setIsQuickQuoteOpen } = useShop();

  const coreValues = [
    {
      key: "tam",
      title: "TÂM",
      subtitle: "Tận Tâm Phụng Sự",
      desc: "Đặt sức khỏe, sự thoải mái của người mặc và danh tiếng của doanh nghiệp đối tác làm kim chỉ nam trong từng quyết định vật liệu và thiết kế.",
      icon: Heart,
      color: "from-brand-500 to-brand-600",
      bgLight: "bg-brand-50 text-brand-700 border-brand-200",
    },
    {
      key: "tam_nhin",
      title: "TẦM",
      subtitle: "Tiên Phong Công Nghệ",
      desc: "Không ngừng đầu tư dây chuyền sản xuất hiện đại, ứng dụng công nghệ may Seamless không đường may và chất liệu sợi sinh học xanh đón đầu xu thế.",
      icon: Target,
      color: "from-[#00677a] to-[#004f5e]",
      bgLight: "bg-[#e6f6f9] text-[#00677a] border-[#99d9e5]",
    },
    {
      key: "tin",
      title: "TÍN",
      subtitle: "Trọng Chữ Tín Hơn Vàng",
      desc: "Cam kết chuẩn xác 100% về tiến độ giao hàng, minh bạch xuất xứ vải, xuất hóa đơn VAT đầy đủ và chính sách bảo hành 1 đổi 1 trong 30 ngày.",
      icon: Award,
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const milestones = [
    {
      year: "2017",
      title: "Khởi Nguồn Đất Tổ",
      desc: "Thành lập xưởng may đo đầu tiên tại Phú Thọ với 30 thợ may lành nghề, tập trung phân khúc đồng phục công sở chất lượng cao.",
    },
    {
      year: "2020",
      title: "Khai Trương Xưởng 2.500m²",
      desc: "Chính thức gia nhập KCN Thụy Vân (Việt Trì), đầu tư dàn máy thêu vi tính Tajima Nhật Bản và nâng công suất lên 30.000 sp/tháng.",
    },
    {
      year: "2023",
      title: "Tiên Phong Sợi Xanh & Seamless",
      desc: "Nghiên cứu ứng dụng công nghệ ép dán Seamless và các dòng vải sinh học (sợi bạc hà, sen, tre), ký kết hợp tác cùng hơn 30.000 doanh nghiệp.",
    },
    {
      year: "2026",
      title: "Hệ Sinh Thái Toàn Diện",
      desc: "Đạt mốc 50.000+ đối tác trên 63 tỉnh thành, mở rộng văn phòng đại diện tại Hà Nội và Hòa Bình, khẳng định vị thế dẫn đầu phân khúc B2B.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-brand-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-slate-100/80 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Câu Chuyện Thương Hiệu
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] tracking-tight">
            HÀNH TRÌNH KIẾN TẠO <br className="hidden sm:inline" />
            <span className="text-brand-600">BẢN SẮC DOANH NGHIỆP VIỆT</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
            Với triết lý <strong className="text-brand-800">“Phong cách tạo thành công”</strong>, HDC Fashion tin rằng mỗi bộ trang phục không chỉ đơn thuần là vải vóc, mà là biểu tượng của tinh thần kỷ luật, sự đoàn kết và niềm tự hào của hàng triệu nhân sự Việt Nam.
          </p>
        </div>

        {/* 2-Column: Triết lý & Tầm nhìn */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-400/20 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 text-brand-300 font-bold text-sm tracking-wider uppercase mb-3">
                <Compass className="w-4 h-4" /> Tầm Nhìn &amp; Sứ Mệnh
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                Trở thành thương hiệu đồng phục doanh nghiệp giải pháp toàn diện hàng đầu Việt Nam
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                HDC Fashion không ngừng đổi mới tư duy thiết kế và chuẩn hóa dây chuyền sản xuất công nghiệp, mang đến cho doanh nghiệp giải pháp trang phục nhận diện chuẩn mực quốc tế nhưng vẫn thấm đượm niềm tự hào văn hóa dân tộc.
              </p>

              <div className="space-y-3 pt-2 border-t border-white/15">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-100">
                    <strong>Đồng hành cùng thương hiệu:</strong> Thể hiện sắc nét màu cờ sắc áo và nét văn hóa doanh nghiệp độc bản.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-100">
                    <strong>Tối ưu ngân sách B2B:</strong> Tiết kiệm đến 30% chi phí trung gian nhờ hệ thống xưởng may trực tiếp 2.500m².
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-100">
                    <strong>Trải nghiệm nhân viên hoàn hảo:</strong> Chất liệu co giãn 4 chiều, chống nhăn, kháng khuẩn tạo sự thoải mái suốt ngày dài làm việc.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-brand-500 rounded-full inline-block" />
              Hệ Giá Trị Cốt Lõi: Tâm - Tầm - Tín
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Mỗi thành viên tại HDC GROUP VN đều thấm nhuần 3 nguyên tắc bất di bất dịch, đảm bảo mỗi sản phẩm xuất xưởng đều đạt chuẩn chất lượng tối ưu nhất:
            </p>

            <div className="space-y-3.5 pt-2">
              {coreValues.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.key}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-brand-400 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${item.bgLight}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-extrabold text-slate-900">{item.title}</h4>
                          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                            {item.subtitle}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hành trình phát triển (Milestones) */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase mb-2">
              <History className="w-3.5 h-3.5 text-brand-600" />
              Chặng Đường Gần 10 Năm
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#004f5e]">
              CÁC CỘT MỐC PHÁT TRIỂN QUAN TRỌNG
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="relative p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-brand-600 group-hover:scale-105 transition-transform">
                    {m.year}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center border border-brand-200">
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:gap-3"
            >
              Liên Hệ Hợp Tác Ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
