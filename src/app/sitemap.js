import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";

export default function sitemap() {
  const baseUrl = "https://hdcfashion.vn";
  const now = new Date();

  return SITE_HIERARCHY.allUrls.map((item) => ({
    url: item.url === "/" ? baseUrl : `${baseUrl}${item.url}`,
    lastModified: now,
    changeFrequency: item.changeFrequency || "weekly",
    priority: item.priority ?? 0.7,
  }));
}
