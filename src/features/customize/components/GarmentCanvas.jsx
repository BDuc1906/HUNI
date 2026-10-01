"use client";

import React from "react";
import Image from "next/image";

/**
 * GarmentCanvas
 * Render vector SVG mockup cho các loại áo đồng phục với phối màu thực tế,
 * hiệu ứng bóng đổ, nếp gấp vải 3D và các vị trí logo chuẩn xác.
 */

// Định nghĩa toạ độ các vị trí logo trên mockup (tỷ lệ %)
export const LOGO_POSITIONS = {
  // Mặt trước
  chest_left: {
    id: "chest_left",
    name: "Ngực Trái (Khuyên dùng)",
    shortName: "Ngực Trái",
    view: "front",
    coords: { top: "33%", left: "33%" },
    realSize: "8 - 10 cm",
  },
  chest_right: {
    id: "chest_right",
    name: "Ngực Phải",
    shortName: "Ngực Phải",
    view: "front",
    coords: { top: "33%", left: "67%" },
    realSize: "8 - 10 cm",
  },
  chest_center: {
    id: "chest_center",
    name: "Giữa Ngực (Khổ lớn)",
    shortName: "Giữa Ngực",
    view: "front",
    coords: { top: "38%", left: "50%" },
    realSize: "22 - 28 cm",
  },
  sleeve_left: {
    id: "sleeve_left",
    name: "Tay Áo Trái",
    shortName: "Tay Trái",
    view: "front",
    coords: { top: "38%", left: "15%" },
    realSize: "6 - 8 cm",
  },
  sleeve_right: {
    id: "sleeve_right",
    name: "Tay Áo Phải",
    shortName: "Tay Phải",
    view: "front",
    coords: { top: "38%", left: "85%" },
    realSize: "6 - 8 cm",
  },
  // Mặt sau
  back_center: {
    id: "back_center",
    name: "Sau Lưng (Khổ lớn thương hiệu)",
    shortName: "Sau Lưng",
    view: "back",
    coords: { top: "42%", left: "50%" },
    realSize: "25 - 32 cm",
  },
  back_nape: {
    id: "back_nape",
    name: "Gáy Cổ Sau",
    shortName: "Gáy Cổ",
    view: "back",
    coords: { top: "18%", left: "50%" },
    realSize: "5 - 7 cm",
  },
};

