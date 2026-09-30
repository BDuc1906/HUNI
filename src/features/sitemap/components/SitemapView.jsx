"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import {
  Network,
  GitFork,
  Compass,
  ArrowRight,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  Building2,
  Trophy,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function SitemapView() {
  const [activeTab, setActiveTab] = useState("tree"); // 'tree' | 'overview' | 'userflow' | 'linkequity' | 'keywords'
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopy = (url) => {
    const fullUrl = `https://hdcfashion.vn${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Filtered URLs based on search query
  const filteredUrls = useMemo(() => {
    if (!searchQuery.trim()) return SITE_HIERARCHY.allUrls;
    const query = searchQuery.toLowerCase().trim();
    return SITE_HIERARCHY.allUrls.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query) ||
        (item.keywords && item.keywords.some((kw) => kw.toLowerCase().includes(query)))
    );
  }, [searchQuery]);

  // Group URLs by Tiers for Tree View
  const tier1Urls = filteredUrls.filter(
    (u) =>
      u.url === "/" ||
      u.url === "/gioi-thieu" ||
      u.url === "/lien-he" ||
      u.url === "/bang-vai" ||
      u.url === "/quy-trinh-may" ||
      u.url === "/so-do-website"
  );

  const tier2Hubs = filteredUrls.filter((u) =>
    [
      "/dong-phuc-doanh-nghiep",
      "/dong-phuc-may-do",
      "/dong-phuc-the-thao",
      "/dong-phuc-truong-hoc",
      "/phu-kien-doanh-nghiep",
    ].includes(u.url)
  );

  const tier3And4Urls = filteredUrls.filter(
    (u) =>
      u.url.startsWith("/dong-phuc-") &&
      u.url.split("/").length >= 3 &&
      !u.url.startsWith("/blog")
  );

  const accessorySubUrls = filteredUrls.filter(
    (u) => u.url.startsWith("/phu-kien-doanh-nghiep/")
  );

  const blogUrls = filteredUrls.filter((u) => u.url.startsWith("/blog"));
  const legalUrls = filteredUrls.filter(
    (u) =>
      u.url === "/chinh-sach-bao-mat" ||
      u.url === "/chinh-sach-doi-tra" ||
      u.url === "/dieu-khoan-su-dung"
  );

  // Keyword matrix data
  const keywordMatrix = [
    {
      group: "1. ÁO SƠ MI (KEYWORD CHÍNH)",
      targetUrl: "/dong-phuc-doanh-nghiep/ao-so-mi",
      priority: 0.95,
      mainKeywords: "áo sơ mi đồng phục, sơ mi công sở nam nữ",
      subKeywords: "sơ mi tay ngắn, sơ mi tay dài, sơ mi không đường may seamless, áo sơ mi nam đẹp",
    },
    {
      group: "2. ÁO POLO DOANH NGHIỆP",
      targetUrl: "/dong-phuc-doanh-nghiep/ao-polo",
      priority: 0.9,
      mainKeywords: "áo polo đồng phục, áo thun có cổ công ty",
      subKeywords: "áo polo cotton compact, polo pique mắt chim, thêu logo áo polo 3D",
    },
    {
      group: "3. MAY ĐO BESPOKE & VEST",
      targetUrl: "/dong-phuc-may-do",
      priority: 0.9,
      mainKeywords: "may đo đồng phục cao cấp, vest doanh nhân",
      subKeywords: "vest lãnh đạo cao cấp, may đo sơ mi cá nhân, đầm công sở thiết kế",
    },
    {
      group: "4. THỂ THAO & GOLF DOANH NGHIỆP",
      targetUrl: "/dong-phuc-the-thao",
      priority: 0.85,
      mainKeywords: "áo golf doanh nhân, đồng phục pickleball",
      subKeywords: "áo chạy bộ marathon, áo thể thao co giãn 4 chiều kháng tia UV",
    },
    {
      group: "5. BẢNG BÁO GIÁ & CHI PHÍ",
      targetUrl: "/blog/bao-gia-dong-phuc-cong-ty",
      priority: 0.85,
      mainKeywords: "báo giá may đồng phục công ty, giá áo thun polo",
      subKeywords: "chi phí may đồng phục số lượng lớn, chiết khấu may áo đồng phục 35%",
    },
    {
      group: "6. HƯỚNG DẪN SIZE CHUẨN",
      targetUrl: "/blog/size-ao-so-mi-nam",
      priority: 0.85,
      mainKeywords: "bảng size áo sơ mi nam, cách chọn size áo công sở",
      subKeywords: "size sơ mi theo chiều cao cân nặng, số đo vòng cổ ngực bụng chuẩn châu Á",
    },
    {
      group: "7. ĐỒNG PHỤC TRƯỜNG HỌC",
      targetUrl: "/dong-phuc-truong-hoc",
      priority: 0.85,
      mainKeywords: "đồng phục học sinh, đồng phục giáo viên trường học",
      subKeywords: "đồng phục cấp 1 2 3, áo sơ mi học sinh, áo thể dục trường học",
    },
    {
      group: "8. LOCAL SEO & XƯỞNG SẢN XUẤT",
      targetUrl: "/lien-he",
      priority: 0.9,
      mainKeywords: "xưởng may đồng phục Phú Thọ, xưởng may áo thun Hà Nội",
      subKeywords: "địa chỉ may đồng phục uy tín, công ty may HDC Fashion showroom",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-brand-800 font-bold">Sơ Đồ Website & Kiến Trúc SEO</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-400/30">
              <Network className="w-3.5 h-3.5" />
              Kiến Trúc Chuẩn SEO & UX Multi-tier
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              SƠ ĐỒ SITEMAP & DANH MỤC TOÀN DIỆN HDC FASHION
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6">
              Hệ thống phân cấp 4 tầng gồm đầy đủ <strong>37 URLs chuẩn hóa</strong>, 4 luồng người dùng (User Flows),
              dòng chảy truyền giá trị SEO Link Equity, và ma trận từ khóa phục vụ tối ưu hóa công cụ tìm kiếm Google.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-brand-300">37 URLs</div>
                <div className="text-[11px] text-slate-300">Tổng link sitemap index</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-brand-300">4 Tầng</div>
                <div className="text-[11px] text-slate-300">Phân cấp sâu nhất &lt; 3 click</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-brand-300">10 Bài Viết</div>
                <div className="text-[11px] text-slate-300">Content Hub kiến thức chuyên sâu</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-brand-300">0.95 Max</div>
                <div className="text-[11px] text-slate-300">Trọng số ưu tiên Hub & Sơ mi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab("tree")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "tree"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Sơ Đồ Phân Cấp (37 URLs)</span>
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sơ Đồ 1: Tổng Thể Website</span>
            </button>

            <button
              onClick={() => setActiveTab("userflow")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "userflow"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sơ Đồ 3: User Flow (4 Luồng)</span>
            </button>

            <button
              onClick={() => setActiveTab("linkequity")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "linkequity"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sơ Đồ 4: SEO Link Juice</span>
            </button>

            <button
              onClick={() => setActiveTab("keywords")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "keywords"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sơ Đồ 5: Ma Trận Từ Khóa</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm URL, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: SƠ ĐỒ 2: TREE VIEW TOÀN BỘ 37 URLs                */}
        {/* ========================================================= */}
        {activeTab === "tree" && (
          <div className="space-y-8">
            {/* TẦNG 1: ROOT & TRANG CHÍNH */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                    TẦNG 1 • ROOT & TRANG CỐT LÕI
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Trang Chủ & Nhóm Thông Tin Cơ Bản
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{tier1Urls.length} URLs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tier1Urls.map((item) => (
                  <div
                    key={item.url}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-brand-300 hover:bg-brand-50/20 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-500 text-white">
                          Priority {item.priority.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {item.changeFrequency}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-800 group-hover:text-brand-700 transition-colors">
                        {item.title}
                      </div>
                      <code className="text-[11px] text-slate-500 font-mono block mt-1 break-all">
                        {item.url}
                      </code>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60">
                      <Link
                        href={item.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
                      >
                        <span>Truy cập</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleCopy(item.url)}
                        title="Sao chép link đầy đủ"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-all"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TẦNG 2: 5 HUBS SẢN PHẨM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    TẦNG 2 • 5 HUBS DANH MỤC SẢN PHẨM CHÍNH
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Cụm Danh Mục Cấp Cao (Hub Pages)
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{tier2Hubs.length} URLs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tier2Hubs.map((item) => (
                  <div
                    key={item.url}
                    className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200/60 hover:border-emerald-400 hover:bg-emerald-50/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-700 text-white">
                          Priority {item.priority.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {item.changeFrequency}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-800 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </div>
                      <code className="text-[11px] text-emerald-700 font-mono block mt-1 break-all">
                        {item.url}
                      </code>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-emerald-200/60">
                      <Link
                        href={item.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        <span>Vào danh mục Hub</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleCopy(item.url)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-white transition-all"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TẦNG 3 & 4: CÁC SUB-CATEGORIES & PHÂN NHÓM SÂU */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    TẦNG 3 & 4 • PHÂN NHÓM SẢN PHẨM & SUB-CATEGORIES CHI TIẾT
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Cụm URL Áo Sơ Mi, Polo, May Đo, Golf, Trường Học & Phụ Kiện
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {tier3And4Urls.length + accessorySubUrls.length} URLs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...tier3And4Urls, ...accessorySubUrls].map((item) => {
                  const isTier4 = item.url.split("/").length > 3;
                  return (
                    <div
                      key={item.url}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                        isTier4
                          ? "bg-sky-50/50 border-sky-300 ring-1 ring-sky-200"
                          : "bg-slate-50 border-slate-200/80 hover:border-brand-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${
                              isTier4 ? "bg-sky-600" : "bg-slate-700"
                            }`}
                          >
                            Priority {item.priority.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-sky-800 font-bold uppercase tracking-wider">
                            {isTier4 ? "Tầng 4 (Chi tiết)" : "Tầng 3"}
                          </span>
                        </div>
                        <div className="font-extrabold text-sm text-slate-800 group-hover:text-brand-700 transition-colors">
                          {item.title}
                        </div>
                        <code className="text-[11px] text-slate-500 font-mono block mt-1 break-all">
                          {item.url}
                        </code>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60">
                        <Link
                          href={item.url}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
                        >
                          <span>Xem sản phẩm</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleCopy(item.url)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-all"
                        >
                          {copiedUrl === item.url ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TẦNG CONTENT HUB & 10 BÀI VIẾT BLOG SEO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    CONTENT HUB • 10 BÀI VIẾT KIẾN THỨC CHUYÊN SÂU
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Cụm Blog & Hướng Dẫn Kỹ Thuật (SEO Link Juice Generators)
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{blogUrls.length} URLs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogUrls.map((item) => (
                  <div
                    key={item.url}
                    className="p-4 rounded-2xl bg-amber-50/20 border border-amber-200/60 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-600 text-white">
                          Priority {item.priority.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {item.changeFrequency}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-2">
                        {item.title}
                      </div>
                      <code className="text-[11px] text-amber-800/80 font-mono block mt-1 break-all">
                        {item.url}
                      </code>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-amber-200/60">
                      <Link
                        href={item.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        <span>Đọc bài viết</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleCopy(item.url)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-white transition-all"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TẦNG PHÁP LÝ & FOOTER LEGAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    TẦNG LEGAL & POLICY
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    Chính Sách & Điều Khoản Pháp Lý
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{legalUrls.length} URLs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {legalUrls.map((item) => (
                  <div
                    key={item.url}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-400 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-400 text-white">
                          Priority {item.priority.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {item.changeFrequency}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-800 group-hover:text-slate-900 transition-colors">
                        {item.title}
                      </div>
                      <code className="text-[11px] text-slate-500 font-mono block mt-1 break-all">
                        {item.url}
                      </code>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60">
                      <Link
                        href={item.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                      >
                        <span>Xem chi tiết</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleCopy(item.url)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SƠ ĐỒ 1: TỔNG THỂ WEBSITE ARCHITECTURE             */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div>
              <span className="text-[10px] font-black tracking-widest text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                SƠ ĐỒ 1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Kiến Trúc Tổng Thể Website HDC Fashion
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Mô hình phân tầng bảo đảm mọi trang sản phẩm và bài viết đều cách Trang Chủ tối đa 3 lần click chuột.
              </p>
            </div>

            {/* Tree Diagram Visualizer */}
            <div className="p-6 bg-slate-900 rounded-3xl text-white overflow-x-auto">
              {/* Root */}
              <div className="flex justify-center mb-6">
                <div className="bg-brand-500 text-white px-6 py-3.5 rounded-2xl shadow-lg border border-brand-300 text-center min-w-[240px]">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-200">ROOT LEVEL [1.0]</div>
                  <div className="text-base font-black">🏠 TRANG CHỦ (/)</div>
                  <div className="text-[11px] text-white/80">hdcfashion.vn</div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="w-full flex items-center justify-center mb-6">
                <div className="w-11/12 h-0.5 bg-slate-700 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-6 bg-slate-700" />
                </div>
              </div>

              {/* Tier 2: 4 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Hub Doanh Nghiệp */}
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-brand-500/40">
                  <div className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-1">
                    HUB CHÍNH [0.95]
                  </div>
                  <div className="font-extrabold text-sm text-white">👔 Đồng Phục Doanh Nghiệp</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">/dong-phuc-doanh-nghiep</div>
                  <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <span>Áo Polo [0.9]</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-300 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Áo Sơ Mi [0.95] ★ KEYWORD</span>
                    </div>
                    <div className="pl-4 text-[11px] text-slate-400 space-y-1">
                      <div>↳ Tay Ngắn [0.85]</div>
                      <div>↳ Tay Dài [0.85]</div>
                      <div>↳ Seamless [0.8]</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <span>Áo Thun [0.85]</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <span>Công Sở Trọn Gói [0.9]</span>
                    </div>
                  </div>
                </div>

                {/* Hub May Đo & Thể Thao */}
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    MAY ĐO & THỂ THAO
                  </div>
                  <div className="font-extrabold text-sm text-white">🎩 May Đo & ⛳ Golf [0.85 - 0.9]</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">/may-do & /the-thao</div>
                  <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                    <div>• Vest Lãnh Đạo [0.85]</div>
                    <div>• Đầm Công Sở [0.8]</div>
                    <div>• Golf Doanh Nhân [0.85]</div>
                    <div>• Pickleball [0.8]</div>
                    <div>• Marathon [0.75]</div>
                  </div>
                </div>

                {/* Hub Trường Học & Phụ Kiện */}
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700">
                  <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                    GIÁO DỤC & PHỤ KIỆN
                  </div>
                  <div className="font-extrabold text-sm text-white">🎓 Trường Học & 🎁 Phụ Kiện</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">/truong-hoc & /phu-kien</div>
                  <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                    <div>• Học Sinh Các Cấp [0.85]</div>
                    <div>• Giáo Viên & Cán Bộ [0.75]</div>
                    <div>• Mũ Nón Lưỡi Trai [0.7]</div>
                    <div>• Cặp Da Quà Tặng [0.7]</div>
                    <div>• Cà Vạt & Khăn Lụa [0.65]</div>
                  </div>
                </div>

                {/* Content Hub & Local SEO */}
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-emerald-500/40">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    CONTENT HUB & LOCAL
                  </div>
                  <div className="font-extrabold text-sm text-white">📰 Blog & 📞 Showroom</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">/blog & /lien-he [0.8 - 0.9]</div>
                  <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                    <div>• 10 Bài Viết SEO Chuyên Sâu</div>
                    <div>• Bảng Size Sơ Mi [0.85]</div>
                    <div>• Báo Giá Doanh Nghiệp [0.85]</div>
                    <div>• Showroom Phú Thọ & Hà Nội</div>
                    <div>• 3 Trang Legal & Policy [0.3]</div>
                  </div>
                </div>
              </div>

              {/* ISO Flow Note */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Nguyên tắc Click-depth:</strong> Toàn bộ 37 trang web đều được liên kết mạch lạc qua Header,
                  Footer và hệ thống Breadcrumb, cam kết không có orphan page (trang mồ côi) trong chỉ mục Google.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SƠ ĐỒ 3: USER FLOW (4 LUỒNG KHÁCH HÀNG)           */}
        {/* ========================================================= */}
        {activeTab === "userflow" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black tracking-widest text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                SƠ ĐỒ 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                4 Luồng Người Dùng Chiến Lược (User Flows)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tối ưu hóa tỷ lệ chuyển đổi (CRO) bằng các hành trình được định hình riêng cho từng nhóm khách hàng mục tiêu.
              </p>
            </div>

            {/* Flow 1: Doanh nghiệp B2B */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Luồng 1: Khách Doanh Nghiệp Lớn B2B (Polo / Sơ Mi / Công Sở)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hành trình của phòng Nhân sự / Thu mua tìm đơn vị may đồng phục 100 - 5.000 chiếc.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 1</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Google Search</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tìm từ khóa &ldquo;may áo sơ mi đồng phục công ty&rdquo;
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200">
                  <span className="text-[10px] font-black text-brand-600 uppercase">Bước 2</span>
                  <div className="font-bold text-xs text-brand-900 mt-1">Trang Danh Mục</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Hạ cánh tại <code>/dong-phuc-doanh-nghiep/ao-so-mi</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 3</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Bộ Lọc Phân Nhóm</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Chọn xem <strong>Tay ngắn</strong>, <strong>Tay dài</strong> hoặc vải <strong>Seamless</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 4</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Xem Chi Tiết & Bảng Vải</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    So sánh chất vải chống nhăn và chính sách bảo hành 30 ngày
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Bước 5: Chuyển Đổi</span>
                  <div className="font-bold text-xs text-emerald-900 mt-1">Nhận Báo Giá 0đ</div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    Click Báo giá nhanh / Nhắn Zalo may mẫu thử 0đ
                  </div>
                </div>
              </div>
            </div>

            {/* Flow 2: Khách Thể Thao & Golf */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Luồng 2: Khách Thể Thao, Giải Đấu Golf & Sự Kiện Doanh Nghiệp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tìm kiếm trang phục co giãn 4 chiều, chống tia UV cho giải đấu và hội thao.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 1</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Mạng Xã Hội / Khách Quen</div>
                  <div className="text-[11px] text-slate-500 mt-1">Vào qua link bài viết hoặc giới thiệu</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-black text-sky-700 uppercase">Bước 2</span>
                  <div className="font-bold text-xs text-sky-900 mt-1">Hub Thể Thao</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Truy cập <code>/dong-phuc-the-thao/golf</code> hoặc <code>/pickleball</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 3</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Chọn Form & Vải Dry-fit</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Xem mẫu in nhiệt 3D sắc nét không bong tróc
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Bước 4: Chuyển Đổi</span>
                  <div className="font-bold text-xs text-emerald-900 mt-1">Đặt In / May Mẫu</div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    Yêu cầu demo 3D logo giải đấu trong 30 phút
                  </div>
                </div>
              </div>
            </div>

            {/* Flow 3: Khách Tìm Kiếm Thông Tin / Content Hub */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Luồng 3: Khách B2C & Tra Cứu Kiến Thức (Organic Inbound)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tìm kiếm bảng size, các loại cổ áo sơ mi, bí quyết chọn vải không nhăn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 1</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Tìm Kiếm Thông Tin</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Google từ khóa: &ldquo;bảng size áo sơ mi nam chuẩn&rdquo;
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Bước 2</span>
                  <div className="font-bold text-xs text-amber-900 mt-1">Hạ Cánh Bài Viết Blog</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Đọc bảng số đo chiều cao/cân nặng tại <code>/blog/size-ao-so-mi-nam</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 3</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Link Nội Bộ Chuyển Tiếp</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Click CTA banner: &ldquo;Khám phá mẫu áo sơ mi nam may đo chuẩn form&rdquo;
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Bước 4: Chuyển Đổi</span>
                  <div className="font-bold text-xs text-emerald-900 mt-1">Đặt Hàng / Đo Ni Tận Nơi</div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    Trở thành khách hàng mua lẻ hoặc đặt may số lượng cho công ty
                  </div>
                </div>
              </div>
            </div>

            {/* Flow 4: Local SEO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Luồng 4: Local SEO & Khách Thăm Trực Tiếp Xưởng May
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khách hàng doanh nghiệp tại Phú Thọ, Hà Nội và các tỉnh lân cận tìm kiếm xưởng sản xuất uy tín.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 1</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Local Google Map / Search</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    &ldquo;Xưởng may đồng phục uy tín tại Phú Thọ / Hà Nội&rdquo;
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-black text-rose-700 uppercase">Bước 2</span>
                  <div className="font-bold text-xs text-rose-900 mt-1">Trang Liên Hệ & Showroom</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Xem địa chỉ trụ sở, ảnh xưởng 2.500m² tại <code>/lien-he</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bước 3</span>
                  <div className="font-bold text-xs text-slate-800 mt-1">Gọi Hotline / Đặt Lịch</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Gọi hotline 0984.959.586 hẹn khảo sát xưởng hoặc tư vấn tận nơi
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Bước 4: Ký Hợp Đồng</span>
                  <div className="font-bold text-xs text-emerald-900 mt-1">May Mẫu & Ký Hợp Đồng</div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    Duyệt mẫu vải tận tay và ký hợp đồng bảo hành chất lượng 30 ngày
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SƠ ĐỒ 4 & 6: SEO LINK EQUITY & INTERNAL LINKS      */}
        {/* ========================================================= */}
        {activeTab === "linkequity" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div>
              <span className="text-[10px] font-black tracking-widest text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                SƠ ĐỒ 4 & 6
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Dòng Chảy Sức Mạnh SEO (Link Equity) & Mật Độ Liên Kết
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Chiến lược truyền PageRank từ Trang Chủ và Content Hub về các trang danh mục bán hàng chiến lược.
              </p>
            </div>

            {/* Visual Equity Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-brand-500 text-white shadow-md">
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-200">NGUỒN DẪN CHÍNH</div>
                <div className="text-lg font-black mt-1">Trang Chủ [1.0]</div>
                <p className="text-xs text-brand-100 mt-2 leading-relaxed">
                  Nhận backlink tự nhiên cao nhất, phân bổ link juice trực tiếp đến 5 Hub thông qua Mega Menu Header & Footer.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600">TRỌNG TÂM DOANH THU</div>
                <div className="text-lg font-black text-slate-900 mt-1">Hub Sản Phẩm [0.95]</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Cụm Áo Sơ Mi & Áo Polo nhận nhiều link nội bộ nhất. Luôn xuất hiện trong breadcrumb của mọi trang con.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">INBOUND GENERATOR</div>
                <div className="text-lg font-black text-slate-900 mt-1">10 Bài Viết SEO [0.8]</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Hút search traffic từ các từ khóa hướng dẫn (size, mẫu đẹp, bảng giá). Chèn link ngữ cảnh (anchor text) về sản phẩm.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">VÒNG LẶP KHÉP KÍN</div>
                <div className="text-lg font-black text-emerald-950 mt-1">Contextual CTA Loop</div>
                <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                  Mỗi trang danh mục hiển thị 2 bài blog liên quan; mỗi bài blog đặt 1 banner CTA dẫn ngược lại danh mục tương ứng.
                </p>
              </div>
            </div>

            {/* Internal Link Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <th className="p-3">Loại Trang</th>
                    <th className="p-3">URL Đại Diện</th>
                    <th className="p-3">Nhận Link Từ</th>
                    <th className="p-3">Truyền Link Tới</th>
                    <th className="p-3">Mật Độ Link (Ước Tính)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Trang Chủ</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">/</td>
                    <td className="p-3">Logo tất cả các trang, Breadcrumb root</td>
                    <td className="p-3">5 Hubs, Bảng Vải, Quy Trình, Liên Hệ, Blog</td>
                    <td className="p-3 font-bold text-emerald-600">Cao nhất (&gt; 50 in-links)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Hub Doanh Nghiệp</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">/dong-phuc-doanh-nghiep</td>
                    <td className="p-3">Header Mega Menu, Footer, Trang Chủ, Blog</td>
                    <td className="p-3">Áo Polo, Sơ Mi, Áo Thun, Công Sở, Báo Giá</td>
                    <td className="p-3 font-bold text-emerald-600">Rất cao (&gt; 40 in-links)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Cụm Áo Sơ Mi (SEO Star)</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">.../ao-so-mi</td>
                    <td className="p-3">Hub Doanh nghiệp, 5 bài Blog về sơ mi, Bảng Vải</td>
                    <td className="p-3">Tay ngắn, Tay dài, Seamless, Báo giá</td>
                    <td className="p-3 font-bold text-emerald-600">Đặc biệt tập trung (&gt; 35 in-links)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Bài Viết Blog Hướng Dẫn</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">/blog/[slug]</td>
                    <td className="p-3">Blog index, Footer, Widget danh mục liên quan</td>
                    <td className="p-3">Trang sản phẩm mục tiêu (In-content CTA)</td>
                    <td className="p-3 font-bold text-sky-600">Trung bình (10 - 15 in-links)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Chính Sách & Điều Khoản</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">/chinh-sach-...</td>
                    <td className="p-3">Footer tất cả các trang</td>
                    <td className="p-3">Liên Hệ</td>
                    <td className="p-3 font-bold text-slate-500">Thấp (Footer only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SƠ ĐỒ 5: MA TRẬN TỪ KHÓA CHIẾN LƯỢC                */}
        {/* ========================================================= */}
        {activeTab === "keywords" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div>
              <span className="text-[10px] font-black tracking-widest text-brand-600 uppercase bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                SƠ ĐỒ 5
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Ma Trận Phân Bổ Từ Khóa Theo Từng Cụm URL
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Phân bổ từ khóa chính xác giúp ngăn ngừa hiện tượng ăn thịt từ khóa (Keyword Cannibalization) giữa các trang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keywordMatrix.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-xs text-brand-700 uppercase tracking-wider">
                      {item.group}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white">
                      Priority {item.priority.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="text-[11px] font-bold text-slate-700">Từ khóa chính:</div>
                      <div className="text-xs font-extrabold text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 mt-0.5">
                        {item.mainKeywords}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-700">Từ khóa phụ & Long-tail:</div>
                      <div className="text-xs text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 mt-0.5">
                        {item.subKeywords}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <code className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                        {item.targetUrl}
                      </code>
                      <Link
                        href={item.targetUrl}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                      >
                        <span>Mở URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
