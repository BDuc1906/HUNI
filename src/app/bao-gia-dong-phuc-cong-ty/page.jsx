import ProcessModuleShell from "@/features/process/components/ProcessModuleShell";
import QuotePage from "@/features/process/components/QuotePage";

export const metadata = {
  title: "Báo Giá Đồng Phục Công Ty",
  description: "Nhận tư vấn và báo giá đồng phục doanh nghiệp theo nhu cầu thực tế từ HDC Fashion.",
};

export default function QuoteRoute() {
  return <ProcessModuleShell><QuotePage /></ProcessModuleShell>;
}
