/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 60,
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