import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import FabricCatalogView from "@/features/fabric/components/FabricCatalogView";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Bảng So Sánh & Tra Cứu Chất Liệu Vải May Đồng Phục Cao Cấp | HDC FASHION",
  description:
    "Khám phá và so sánh các chất liệu vải may đồng phục cao cấp tại HDC: Cotton Compact, Bamboo kháng khuẩn, Modal gỗ sồi, Sợi Sen, Sợi Bạc Hà, công nghệ Seamless không đường may.",
};

export default function BangVaiPage() {
  return (
    <>
      {/* Toàn bộ bố cục Bảng Vải cải tiến: Hero, Tra cứu so sánh vải, Spotlight 5 sợi xanh, Gợi ý theo ngành nghề & Cam kết chất lượng */}
      <ErrorBoundary name="Bảng vải">
        <FabricCatalogView />
      </ErrorBoundary>

      {/* Công nghệ Seamless không đường may */}
      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      {/* CTA cuối trang (Đã bỏ hoàn toàn TrustBar theo yêu cầu người dùng) */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
