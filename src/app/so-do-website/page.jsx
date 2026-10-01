"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SITE_TREE, ARCHITECTURE_SUMMARY } from "@/shared/data/siteArchitecture";
import {
  ChevronRight,
  Network,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  FolderTree,
} from "lucide-react";

export default function SiteMapPage() {
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");

  const filteredTree = useMemo(() => {
    return SITE_TREE.filter((item) => {
      if (selectedSection !== "all" && item.section !== selectedSection) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedSection]);

  const sections = [
    "all",
    "Trang Chính",
    "Danh Mục Sản Phẩm",
    "Trang Thông Tin",
    "Cẩm Nang & Tin Tức",
    "Hệ Thống",
    "Chính Sách Pháp Lý",
  ];

  return (
    <div className="bg-[#f6f8ff] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-bold">Sơ Đồ Website</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Network className="w-3.5 h-3.5" />
              HTML Sitemap • TỔNG: {ARCHITECTURE_SUMMARY.totalUrls} URL
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              SƠ ĐỒ CẤU TRÚC WEBSITE <br />
              <span className="text-brand-300">HDC FASHION ARCHITECTURE</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Cây phân cấp thông tin trực quan cho toàn bộ 37 đường dẫn trang chính, danh mục sản phẩm 4 cấp, content hub blog và chính sách pháp lý.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-brand-400/20 text-xs">
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                3 Trang chính
              </span>
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                17 Danh mục (4 cấp)
              </span>
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                2 Trang info
              </span>
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                11 Blog posts
              </span>
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                1 HTML sitemap
              </span>
              <span className="bg-brand-900/60 px-2.5 py-1 rounded-lg border border-brand-400/30">
                3 Legal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Section filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                  selectedSection === sec
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {sec === "all" ? "Tất Cả (37)" : sec}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm trang, URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tree List Grid */}
        <div className="space-y-4">
          {filteredTree.map((item) => {
            const isRoot = item.level === 1;
            const isSub = item.level >= 3;
            const isDeep = item.level === 4;

            return (
              <div
                key={item.path}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all hover:border-brand-400 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDeep
                    ? "ml-6 sm:ml-12 border-l-4 border-l-brand-400 border-slate-200"
                    : isSub
                    ? "ml-3 sm:ml-6 border-l-4 border-l-brand-600 border-slate-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.section}
                    </span>

                    {item.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                      Priority: [{item.priority}]
                    </span>

                    <span className="text-[10px] text-slate-400">
                      Cấp {item.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <Link
                      href={item.path}
                      className="hover:text-brand-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="mt-2 text-[11px] font-mono text-brand-600 bg-brand-50/60 px-2.5 py-1 rounded-md inline-block">
                    {item.path}
                  </div>
                </div>

                <Link
                  href={item.path}
                  className="px-4 py-2 bg-slate-100 hover:bg-brand-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                >
                  <span>Truy cập</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
