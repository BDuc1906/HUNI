export default function sitemap() {
  const baseUrl = "https://huniuniform.vn";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Thêm sau khi tách trang:
    // { url: `${baseUrl}/dong-phuc-doanh-nghiep`, lastModified: now, priority: 0.9 },
    // { url: `${baseUrl}/vest-may-do`, lastModified: now, priority: 0.9 },
    // { url: `${baseUrl}/the-thao-golf`, lastModified: now, priority: 0.8 },
    // { url: `${baseUrl}/truong-hoc`, lastModified: now, priority: 0.8 },
  ];
}