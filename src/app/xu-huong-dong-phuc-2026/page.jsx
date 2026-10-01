import ArticlePage from "@/features/process/components/ArticlePage";
import ProcessModuleShell from "@/features/process/components/ProcessModuleShell";
import { trendArticle } from "@/features/process/data/articles";

export const metadata = {
  title: "Xu Hướng Đồng Phục 2026",
  description: "Các xu hướng thiết kế đồng phục 2026: tối giản, vật liệu thoáng mát, cá nhân hóa và nhận diện thương hiệu.",
};

export default function UniformTrendRoute() {
  return <ProcessModuleShell><ArticlePage article={trendArticle} /></ProcessModuleShell>;
}
