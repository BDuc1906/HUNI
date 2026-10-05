import React from "react";

const baseSvgClass =
  "shrink-0 rounded-full overflow-hidden shadow-2xs ring-1 ring-black/10 inline-block align-middle";

/**
 * Cờ Việt Nam (VI) - Nền đỏ #DA251D, Ngôi sao vàng #FFFF00
 */
export function FlagVN({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#DA251D" />
      <polygon
        points="256,96 295.4,217.4 423.1,217.4 319.8,292.6 359.2,414 256,338.8 152.8,414 192.2,292.6 88.9,217.4 216.6,217.4"
        fill="#FFFF00"
      />
    </svg>
  );
}

/**
 * Cờ Vương quốc Anh (UK / English - EN)
 */
export function FlagEN({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#012169" />
      <path d="M0,0 L512,512 M512,0 L0,512" stroke="#FFFFFF" strokeWidth="85" />
      <path d="M0,0 L512,512 M512,0 L0,512" stroke="#C8102E" strokeWidth="34" />
      <path d="M256,0 v512 M0,256 h512" stroke="#FFFFFF" strokeWidth="136" />
      <path d="M256,0 v512 M0,256 h512" stroke="#C8102E" strokeWidth="85" />
    </svg>
  );
}

/**
 * Cờ Hoa Kỳ (US)
 */
export function FlagUS({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#FFFFFF" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          y={i * (512 / 13) * 2}
          width="512"
          height={512 / 13}
          fill="#B22234"
        />
      ))}
      <rect width="256" height={(512 * 7) / 13} fill="#3C3B6E" />
      <circle cx="64" cy="50" r="10" fill="#FFFFFF" />
      <circle cx="128" cy="50" r="10" fill="#FFFFFF" />
      <circle cx="192" cy="50" r="10" fill="#FFFFFF" />
      <circle cx="96" cy="95" r="10" fill="#FFFFFF" />
      <circle cx="160" cy="95" r="10" fill="#FFFFFF" />
      <circle cx="64" cy="140" r="10" fill="#FFFFFF" />
      <circle cx="128" cy="140" r="10" fill="#FFFFFF" />
      <circle cx="192" cy="140" r="10" fill="#FFFFFF" />
      <circle cx="96" cy="185" r="10" fill="#FFFFFF" />
      <circle cx="160" cy="185" r="10" fill="#FFFFFF" />
      <circle cx="64" cy="230" r="10" fill="#FFFFFF" />
      <circle cx="128" cy="230" r="10" fill="#FFFFFF" />
      <circle cx="192" cy="230" r="10" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Cờ Nhật Bản (Japan - JA)
 */
export function FlagJP({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#FFFFFF" />
      <circle cx="256" cy="256" r="145" fill="#BC002D" />
    </svg>
  );
}

/**
 * Cờ Hàn Quốc (South Korea - KO)
 */
export function FlagKR({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#FFFFFF" />
      <path
        d="M106,256 a150,150 0 0,0 300,0 a75,75 0 0,0 -150,0 a75,75 0 0,1 -150,0"
        fill="#CD2E3A"
      />
      <path
        d="M106,256 a150,150 0 0,1 300,0 a75,75 0 0,1 -150,0 a75,75 0 0,0 -150,0"
        fill="#0047A0"
      />
      <g transform="rotate(-45 256 256)">
        <rect x="70" y="240" width="14" height="32" fill="#000000" rx="2" />
        <rect x="90" y="240" width="14" height="32" fill="#000000" rx="2" />
        <rect x="110" y="240" width="14" height="32" fill="#000000" rx="2" />
      </g>
      <g transform="rotate(135 256 256)">
        <rect x="70" y="240" width="14" height="14" fill="#000000" rx="2" />
        <rect x="70" y="258" width="14" height="14" fill="#000000" rx="2" />
        <rect x="90" y="240" width="14" height="14" fill="#000000" rx="2" />
        <rect x="90" y="258" width="14" height="14" fill="#000000" rx="2" />
        <rect x="110" y="240" width="14" height="14" fill="#000000" rx="2" />
        <rect x="110" y="258" width="14" height="14" fill="#000000" rx="2" />
      </g>
    </svg>
  );
}

/**
 * Cờ Trung Quốc (China - ZH)
 */
export function FlagCN({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="512" fill="#DE2910" />
      <polygon
        points="140,70 156,120 208,120 166,151 182,201 140,170 98,201 114,151 72,120 124,120"
        fill="#FFDE00"
      />
      <circle cx="230" cy="85" r="14" fill="#FFDE00" />
      <circle cx="265" cy="125" r="14" fill="#FFDE00" />
      <circle cx="265" cy="180" r="14" fill="#FFDE00" />
      <circle cx="230" cy="225" r="14" fill="#FFDE00" />
    </svg>
  );
}

/**
 * Cờ Pháp (France - FR)
 */
export function FlagFR({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="170.7" height="512" fill="#002395" />
      <rect x="170.7" width="170.6" height="512" fill="#FFFFFF" />
      <rect x="341.3" width="170.7" height="512" fill="#ED2939" />
    </svg>
  );
}

/**
 * Cờ Đức (Germany - DE)
 */
export function FlagDE({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="170.7" fill="#000000" />
      <rect y="170.7" width="512" height="170.6" fill="#DD0000" />
      <rect y="341.3" width="512" height="170.7" fill="#FFCE00" />
    </svg>
  );
}

/**
 * Cờ Thái Lan (Thailand - TH)
 */
export function FlagTH({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="85.3" fill="#A51931" />
      <rect y="85.3" width="512" height="85.3" fill="#F4F5F8" />
      <rect y="170.6" width="512" height="170.7" fill="#2D2A4A" />
      <rect y="341.3" width="512" height="85.3" fill="#F4F5F8" />
      <rect y="426.7" width="512" height="85.3" fill="#A51931" />
    </svg>
  );
}

/**
 * Cờ Singapore (Singapore - SG)
 */
export function FlagSG({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} ${baseSvgClass}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="512" height="256" fill="#ED2939" />
      <rect y="256" width="512" height="256" fill="#FFFFFF" />
      {/* Trăng khuyết trắng */}
      <circle cx="120" cy="128" r="60" fill="#FFFFFF" />
      <circle cx="140" cy="128" r="54" fill="#ED2939" />
      {/* 5 ngôi sao nhỏ */}
      <circle cx="130" cy="95" r="8" fill="#FFFFFF" />
      <circle cx="160" cy="115" r="8" fill="#FFFFFF" />
      <circle cx="150" cy="148" r="8" fill="#FFFFFF" />
      <circle cx="115" cy="148" r="8" fill="#FFFFFF" />
      <circle cx="105" cy="115" r="8" fill="#FFFFFF" />
    </svg>
  );
}
