import ProcessLandingPage from "@/features/process/components/ProcessLandingPage";
import ProcessModuleShell from "@/features/process/components/ProcessModuleShell";

export const metadata = {
  title: "Quy Trình May Đồng Phục Doanh Nghiệp",
  description: "Khám phá quy trình may đồng phục chuẩn hóa 5 bước tại HDC Fashion, từ tư vấn mẫu đến kiểm định KCS và giao hàng.",
};

export default function ProcessRoute() {
  return <ProcessModuleShell><ProcessLandingPage /></ProcessModuleShell>;
}
