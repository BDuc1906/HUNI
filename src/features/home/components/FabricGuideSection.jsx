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
// - image = ảnh VẢI (icon to, hình tròn)
// - iconImage = ảnh NGUYÊN LIỆU (cây, lá, hoa — icon nhỏ overlay)
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

export default function FabricGuideSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section id="fabric-guide-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-brand-600" />
            Cẩm Nang Chất Liệu Vải
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            BẢNG SO SÁNH CHẤT LIỆU VẢI CAO CẤP HDC
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            HDC sử dụng 100% nguồn vải nhập khẩu chính ngạch, dệt công nghệ kháng khuẩn,
            thoáng mát và chống co rút sau 100 lần giặt.
          </p>
        </div>

        {/* ================================================
            NGUYÊN LIỆU + ĐẶC TÍNH (gộp 1 khối, giống ảnh mẫu)
            ================================================ */}
        <div className="mb-14 max-w-5xl mx-auto">
          {/* Hàng 1: 5 hình tròn vải + icon nguyên liệu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 justify-items-center">
            {NATURAL_MATERIALS.map((mat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="w-full h-full object-cover"
                      style={{ transform: "scale(1.6)", transformOrigin: "center top" }}
                    />
                  </div>
                  {/* Icon nguyên liệu: tâm đặt theo % của hình tròn, size riêng từng icon */}
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
                <h4 className="mt-4 text-base sm:text-lg font-medium text-slate-800 leading-tight">
                  {mat.name}
                </h4>
              </div>
            ))}
          </div>

          {/* Đường kẻ ngăn cách màu xanh ngọc */}
          <div className="my-9 h-px w-full bg-brand-600" />

          {/* Hàng 2: 5 đặc tính — icon line-art xanh ngọc, không khung thẻ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 justify-items-center">
            {GREEN_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`relative w-14 h-14 flex items-center justify-center text-brand-600 ${
                      item.ring ? "rounded-full border-2 border-brand-600" : ""
                    }`}
                  >
                    <Icon className="w-8 h-8" strokeWidth={1.25} />
                    {item.crossed && (
                      <span className="absolute w-12 h-[1.5px] bg-brand-600 rotate-[-35deg]" />
                    )}
                  </div>
                  <p className="mt-4 text-sm sm:text-base font-medium text-slate-800 leading-snug">
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
            FABRIC COMPARISON TABLE
            ================================================ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#004f5e] text-white uppercase text-xs font-extrabold tracking-wider border-b border-brand-500/30">
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
                  <tr key={idx} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#004f5e] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span>{fabric.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-xs">{fabric.features}</td>
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

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-brand-50 via-brand-100/60 to-brand-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-300/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#004f5e] text-sm sm:text-base">
                  Quý Doanh Nghiệp Cần Xem Trực Tiếp Bảng Vải Thật?
                </h4>
                <p className="text-xs text-slate-600">
                  HDC sẽ chuyển phát hỏa tốc tập catalog vải mẫu miễn phí đến tận tay quý công ty.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
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
