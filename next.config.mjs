/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840, 4096],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768],
    formats: ["image/avif", "image/webp"],
    qualities: [85, 90, 95, 100],
    minimumCacheTTL: 60 * 60 * 24 * 60,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // ============================================================
  // REWRITES — URL tiếng Việt cho khách, folder tiếng Anh cho code
  // ============================================================
  async rewrites() {
    return [
      // Trang tài khoản (chỉ 1 route duy nhất, các tab ở trong)
      { source: "/tai-khoan", destination: "/account" },

      // Chính sách pháp lý
      { source: "/chinh-sach-bao-mat", destination: "/privacy-policy" },
      { source: "/chinh-sach-doi-tra", destination: "/refund-policy" },
      { source: "/dieu-khoan-su-dung", destination: "/terms-of-service" },
    ];
  },
};

export default nextConfig;