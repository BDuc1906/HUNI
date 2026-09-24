"use client";

import React from "react";
import { CATEGORIES } from "@/data/products";
import { ArrowUpRight, Crown, Briefcase, Activity, GraduationCap, PackageCheck } from "lucide-react";

export default function CategoryShowcase({ onSelectCategory }) {
  const iconMap = {
    Briefcase,
    Crown,
    Activity,
    GraduationCap,
    PackageCheck
  };

  const displayCategories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <section id="category-showcase" className="py-16 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold">
            Danh Mục Chủ Lực
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            5 MẢNG DỊCH VỤ ĐỒNG PHỤC TOÀN DIỆN
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
            HUNI Uniform cung cấp giải pháp trọn gói từ định vị phong cách, phác thảo 3D,
            chọn chất liệu vải đến sản xuất may đo tận nơi.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xs hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 flex flex-col"
              >
                {/* Category Image */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Icon Badge */}
                  <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Arrow action */}
                  <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-sm line-clamp-1 group-hover:underline">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 dark:text-white">Xem bảng giá sỉ</span>
                    <span className="text-neutral-400 text-[11px]">{cat.count} mẫu</span>
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
