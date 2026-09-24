import "./globals.css";

export const metadata = {
  title: "HUNI UNIFORM - Đồng Phục Doanh Nghiệp & May Đo Cao Cấp | HDC GROUP VN",
  description:
    "HDC GROUP VN - Thương hiệu HUNI Uniform do CEO Nguyễn Thị Thương sáng lập. Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục doanh nghiệp, trường học, thể thao golf cao cấp. Xưởng sản xuất trực tiếp 2.500m², hotline: 0984.959.586.",
  keywords:
    "đồng phục huni, huni uniform, đồng phục doanh nghiệp, may đo đồng phục, áo polo đồng phục, vest doanh nhân, hdc group vn, nguyễn thị thương, đồng phục phú thọ, đồng phục hà nội",
  authors: [{ name: "HDC GROUP VN - HUNI UNIFORM" }]
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#071b34"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
