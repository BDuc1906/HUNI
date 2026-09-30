export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: "https://hdcfashion.vn/sitemap.xml",
    host: "https://hdcfashion.vn",
  };
}