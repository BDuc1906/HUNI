import { SITE_TREE } from "@/shared/data/siteArchitecture";

export default function sitemap() {
  const baseUrl = "https://hdcfashion.vn";
  const now = new Date();

  return SITE_TREE.map((item) => {
    let changeFrequency = "monthly";
    if (item.path === "/" || item.section === "Danh Mục Sản Phẩm") {
      changeFrequency = "weekly";
    } else if (item.section === "Chính Sách Pháp Lý") {
      changeFrequency = "yearly";
    }

    return {
      url: item.path === "/" ? baseUrl : `${baseUrl}${item.path}`,
      lastModified: now,
      changeFrequency,
      priority: item.priority,
    };
  });
}