export default function GarmentCanvas({
  garmentType = "polo", // "polo" | "shirt" | "tshirt" | "golf" | "jacket"
  view = "front", // "front" | "back"
  colorHex = "#004f5e",
  collarHex = null, // null = same as colorHex
  collarStyle = "plain", // "plain" | "striped" | "contrast"
  cuffStyle = "plain", // "plain" | "contrast"
  logoImage = null,
  logoText = "",
  logoFont = "font-sans",
  logoTextColor = "#ffffff",
  logoPosition = "chest_left",
  logoScale = 100, // %
  methodName = "Thêu Vi Tính Tajima",
  onSelectPosition,
}) {
  const currentPosConfig = LOGO_POSITIONS[logoPosition] || LOGO_POSITIONS.chest_left;
  const isLogoVisibleOnCurrentView = currentPosConfig.view === view;

  // Màu cổ áo & viền bo tay
  const effectiveCollarHex =
    collarStyle === "contrast"
      ? collarHex || "#0A2540"
      : colorHex;

  // Tính độ sáng của màu áo để chỉnh highlight/shadow phù hợp
  const isLightGarment = checkIsLightColor(colorHex);

  return (
    <div className="relative w-full aspect-[4/5] max-w-[440px] mx-auto bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 flex items-center justify-center overflow-hidden select-none">
      {/* Background Grid Pattern & Brand Watermark */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 backdrop-blur-md text-brand-300 border border-white/10">
          {view === "front" ? "Mặt Trước" : "Mặt Sau"}
        </span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-medium bg-black/40 text-slate-400">
          Tỷ lệ xưởng 1:1
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
            style={{ backgroundColor: colorHex }}
          />
          <span className="font-mono uppercase font-semibold">{colorHex}</span>
        </div>
      </div>

      {/* SVG Garment Illustration */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 500 560"
          className="w-full h-full max-h-[480px] drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transition-all duration-300"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Soft 3D Lighting Gradients */}
            <linearGradient id="bodyLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity={isLightGarment ? "0.15" : "0.08"} />
              <stop offset="65%" stopColor="#ffffff" stopOpacity={isLightGarment ? "0.15" : "0.08"} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="sleeveLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="sleeveRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="collarRib" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            {/* Pattern kẻ sọc cho bo dệt vi tính */}
            <pattern id="collarStripes" width="20" height="20" patternUnits="userSpaceOnUse">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="0" y1="10" x2="20" y2="10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5" />
            </pattern>
          </defs>

          {/* ====================================================
              RENDER TỪNG LOẠI TRANG PHỤC (POLO, SHIRT, TSHIRT, GOLF, JACKET)
              ==================================================== */}
          {garmentType === "shirt" ? (
            <ShirtGarmentPath
              view={view}
              colorHex={colorHex}
              collarHex={effectiveCollarHex}
              isLight={isLightGarment}
            />
          ) : garmentType === "tshirt" ? (
            <TShirtGarmentPath
              view={view}
              colorHex={colorHex}
              collarHex={effectiveCollarHex}
              isLight={isLightGarment}
            />
          ) : garmentType === "golf" ? (
            <GolfGarmentPath
              view={view}
              colorHex={colorHex}
              collarHex={effectiveCollarHex}
              isLight={isLightGarment}
            />
          ) : garmentType === "jacket" ? (
            <JacketGarmentPath
              view={view}
              colorHex={colorHex}
              collarHex={effectiveCollarHex}
              isLight={isLightGarment}
            />
          ) : (
            // Default: POLO SHIRT
            <PoloGarmentPath
              view={view}
              colorHex={colorHex}
              collarHex={effectiveCollarHex}
              collarStyle={collarStyle}
              cuffStyle={cuffStyle}
              isLight={isLightGarment}
            />
          )}
        </svg>

        {/* ====================================================
            LOGO / ARTWORK OVERLAY TRÊN MOCKUP
            ==================================================== */}
        {isLogoVisibleOnCurrentView && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-auto group z-20"
            style={{
              top: currentPosConfig.coords.top,
              left: currentPosConfig.coords.left,
            }}
          >
            {/* Khung viền vùng in/thêu tiêu chuẩn */}
            <div
              className="relative rounded-lg border-2 border-dashed border-brand-400/80 bg-black/35 backdrop-blur-[2px] p-2 flex flex-col items-center justify-center transition-transform hover:scale-105"
              style={{
                transform: `scale(${logoScale / 100})`,
                transformOrigin: "center center",
                minWidth: "60px",
                minHeight: "44px",
              }}
            >
              {/* Badge tên vị trí */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-brand-500 text-slate-950 font-black px-1.5 py-0.2 rounded shadow whitespace-nowrap">
                {currentPosConfig.shortName}
              </span>

              {/* Nội dung Logo (Hình ảnh hoặc Text thương hiệu) */}
              {logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoImage}
                  alt="Custom Logo"
                  className="max-h-12 max-w-[110px] object-contain drop-shadow-md select-none"
                  draggable={false}
                />
              ) : (
                <div
                  className={`text-center font-bold tracking-wider leading-tight drop-shadow-md px-1 select-none ${logoFont}`}
                  style={{
                    color: logoTextColor,
                    fontSize:
                      logoPosition === "back_center"
                        ? "16px"
                        : logoPosition === "chest_center"
                        ? "14px"
                        : "11px",
                  }}
                >
                  {logoText || "HDC FASHION"}
                </div>
              )}

              {/* Tag công nghệ */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] bg-slate-900/90 text-brand-300 border border-brand-400/40 px-1 py-0.2 rounded font-semibold whitespace-nowrap">
                {methodName.split(" ")[0]}
              </span>
            </div>
          </div>
        )}

        {/* ====================================================
            PINPOINT POSITION CLICKERS (Các chấm tròn chọn nhanh vị trí)
            ==================================================== */}
        {Object.values(LOGO_POSITIONS)
          .filter((p) => p.view === view)
          .map((p) => {
            const isSelected = p.id === logoPosition;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPosition && onSelectPosition(p.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all z-10 ${
                  isSelected
                    ? "opacity-0 pointer-events-none" // Ẩn nút tròn khi logo đang ở vị trí này
                    : "bg-white/20 hover:bg-brand-400 text-white hover:text-black border border-white/60 hover:border-brand-300 shadow-lg scale-90 hover:scale-110 active:scale-95"
                }`}
                style={{ top: p.coords.top, left: p.coords.left }}
                title={`Đặt logo ở: ${p.name}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </button>
            );
          })}
      </div>

      {/* Footer Info of Canvas */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Kích thước in/thêu chuẩn:{" "}
          <strong className="text-white">{currentPosConfig.realSize}</strong>
        </span>
        <span className="text-brand-300 font-semibold">{methodName}</span>
      </div>
    </div>
  );
}

