"use client";

import React from "react";
import { CATEGORIES } from "@/data/products";
import { ArrowUpRight, Crown, Briefcase, Activity, GraduationCap, PackageCheck } from "lucide-react";

export default function CategoryShowcase({ onSelectCategory }) {
  const iconMap = {
    Briefcase: Briefcase,
    Crown: Crown,
    Activity: Activity,
    GraduationCap: GraduationCap,
    PackageCheck: PackageCheck
  };

  // Only take actual categories excluding 'all'
  const displayCategories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <section id="category-showcase" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
            Danh Mục Chủ Lực
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
            5 MẢNG DỊCH VỤ ĐỒNG PHỤC TOÀN DIỆN
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            HUNI Uniform cung cấp giải pháp may đo đồng phục trọn gói từ khâu định vị phong cách,
            thiết kế 3D, chọn chất vải đến sản xuất và giao nhận tận nơi.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Briefcase;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.id);
                  const el = document.getElementById("catalog-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-400 flex flex-col transform hover:-translate-y-1.5"
              >
                {/* Category Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34] via-[#071b34]/40 to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#071b34] flex items-center justify-center shadow-md group-hover:bg-amber-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Arrow action */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-amber-400 text-[#071b34] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4 font-bold" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-[#071b34] group-hover:text-amber-600 transition-colors text-base line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-amber-600 font-bold">Xem mẫu & bảng giá</span>
                    <span className="text-slate-400 font-medium">{cat.count} mẫu hot</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
