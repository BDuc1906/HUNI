import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ContactView from "@/features/contact/components/ContactView";

export const metadata = {
  title: "Liên Hệ & Hệ Thống Showroom, Xưởng May | HDC FASHION",
  description:
    "Thông tin liên hệ thương hiệu HDC Fashion - HDC GROUP VN. Trụ sở Hòa Bình, văn phòng Hà Nội, xưởng sản xuất dệt may 2.500m2 tại Phú Thọ. Hotline 24/7: 0984.959.586.",
  keywords: [
    "liên hệ HDC Fashion",
    "đặt may đồng phục doanh nghiệp",
    "báo giá đồng phục",
    "xưởng may đồng phục Phú Thọ",
    "văn phòng đồng phục Hà Nội",
  ],
  openGraph: {
    title: "Liên Hệ & Hệ Thống Showroom, Xưởng May | HDC FASHION",
    description:
      "Tư vấn giải pháp đồng phục doanh nghiệp, may mẫu thử 0đ & đo ni tận nơi. Hotline 24/7: 0984.959.586.",
    url: "https://hdcfashion.vn/lien-he",
    type: "website",
  },
};

export default function LienHePage() {
  return (
    <ErrorBoundary name="Trang Liên Hệ">
      <ContactView />
    </ErrorBoundary>
  );
}
