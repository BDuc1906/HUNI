/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép ảnh từ Unsplash (dùng cho avatar testimonial tạm thời)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Tự động convert sang AVIF/WebP để giảm 60% dung lượng
    formats: ["image/avif", "image/webp"],
    // Cache ảnh tối ưu trong 60 ngày
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
};

export default nextConfig;