// ====================================================
// SVG PATH COMPONENTS CHO TỪNG LOẠI ÁO
// ====================================================

/**
 * 1. POLO SHIRT (ÁO POLO DOANH NGHIỆP)
 */
function PoloGarmentPath({
  view,
  colorHex,
  collarHex,
  collarStyle,
  cuffStyle,
  isLight,
}) {
  const isFront = view === "front";

  return (
    <g>
      {/* 1. Thân áo và tay áo chính */}
      <path
        d="M 175,80 L 120,110 L 40,210 L 85,250 L 140,195 L 140,510 C 140,520 150,525 160,525 L 340,525 C 350,525 360,520 360,510 L 360,195 L 415,250 L 460,210 L 380,110 L 325,80 Z"
        fill={colorHex}
        stroke="#000000"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Lớp ánh sáng & khối 3D cho thân áo */}
      <path
        d="M 140,195 L 140,510 L 360,510 L 360,195 Z"
        fill="url(#bodyLight)"
      />

      {/* Bóng đổ tay áo trái và phải */}
      <path
        d="M 175,80 L 120,110 L 40,210 L 85,250 L 140,195 Z"
        fill="url(#sleeveLeftGrad)"
      />
      <path
        d="M 325,80 L 380,110 L 460,210 L 415,250 L 360,195 Z"
        fill="url(#sleeveRightGrad)"
      />

      {/* Nếp gấp vải tự nhiên (Fabric Creases) */}
      <g stroke={isLight ? "#000000" : "#ffffff"} strokeOpacity="0.08" strokeWidth="1.5" fill="none">
        <path d="M 160,230 Q 180,260 170,300" />
        <path d="M 340,230 Q 320,260 330,300" />
        <path d="M 155,420 Q 175,445 165,475" />
        <path d="M 345,420 Q 325,445 335,475" />
      </g>

      {/* Bo gấu tay áo (Cuffs) */}
      <path
        d="M 40,210 L 85,250 L 78,258 L 33,218 Z"
        fill={cuffStyle === "contrast" ? collarHex : colorHex}
        stroke="#000000"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <path
        d="M 460,210 L 415,250 L 422,258 L 467,218 Z"
        fill={cuffStyle === "contrast" ? collarHex : colorHex}
        stroke="#000000"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* Đường xẻ tà 2 bên hông (Side Vents) */}
      <path d="M 140,490 L 140,525" stroke="#000000" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M 360,490 L 360,525" stroke="#000000" strokeOpacity="0.4" strokeWidth="2" />

      {/* =======================
          MẶT TRƯỚC: TRỤ ÁO & CỔ BẺ
          ======================= */}
      {isFront ? (
        <>
          {/* Trụ áo polo (Placket) */}
          <rect
            x="235"
            y="95"
            width="30"
            height="115"
            rx="2"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Cúc áo (Buttons) */}
          <circle cx="250" cy="115" r="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
          <circle cx="250" cy="150" r="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
          <circle cx="250" cy="185" r="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />

          {/* Cổ bẻ Polo Trái */}
          <path
            d="M 235,95 L 180,80 C 175,100 190,140 235,130 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Cổ bẻ Polo Phải */}
          <path
            d="M 265,95 L 320,80 C 325,100 310,140 265,130 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Sọc kẻ nếu chọn bo dệt vi tính */}
          {collarStyle === "striped" && (
            <>
              <path
                d="M 195,95 C 190,110 205,130 230,123"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 305,95 C 310,110 295,130 270,123"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Đường may chân cổ */}
          <path
            d="M 180,80 C 220,105 280,105 320,80"
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      ) : (
        /* =======================
           MẶT SAU: GÁY CỔ SAU
           ======================= */
        <>
          {/* Bo sau gáy */}
          <path
            d="M 180,80 C 220,95 280,95 320,80 L 325,92 C 280,110 220,110 175,92 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Đường viền may gia cố đô sau */}
          <path
            d="M 155,140 C 230,150 270,150 345,140"
            stroke={isLight ? "#000000" : "#ffffff"}
            strokeOpacity="0.15"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />
        </>
      )}
    </g>
  );
}

