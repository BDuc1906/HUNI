"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FABRIC_COMPARISONS } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  Leaf,
  Send,
  HandHeart,
  Layers,
  Waves,
  Shirt,
  Recycle,
  CheckCircle2,
  TableProperties,
  LayoutGrid
} from "lucide-react";

// 5 NGUYÊN LIỆU TỰ NHIÊN
const NATURAL_MATERIALS = [
  {
    name: "Sợi Modal",
    source: "Gỗ sồi Bắc Âu",
    image: "/images/02_materials_02.jpg",
    iconImage: "/images/modal_tree_icon.png",
    iconPos: { x: 92, y: 78, size: 42 },
  },
  {
    name: "Sợi Bamboo",
    source: "Cây tre tự nhiên",
    image: "/images/02_materials_03.jpg",
    iconImage: "/images/02_materials_04.jpg",
    iconPos: { x: 84, y: 76, size: 34 },
  },
  {
    name: "Sợi Bạc Hà",
    source: "Lá bạc hà hữu cơ",
    image: "/images/02_materials_05.jpg",
    iconImage: "/images/02_materials_06.jpg",
    iconPos: { x: 78, y: 98, size: 80 },
  },
  {
    name: "Sợi Sen",
    source: "Tơ cuống sen",
    image: "/images/02_materials_07.jpg",
    iconImage: "/images/02_materials_08.jpg",
    iconPos: { x: 80, y: 98, size: 70 },
  },
  {
    name: "Sợi Chuối",
    source: "Thân cây chuối",
    image: "/images/02_materials_09.jpg",
    iconImage: "/images/banana_leaf_icon.png",
    iconPos: { x: 82, y: 78, size: 46, flip: true },
  },
];

// 5 ĐẶC TÍNH CHẤT LIỆU XANH
const GREEN_FEATURES = [
  { icon: HandHeart, title: "Siêu mềm mượt", desc: "Êm dịu với mọi làn da nhạy cảm", ring: false },
  { icon: Layers, title: "Bền đẹp, giữ màu", desc: "Không phai sau 100 lần giặt", ring: true },
  { icon: Waves, title: "Kháng khuẩn, thoáng khí", desc: "Khử mùi hôi và thoát nhiệt 3°C", ring: true },
  { icon: Shirt, title: "Chống nhăn vượt trội", desc: "Hạn chế ủi, giữ form đứng dáng", ring: false, crossed: true },
  { icon: Recycle, title: "Thân thiện môi trường", desc: "Phân hủy sinh học 100%", ring: true },
];

