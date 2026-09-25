"use client";

import React from "react";
import { FABRIC_COMPARISONS } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import { Sparkles, Leaf, Send } from "lucide-react";

const NATURAL_MATERIALS = [
  {
    name: "Bông Cotton Tự Nhiên",
    desc: "Sợi bông dài chải kỹ, mềm mại, thấm hút tốt",
    image: "/images/02_materials_01.jpg",
  },
  {
    name: "Sợi Tre Bamboo Sinh Thái",
    desc: "Kháng khuẩn tự nhiên, mát lạnh mùa hè",
    image: "/images/02_materials_02.jpg",
  },
  {
    name: "Tơ Tằm Dệt Cao Cấp",
    desc: "Mềm mướt như lụa, sang trọng đẳng cấp",
    image: "/images/02_materials_03.jpg",
  },
  {
    name: "Len Wool Nhập Khẩu",
    desc: "Giữ ấm mùa đông, giữ phom vest đứng",
    image: "/images/02_materials_04.jpg",
  },
  {
    name: "Xơ Đay Thô Mộc",
    desc: "Chất liệu bền bỉ, thân thiện môi trường",
    image: "/images/02_materials_05.jpg",
  },
  {
    name: "Sợi Polyester Tái Sinh",
    desc: "Công nghệ mới, bền màu, khô nhanh",
    image: "/images/02_materials_06.jpg",
  },
];

export default function FabricGuideSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section id="fabric-guide-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-amber-600" />
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

        {/* ================================================
            NATURAL MATERIALS SHOWCASE
            ================================================ */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Nguyên Liệu Tự Nhiên
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#071b34] mt-3">
              Nguồn Nguyên Liệu Dệt May Thượng Hạng
            </h3>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto">
              Từ sợi bông tự nhiên đến tre sinh thái — mỗi nguyên liệu HUNI chọn lọc đều
              trải qua quy trình kiểm định khắt khe trước khi đưa vào sản xuất.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {NATURAL_MATERIALS.map((mat, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34]/40 to-transparent" />
                </div>
                <div className="p-3 flex-1">
                  <h4 className="font-bold text-[#071b34] text-xs leading-tight group-hover:text-amber-700 transition-colors">
                    {mat.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {mat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================
            FABRIC COMPARISON TABLE
            ================================================ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#071b34] text-white uppercase text-xs font-extrabold tracking-wider border-b border-amber-500/30">
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
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#071b34] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{fabric.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-xs">{fabric.features}</td>
                    <td className="py-4 px-5 font-semibold text-slate-800">{fabric.usage}</td>
                    <td className="py-4 px-5 text-amber-700 font-semibold">{fabric.shrinkage}</td>
                    <td className="py-4 px-5 text-center text-amber-500 font-bold whitespace-nowrap">
                      {fabric.breathability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-300/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#071b34] flex items-center justify-center font-bold shadow-md shrink-0">
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
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
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