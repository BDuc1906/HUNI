"use client";

import React, { useEffect, useState } from "react";
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
  LayoutGrid,
  TableProperties,
  CheckCircle2,
  MoveHorizontal,
  ShieldCheck,
  Star,
} from "lucide-react";

// ==================================================
// CutoutIcon — tự xóa nền TRẮNG của ảnh icon (jpg/png nền trắng)
// Flood-fill từ mép ảnh nên phần trắng bên trong hình vẽ được giữ nguyên.
// ==================================================
function CutoutIcon({ src, className = "" }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      let frame;
      try {
        frame = ctx.getImageData(0, 0, W, H);
      } catch {
        if (!cancelled) setUrl(src); // fallback: dùng ảnh gốc
        return;
      }
      const d = frame.data;
      const TH = 232; // >= ngưỡng này coi là nền trắng
      const isBg = (p) =>
        d[p * 4 + 3] < 10 || (d[p * 4] >= TH && d[p * 4 + 1] >= TH && d[p * 4 + 2] >= TH);

      const bg = new Uint8Array(W * H);
      const stack = [];
      const push = (p) => {
        if (!bg[p] && isBg(p)) {
          bg[p] = 1;
          stack.push(p);
        }
      };
      for (let x = 0; x < W; x++) {
        push(x);
        push((H - 1) * W + x);
      }
      for (let y = 0; y < H; y++) {
        push(y * W);
        push(y * W + W - 1);
      }
      while (stack.length) {
        const p = stack.pop();
        const x = p % W;
        if (x > 0) push(p - 1);
        if (x < W - 1) push(p + 1);
        if (p >= W) push(p - W);
        if (p < W * (H - 1)) push(p + W);
      }

      for (let p = 0; p < W * H; p++) {
        if (bg[p]) {
          d[p * 4 + 3] = 0;
          continue;
        }
        // làm mờ viền sáng sát nền để không còn quầng trắng
        const x = p % W;
        const near =
          (x > 0 && bg[p - 1]) ||
          (x < W - 1 && bg[p + 1]) ||
          (p >= W && bg[p - W]) ||
          (p < W * (H - 1) && bg[p + W]);
        if (near) {
          const m = Math.min(d[p * 4], d[p * 4 + 1], d[p * 4 + 2]);
          if (m > 190) {
            d[p * 4 + 3] = Math.max(0, Math.min(255, ((TH - m) / (TH - 190)) * 255));
          }
        }
      }
      ctx.putImageData(frame, 0, 0);
      if (!cancelled) setUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      if (!cancelled) setUrl(src);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!url) return null; // chưa xử lý xong → không hiện khung trắng
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={className} />;
}

// ==================================================
// 5 NGUYÊN LIỆU TỰ NHIÊN
// ==================================================
const NATURAL_MATERIALS = [
  {
    name: "Modal",
    image: "/images/02_materials_02.jpg",
    iconImage: "/images/modal_tree_icon.png",
    iconPos: { x: 95, y: 80, size: 40 },
  },
  {
    name: "Bamboo",
    image: "/images/02_materials_03.jpg",
    iconImage: "/images/02_materials_04.jpg",
    iconPos: { x: 84, y: 78, size: 32 },
  },
  {
    name: "Sợi Bạc Hà",
    image: "/images/02_materials_05.jpg",
    iconImage: "/images/02_materials_06.jpg",
    iconPos: { x: 78, y: 104, size: 106 },
  },
  {
    name: "Sợi Sen",
    image: "/images/02_materials_07.jpg",
    iconImage: "/images/02_materials_08.jpg",
    iconPos: { x: 82, y: 102, size: 73 },
  },
  {
    name: "Sợi Chuối",
    image: "/images/02_materials_09.jpg",
    iconImage: "/images/banana_leaf_icon.png",
    iconPos: { x: 82, y: 78, size: 49, flip: true },
  },
];

// ==================================================
// 5 ĐẶC TÍNH CHẤT LIỆU XANH
// ==================================================
const GREEN_FEATURES = [
  { icon: HandHeart, lines: ["Siêu mềm", "mượt"], ring: false },
  { icon: Layers, lines: ["Bền đẹp, giữ", "màu cực tốt"], ring: true },
  { icon: Waves, lines: ["Kháng khuẩn,", "thoáng khí"], ring: true },
  { icon: Shirt, lines: ["Không cần", "là ủi"], ring: false, crossed: true },
  { icon: Recycle, lines: ["Thân thiện", "môi trường"], ring: true },
];