/**
 * 2. DRESS SHIRT (ÁO SƠ MI CÔNG SỞ)
 */
function ShirtGarmentPath({ view, colorHex, collarHex, isLight }) {
  const isFront = view === "front";

  return (
    <g>
      {/* Thân áo sơ mi */}
      <path
        d="M 185,70 L 130,100 L 50,210 L 95,245 L 145,190 L 145,515 C 145,525 210,535 250,535 C 290,535 355,525 355,515 L 355,190 L 405,245 L 450,210 L 370,100 L 315,70 Z"
        fill={colorHex}
        stroke="#000000"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M 145,190 L 145,515 C 145,525 210,535 250,535 C 290,535 355,525 355,515 L 355,190 Z"
        fill="url(#bodyLight)"
      />

      {isFront ? (
        <>
          {/* Nẹp cúc áo sơ mi chạy dọc thân */}
          <rect
            x="241"
            y="90"
            width="18"
            height="440"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          {[120, 175, 230, 285, 340, 395, 450].map((cy, idx) => (
            <circle
              key={idx}
              cx="250"
              cy={cy}
              r="3.5"
              fill="#f1f5f9"
              stroke="#64748b"
              strokeWidth="0.8"
            />
          ))}

          {/* Túi ngực áo sơ mi bên trái */}
          <path
            d="M 175,190 L 215,190 L 215,235 L 195,250 L 175,235 Z"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* Cổ sơ mi vát nhọn cứng cáp */}
          <path
            d="M 235,90 L 180,70 L 190,125 L 243,105 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <path
            d="M 265,90 L 320,70 L 310,125 L 257,105 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        </>
      ) : (
        <>
          {/* Cổ áo sau & đường cầu vai (Yoke) */}
          <path
            d="M 180,70 C 220,85 280,85 320,70 L 322,82 C 280,95 220,95 178,82 Z"
            fill={collarHex}
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <path
            d="M 148,150 L 352,150"
            stroke={isLight ? "#000000" : "#ffffff"}
            strokeOpacity="0.2"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Nẹp ly sau lưng */}
          <path
            d="M 250,150 L 250,220"
            stroke={isLight ? "#000000" : "#ffffff"}
            strokeOpacity="0.15"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
    </g>
  );
}

/**
 * 3. T-SHIRT (ÁO THUN CỔ TRÒN)
 */
function TShirtGarmentPath({ view, colorHex, collarHex, isLight }) {
  const isFront = view === "front";

  return (
    <g>
      {/* Thân áo thun phom suông hiện đại */}
      <path
        d="M 170,90 L 115,120 L 35,215 L 80,255 L 135,200 L 135,510 C 135,520 145,525 155,525 L 345,525 C 355,525 365,520 365,510 L 365,200 L 420,255 L 465,215 L 385,120 L 330,90 Z"
        fill={colorHex}
        stroke="#000000"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      <path
        d="M 135,200 L 135,510 L 365,510 L 365,200 Z"
        fill="url(#bodyLight)"
      />

      {/* Cổ tròn bo dệt */}
      {isFront ? (
        <path
          d="M 195,90 C 215,130 285,130 305,90 C 290,115 210,115 195,90 Z"
          fill={collarHex}
          stroke="#000000"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      ) : (
        <path
          d="M 195,90 C 220,105 280,105 305,90 C 290,98 210,98 195,90 Z"
          fill={collarHex}
          stroke="#000000"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      )}

      {/* Đường chỉ may gấu áo và tay áo kép */}
      <path
        d="M 135,515 L 365,515"
        stroke={isLight ? "#000000" : "#ffffff"}
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
    </g>
  );
}

/**
 * 4. SPORT / GOLF POLO (ĐỒNG PHỤC GOLF & PICKLEBALL)
 */
