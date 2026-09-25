export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: "https://huniuniform.vn/sitemap.xml",
    host: "https://huniuniform.vn",
  };
}