const CATEGORIES = [
  { id: "all", label: "Tất cả chất liệu" },
  { id: "Nhập khẩu cao cấp", label: "Vải nhập khẩu" },
  { id: "Chất liệu xanh", label: "Chất liệu xanh" },
  { id: "Công nghệ Seamless", label: "Seamless không may" },
];

export default function FabricGuideSection() {
  const { setIsQuickQuoteOpen } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("auto"); // "auto" (card on mobile, table on desktop), "card", "table"

  const filteredFabrics = FABRIC_COMPARISONS.filter((fabric) => {
    if (selectedCategory === "all") return true;
    return fabric.category === selectedCategory;
  });

  return (
    <section id="fabric-guide-section" className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-brand-600" />
            Cẩm Nang Chất Liệu Vải
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] tracking-tight">
            BẢNG SO SÁNH CHẤT LIỆU VẢI CAO CẤP HDC
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            HDC sử dụng 100% nguồn vải nhập khẩu chính ngạch, dệt công nghệ kháng khuẩn,
            thoáng mát và chống co rút sau 100 lần giặt.
          </p>
        </div>

        {/* ================================================
            NGUYÊN LIỆU + ĐẶC TÍNH (Căn đối hoàn hảo trên mọi kích thước)
            ================================================ */}
        <div className="mb-12 sm:mb-14 max-w-5xl mx-auto">
          {/* Hàng 1: 5 hình tròn vải + icon nguyên liệu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 justify-items-center">
            {NATURAL_MATERIALS.map((mat, idx) => {
              const isLastOdd = idx === NATURAL_MATERIALS.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center ${
                    isLastOdd ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shadow-sm rounded-full">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mat.image}
                        alt={mat.name}
                        className="w-full h-full object-cover"
                        style={{ transform: "scale(1.6)", transformOrigin: "center top" }}
                      />
                    </div>
                    {/* Icon nguyên liệu */}
                    <div
                      className="absolute z-10 pointer-events-none"
                      style={{
                        left: `${mat.iconPos.x}%`,
                        top: `${mat.iconPos.y}%`,
                        width: `${mat.iconPos.size}%`,
                        aspectRatio: "1 / 1",
                        transform: `translate(-50%, -50%)${mat.iconPos.flip ? " scaleX(-1)" : ""}`,
                      }}
                    >
                      <CutoutIcon src={mat.iconImage} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <h4 className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-tight">
                    {mat.name}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Đường kẻ ngăn cách màu xanh ngọc */}
          <div className="my-7 sm:my-9 h-px w-full bg-brand-300/60" />

          {/* Hàng 2: 5 đặc tính — icon line-art xanh ngọc */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8 justify-items-center">
            {GREEN_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              const isLastOdd = idx === GREEN_FEATURES.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center ${
                    isLastOdd ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-brand-600 bg-brand-50/50 ${
                      item.ring ? "rounded-full border-2 border-brand-500" : ""
                    }`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                    {item.crossed && (
                      <span className="absolute w-11 h-[2px] bg-brand-600 rotate-[-35deg]" />
                    )}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm md:text-base font-medium text-slate-800 leading-snug">
                    {item.lines[0]}
                    <br />
                    {item.lines[1]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================
            CONTROLS: TABS BỘ LỌC + VIEW TOGGLE CHO MOBILE
            ================================================ */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto max-w-full w-full md:w-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-white text-[#004f5e] shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle View Mode (Dành cho Mobile / Tablet) */}
          <div className="flex items-center justify-end w-full md:w-auto gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Chế độ xem:</span>
            <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl">
              <button
                onClick={() => setViewMode("card")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "card" || (viewMode === "auto" && true)
                    ? "bg-white text-[#004f5e] shadow-sm font-bold md:bg-transparent md:text-slate-600 md:shadow-none"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Xem dạng thẻ"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="md:hidden">Thẻ</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#004f5e] shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Xem dạng bảng"
              >
                <TableProperties className="w-4 h-4" />
                <span className="md:hidden">Bảng</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================
            PHẦN 1: RESPONSIVE CARDS (MẶC ĐỊNH TRÊN MOBILE HOẶC KHI CHỌN CARD VIEW)
            Không bao giờ tràn viền, cực dễ đọc trên điện thoại
            ================================================ */}
        <div
          className={`${
            viewMode === "table"
              ? "hidden"
              : viewMode === "card"
              ? "block"
              : "block lg:hidden"
          } space-y-4`}
        >
          {filteredFabrics.map((fabric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />

              {/* Header card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-[#004f5e] text-base sm:text-lg">
                      {fabric.name}
                    </h3>
                    {fabric.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        {fabric.badge}
                      </span>
                    )}
                  </div>
                  {fabric.category && (
                    <span className="text-[11px] font-medium text-slate-500">
                      {fabric.category}
                    </span>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{fabric.breathability}</span>
                </div>
              </div>

              {/* Đặc tính nổi bật */}
              <div className="bg-slate-50/80 rounded-xl p-3 mb-3 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Đặc tính nổi bật:</span>
                {fabric.features}
              </div>

              {/* Grid 2 cột thông tin chi tiết */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60">
                  <Shirt className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phù hợp cho:</span>
                    <span className="font-semibold text-slate-800">{fabric.usage}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Độ co rút:</span>
                    <span className="font-semibold text-brand-700">{fabric.shrinkage}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================
            PHẦN 2: TABLE VIEW (STICKY CỘT ĐẦU + MIN-WIDTH CHUẨN + CHỈ DẪN CUỘN)
            Dành cho Desktop hoặc người dùng bật xem dạng bảng
            ================================================ */}
        <div
          className={`${
            viewMode === "card"
              ? "hidden"
              : viewMode === "table"
              ? "block"
              : "hidden lg:block"
          } bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden`}
        >
          {/* Scroll Hint cho màn hình nhỏ khi xem chế độ Table */}
          <div className="lg:hidden bg-brand-50/80 px-4 py-2 text-xs font-semibold text-brand-800 flex items-center justify-between border-b border-brand-200/50">
            <span className="flex items-center gap-1.5">
              <MoveHorizontal className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>Vuốt ngang bảng để xem đầy đủ các cột</span>
            </span>
            <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-full border border-brand-200">
              Cột tên vải được cố định
            </span>
          </div>

          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full text-left text-xs sm:text-sm min-w-[760px] border-collapse">
              <thead className="bg-[#004f5e] text-white uppercase text-xs font-extrabold tracking-wider border-b border-brand-500/30">
                <tr>
                  <th className="py-4 px-5 sticky left-0 z-30 bg-[#004f5e] shadow-[3px_0_6px_rgba(0,0,0,0.15)] min-w-[200px]">
                    Loại Vải Tiêu Biểu
                  </th>
                  <th className="py-4 px-5 min-w-[260px]">Đặc Tính Nổi Bật</th>
                  <th className="py-4 px-5 min-w-[190px]">Phù Hợp Cho</th>
                  <th className="py-4 px-5 min-w-[150px]">Độ Co Rút</th>
                  <th className="py-4 px-5 text-center min-w-[120px]">Độ Thoáng Khí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredFabrics.map((fabric, idx) => (
                  <tr key={idx} className="hover:bg-brand-50/40 transition-colors group">
                    {/* Cột 1 STICKY để khi vuốt ngang tên vải luôn đứng yên */}
                    <td className="py-4 px-5 font-bold text-[#004f5e] sticky left-0 z-20 bg-white group-hover:bg-brand-50 transition-colors shadow-[3px_0_6px_rgba(0,0,0,0.06)]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                          <span className="whitespace-normal leading-tight font-extrabold">{fabric.name}</span>
                        </div>
                        {fabric.badge && (
                          <span className="text-[10px] text-brand-600 font-semibold pl-4">
                            • {fabric.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 leading-relaxed text-slate-700">{fabric.features}</td>
                    <td className="py-4 px-5 font-semibold text-slate-800">{fabric.usage}</td>
                    <td className="py-4 px-5 text-brand-700 font-semibold">{fabric.shrinkage}</td>
                    <td className="py-4 px-5 text-center text-brand-500 font-bold whitespace-nowrap">
                      {fabric.breathability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================
            BOTTOM CTA: NHẬN BẢNG VẢI 0Đ
            ================================================ */}
        <div className="mt-6 bg-gradient-to-r from-brand-50 via-brand-100/60 to-brand-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-300/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#004f5e] text-sm sm:text-base leading-snug">
                Quý Doanh Nghiệp Cần Xem Trực Tiếp Bảng Vải Thật?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                HDC chuyển phát hỏa tốc tập catalog vải mẫu miễn phí đến tận tay quý công ty.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Đăng Ký Nhận Bảng Vải 0đ</span>
          </button>
        </div>
      </div>
    </section>
  );
}