function GolfGarmentPath({ view, colorHex, collarHex, isLight }) {
  const isFront = view === "front";

  return (
    <g>
      {/* Phom Polo thể thao tay Raglan năng động */}
      <path
        d="M 175,80 L 120,110 L 40,210 L 85,250 L 140,195 L 140,510 C 140,520 150,525 160,525 L 340,525 C 350,525 360,520 360,510 L 360,195 L 415,250 L 460,210 L 380,110 L 325,80 Z"
        fill={colorHex}
        stroke="#000000"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M 140,195 L 140,510 L 360,510 L 360,195 Z"
        fill="url(#bodyLight)"
      />

      {/* Đường phối Raglan thể thao chạy từ cổ xuống nách */}
      <path
        d="M 195,85 L 140,195"
        stroke={isLight ? "#000000" : "#ffffff"}
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M 305,85 L 360,195"
        stroke={isLight ? "#000000" : "#ffffff"}
        strokeOpacity="0.3"
        strokeWidth="2"
      />

      {/* Sườn phối lưới thoáng khí 2 bên eo */}
      <path
        d="M 140,250 C 150,350 150,450 140,510 L 155,510 C 165,450 165,350 155,250 Z"
        fill="#000000"
        fillOpacity="0.2"
      />
      <path
        d="M 360,250 C 350,350 350,450 360,510 L 345,510 C 335,450 335,350 345,250 Z"
        fill="#000000"
        fillOpacity="0.2"
      />

      {isFront ? (
        <>
          {/* Cổ bẻ Polo thể thao ép seam */}
          <rect x="238" y="95" width="24" height="110" rx="3" fill={collarHex} />
          <circle cx="250" cy="120" r="3.5" fill="#f8fafc" />
          <circle cx="250" cy="160" r="3.5" fill="#f8fafc" />
          <path
            d="M 238,95 L 180,80 C 180,105 195,135 238,125 Z"
            fill={collarHex}
          />
          <path
            d="M 262,95 L 320,80 C 320,105 305,135 262,125 Z"
            fill={collarHex}
          />
        </>
      ) : (
        <path
          d="M 180,80 C 220,95 280,95 320,80 L 325,92 C 280,110 220,110 175,92 Z"
          fill={collarHex}
        />
      )}
    </g>
  );
}

/**
 * 5. WINDBREAKER JACKET (ÁO KHOÁC GIÓ DOANH NGHIỆP)
 */
function JacketGarmentPath({ view, colorHex, collarHex, isLight }) {
  const isFront = view === "front";

  return (
    <g>
      {/* Phom áo khoác gió đứng dáng */}
      <path
        d="M 175,85 L 115,115 L 30,225 L 75,265 L 130,205 L 130,520 C 130,530 140,535 150,535 L 350,535 C 360,535 370,530 370,520 L 370,205 L 425,265 L 470,225 L 385,115 L 325,85 Z"
        fill={colorHex}
        stroke="#000000"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M 130,205 L 130,520 L 370,520 L 370,205 Z"
        fill="url(#bodyLight)"
      />

      {/* Cổ trụ đứng (Stand-up Collar) */}
      <path
        d="M 190,65 L 310,65 L 315,95 C 280,105 220,105 185,95 Z"
        fill={collarHex}
        stroke="#000000"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {isFront ? (
        <>
          {/* Khóa kéo kim loại chính giữa */}
          <line
            x1="250"
            y1="65"
            x2="250"
            y2="535"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />
          {/* Đầu khóa kéo */}
          <rect x="247" y="100" width="6" height="14" rx="2" fill="#334155" />

          {/* Túi khóa chéo 2 bên hông */}
          <line x1="165" y1="360" x2="205" y2="420" stroke="#000000" strokeOpacity="0.4" strokeWidth="3" />
          <line x1="335" y1="360" x2="295" y2="420" stroke="#000000" strokeOpacity="0.4" strokeWidth="3" />
        </>
      ) : (
        /* Đường rã đô sau lưng thoáng khí */
        <path
          d="M 135,180 L 365,180"
          stroke={isLight ? "#000000" : "#ffffff"}
          strokeOpacity="0.25"
          strokeWidth="2"
        />
      )}
    </g>
  );
}

/**
 * Helper kiểm tra màu sáng để chỉnh độ tương phản
 */
function checkIsLightColor(hex) {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return false;
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return false;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160;
}
