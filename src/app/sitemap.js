import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";

export default function sitemap() {
  const baseUrl = "https://hdcfashion.vn";
  const now = new Date();

<<<<<<< HEAD
  return SITE_HIERARCHY.allUrls.map((item) => ({
    url: item.url === "/" ? baseUrl : `${baseUrl}${item.url}`,
    lastModified: now,
    changeFrequency: item.changeFrequency || "weekly",
    priority: item.priority ?? 0.7,
  }));
=======
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quy-trinh-may-dong-phuc-doanh-nghiep`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/bao-gia-dong-phuc-cong-ty`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cach-thiet-ke-logo-ao-dong-phuc`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/xu-huong-dong-phuc-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];
>>>>>>> 0622545 (feat: implement process module)
}
