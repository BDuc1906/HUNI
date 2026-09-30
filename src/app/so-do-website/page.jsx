import React from "react";
import SitemapView from "@/features/sitemap/components/SitemapView";

export const metadata = {
  title: "Sơ Đồ Website & Danh Mục Toàn Diện | HDC FASHION",
  description:
    "Sơ đồ sitemap trực quan phân cấp 4 tầng với 37 URLs chuẩn hóa, 4 luồng người dùng (User Flows), kiến trúc truyền dẫn SEO Link Juice và ma trận từ khóa thương hiệu HDC Fashion.",
  alternates: {
    canonical: "https://hdcfashion.vn/so-do-website",
  },
};

export default function SoDoWebsitePage() {
  return <SitemapView />;
}