export default function FabricGuideSection() {
  const { setIsQuickQuoteOpen } = useShop();
  const [mobileView, setMobileView] = useState("cards"); // "cards" | "table"

  return (
    <section id="fabric-guide-section" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-brand-600" />
            Cẩm Nang Chất Liệu Xanh 2026
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            BẢNG SO SÁNH CHẤT LIỆU VẢI CAO CẤP HDC
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            HDC tuyển chọn 100% nguồn vải sinh học chính ngạch đạt chuẩn Oeko-Tex Standard 100,
            ứng dụng dệt phân tử kháng khuẩn, thoáng mát và chống co giãn méo form.
          </p>
        </div>

        {/* 5 NGUYÊN LIỆU SINH HỌC */}
        <div className="mb-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 justify-items-center">
            {NATURAL_MATERIALS.map((mat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-brand-200/60 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="w-full h-full object-cover"
                      style={{ transform: "scale(1.4)", transformOrigin: "center top" }}
                      loading="lazy"
                    />
                  </div>

                  {/* Icon nguyên liệu overlay with CSS mix-blend-multiply (no CPU flood fill lag) */}
                  <div
                    className="absolute z-10 pointer-events-none drop-shadow-sm"
                    style={{
                      left: `${mat.iconPos.x}%`,
                      top: `${mat.iconPos.y}%`,
                      width: `${mat.iconPos.size}%`,
                      aspectRatio: "1 / 1",
                      transform: `translate(-50%, -50%)${mat.iconPos.flip ? " scaleX(-1)" : ""}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mat.iconImage}
                      alt=""
                      className="w-full h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>

                <h4 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-[#004f5e] group-hover:text-brand-600 transition-colors">
                  {mat.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {mat.source}
                </p>
              </div>
            ))}
          </div>

          {/* Đường phân cách */}
          <div className="my-8 sm:my-10 h-px w-full bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

          {/* 5 Đặc tính chất liệu xanh */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {GREEN_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`relative w-12 h-12 flex items-center justify-center text-brand-600 mb-2.5 ${
                      item.ring ? "rounded-full border-2 border-brand-500 bg-brand-50/50" : "bg-brand-50/30 rounded-xl"
                    }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                    {item.crossed && (
                      <span className="absolute w-10 h-[2px] bg-brand-600 rotate-[-35deg]" />
                    )}
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    {item.title}
                  </h5>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BẢNG SO SÁNH VẢI — Responsive View */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#004f5e] to-[#00677a] px-4 sm:px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-300" />
              <h3 className="font-extrabold text-sm sm:text-base">
                Thông Số Kỹ Thuật Các Dòng Vải Chủ Lực
              </h3>
            </div>

            {/* Mobile Toggle view button */}
            <div className="flex sm:hidden items-center gap-1 bg-white/10 p-1 rounded-xl text-[11px]">
              <button
                onClick={() => setMobileView("cards")}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 ${
                  mobileView === "cards" ? "bg-white text-[#004f5e]" : "text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" /> Dạng Thẻ
              </button>
              <button
                onClick={() => setMobileView("table")}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 ${
                  mobileView === "table" ? "bg-white text-[#004f5e]" : "text-white"
                }`}
              >
                <TableProperties className="w-3 h-3" /> Bảng
              </button>
            </div>
          </div>

          {/* Desktop Table View / Mobile Optional */}
          <div className={`${mobileView === "cards" ? "hidden sm:block" : "block"} overflow-x-auto`}>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Loại Vải Tiêu Biểu</th>
                  <th className="py-3.5 px-4 sm:px-5">Đặc Tính Nổi Bật</th>
                  <th className="py-3.5 px-4 sm:px-5">Phù Hợp Cho</th>
                  <th className="py-3.5 px-4 sm:px-5">Độ Co Rút</th>
                  <th className="py-3.5 px-4 sm:px-5 text-center">Độ Thoáng Khí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {FABRIC_COMPARISONS.map((fabric, idx) => (
                  <tr key={idx} className="hover:bg-brand-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-[#004f5e] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span>{fabric.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 max-w-xs">{fabric.features}</td>
                    <td className="py-3.5 px-4 sm:px-5 font-semibold text-slate-800">{fabric.usage}</td>
                    <td className="py-3.5 px-4 sm:px-5 text-brand-700 font-semibold">{fabric.shrinkage}</td>
                    <td className="py-3.5 px-4 sm:px-5 text-center text-brand-600 font-bold whitespace-nowrap">
                      {fabric.breathability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Dễ đọc trên điện thoại) */}
          {mobileView === "cards" && (
            <div className="block sm:hidden p-3 space-y-3">
              {FABRIC_COMPARISONS.map((fabric, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-[#004f5e] text-sm">{fabric.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px]">
                      {fabric.breathability}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong className="text-slate-800">Đặc tính:</strong> {fabric.features}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Phù hợp: <strong className="text-slate-700">{fabric.usage}</strong></span>
                    <span className="text-brand-700 font-semibold">Co rút: {fabric.shrinkage}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-brand-50 via-brand-100/50 to-brand-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-200/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#004f5e] text-xs sm:text-sm md:text-base">
                  Quý Doanh Nghiệp Cần Trực Tiếp Cảm Nhận Bảng Vải Thật?
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  HDC chuyển phát hỏa tốc tập catalog vải mẫu kèm bảng màu thực tế tận nơi hoàn toàn 0đ.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuickQuoteOpen(true)}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center justify-center gap-2 active:scale-[0.98]"
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
