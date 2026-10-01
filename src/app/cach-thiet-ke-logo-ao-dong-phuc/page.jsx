import ArticlePage from "@/features/process/components/ArticlePage";
import ProcessModuleShell from "@/features/process/components/ProcessModuleShell";
import { logoArticle } from "@/features/process/data/articles";

export const metadata = {
  title: "Cách Thiết Kế Logo Áo Đồng Phục",
  description: "Nguyên tắc lựa chọn vị trí, kích thước, màu sắc và kỹ thuật in thêu logo áo đồng phục.",
};

export default function LogoGuideRoute() {
  return <ProcessModuleShell><ArticlePage article={logoArticle} /></ProcessModuleShell>;
}
