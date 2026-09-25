"use client";

import React from "react";
import { FABRIC_COMPARISONS } from "@/shared/data";
import { useShop } from "@/context/ShopContext";
import { Sparkles, Layers, Check, Send, ShieldCheck, HeartHandshake } from "lucide-react";

export default function FabricGuideSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section id="fabric-guide-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            Cẩm Nang Chất Liệu Vải
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
            BẢNG SO SÁNH CHẤT LIỆU VẢI CAO CẤP HUNI
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            HUNI sử dụng 100% nguồn vải nhập khẩu chính ngạch, dệt công nghệ kháng khuẩn,
            thoáng mát và chống co rút sau 100 lần giặt.
          </p>
        </div>

        {/* Table Comparison Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#071b34] text-white uppercase text-xs font-extrabold tracking-wider border-b border-cyan-500/30">
                <tr>
                  <th className="py-4 px-5">Loại Vải Tiêu Biểu</th>
                  <th className="py-4 px-5">Đặc Tính Nổi Bật</th>
                  <th className="py-4 px-5">Phù Hợp Cho</th>
                  <th className="py-4 px-5">Độ Co Rút</th>
                  <th className="py-4 px-5 text-center">Độ Thoáng Khí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {FABRIC_COMPARISONS.map((fabric, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-cyan-50/40 transition-colors"
                  >
                    <td className="py-4 px-5 font-bold text-[#071b34] whitespace-nowrap flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span>{fabric.name}</span>
                    </td>
                    <td className="py-4 px-5 max-w-xs">{fabric.features}</td>
                    <td className="py-4 px-5 font-semibold text-slate-800">{fabric.usage}</td>
                    <td className="py-4 px-5 text-emerald-700 font-semibold">{fabric.shrinkage}</td>
                    <td className="py-4 px-5 text-center text-cyan-500 font-bold whitespace-nowrap">
                      {fabric.breathability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Banner bottom: Request Free Swatch */}
          <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-400/20 to-cyan-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cyan-300/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-[#071b34] flex items-center justify-center font-bold shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#071b34] text-sm sm:text-base">
                  Quý Doanh Nghiệp Cần Xem Trực Tiếp Bảng Vải Thật?
                </h4>
                <p className="text-xs text-slate-600">
                  HUNI sẽ chuyển phát hỏa tốc tập catalog vải mẫu miễn phí đến tận tay quý công ty.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-6 py-3 bg-[#071b34] hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Đăng Ký Nhận Bảng Vải 0đ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}