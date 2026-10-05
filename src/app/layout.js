// src/app/layout.js
import "./globals.css";
import { Suspense } from "react";
import { Roboto } from "next/font/google";
import AuthProvider from "@/shared/providers/AuthProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { LanguageProvider } from "@/shared/providers/LanguageProvider";
import { cookies } from "next/headers";
import { ShopProvider } from "@/shared/providers/ShopProvider";
import AppShell from "@/shared/components/layout/AppShell";

/* ============================================================
   FONT — Self-host, không FOUT, tự preload
   ============================================================ */
// Catalogue HDC Fashion dùng sans-serif đậm (dạng Roboto). Giữ tên biến --font-jakarta để không phải sửa nơi khác.
const jakarta = Roboto({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

/* ============================================================
   METADATA — SEO đầy đủ + Favicon icons
   ============================================================ */
export const metadata = {
  metadataBase: new URL("https://hdcfashion.vn"),

  // ✅ Title rút gọn — không bị cắt trên tab trình duyệt
  title: {
    default: "HDC FASHION - Đồng Phục Doanh Nghiệp Cao Cấp",
    template: "%s | HDC FASHION",
  },
  description:
    "HDC GROUP VN - Thương hiệu HDC Fashion do CEO Nguyễn Thị Thương sáng lập. Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục doanh nghiệp, trường học, thể thao golf cao cấp. Xưởng sản xuất trực tiếp 2.500m², hotline: 0984.959.586.",
  keywords:
    "đồng phục hdc, hdc fashion, hdcfashion, phong cách tạo thành công, đồng phục doanh nghiệp, may đo đồng phục, áo polo đồng phục, vest doanh nhân, hdc group vn, nguyễn thị thương, đồng phục phú thọ, đồng phục hà nội",
  authors: [{ name: "HDC GROUP VN - HDC FASHION" }],
  creator: "HDC GROUP VN",
  publisher: "HDC FASHION",
  formatDetection: { telephone: true, address: true, email: true },

  /* ============================================================
     ICONS — Dùng icon trong /images/icon.png
     ✅ Tập trung 1 chỗ — dễ quản lý
     ============================================================ */
  icons: {
    icon: [
      { url: "/images/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/images/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/images/icon.png", type: "image/png", sizes: "any" },
    ],
    apple: { url: "/images/icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/images/icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/images/icon.png",
        color: "#0097b2",
      },
    ],
  },

  /* ---------- Open Graph ---------- */
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hdcfashion.vn",
    siteName: "HDC FASHION",
    title: "HDC FASHION - Đồng Phục Doanh Nghiệp Cao Cấp",
    description:
      "Thiết kế & may đo đồng phục doanh nghiệp cao cấp. May mẫu thử 0đ, thiết kế 3D miễn phí. Hotline 0984.959.586",
    images: [
      {
        url: "/images/uniform_polo_corporate.jpg",
        width: 1200,
        height: 630,
        alt: "HDC FASHION - Đồng Phục Doanh Nghiệp Cao Cấp",
      },
    ],
  },

  /* ---------- Twitter Card ---------- */
  twitter: {
    card: "summary_large_image",
    title: "HDC FASHION - Đồng Phục Doanh Nghiệp Cao Cấp",
    description:
      "Thiết kế & may đo đồng phục doanh nghiệp cao cấp. May mẫu thử 0đ.",
    images: ["/images/uniform_polo_corporate.jpg"],
  },

  /* ---------- Robots ---------- */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ============================================================
   VIEWPORT
   ============================================================ */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0097b2",
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default async function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Đọc cookie ngôn ngữ để Server Render (SSR) ra đúng ngôn ngữ ngay từ đầu, tránh chớp giao diện (flicker)
  const cookieStore = await cookies();
  const initialLanguage = cookieStore.get("hdc_lang")?.value || "vi";

  return (
    <html
      lang={initialLanguage}
      className={`${jakarta.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts: Playfair Display + Cormorant Garamond for luxury editorial typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        {/* DOM safety polyfill for Google Translate compatibility in React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof Node === 'function' && Node.prototype) {
                  var origRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (child.parentNode !== this) {
                      return child;
                    }
                    return origRemoveChild.apply(this, arguments);
                  };
                  var origInsertBefore = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, refNode) {
                    if (refNode && refNode.parentNode !== this) {
                      return newNode;
                    }
                    return origInsertBefore.apply(this, arguments);
                  };
                }
              })();
            `,
          }}
        />
        {/* ============================================================
            STRIP BROWSER-EXTENSION ATTRIBUTES
            Dọn sạch attribute của Bitdefender, Avast, Grammarly...
            ============================================================ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var BLOCKED = ['bis_skin_checked', 'bis_register'];
                var BLOCKED_PREFIX = ['__processed_', 'bis_'];

                function shouldRemove(name) {
                  if (BLOCKED.indexOf(name) !== -1) return true;
                  for (var i = 0; i < BLOCKED_PREFIX.length; i++) {
                    if (name.indexOf(BLOCKED_PREFIX[i]) === 0) return true;
                  }
                  return false;
                }

                function stripAttrs(root) {
                  var all = root.querySelectorAll('*');
                  for (var i = 0; i < all.length; i++) {
                    var el = all[i];
                    var attrs = el.attributes;
                    for (var j = attrs.length - 1; j >= 0; j--) {
                      var attr = attrs[j];
                      if (shouldRemove(attr.name)) {
                        el.removeAttribute(attr.name);
                      }
                    }
                  }
                }

                stripAttrs(document);

                var observer = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes' && shouldRemove(m.attributeName)) {
                      m.target.removeAttribute(m.attributeName);
                    }
                    if (m.type === 'childList') {
                      for (var k = 0; k < m.addedNodes.length; k++) {
                        var node = m.addedNodes[k];
                        if (node.nodeType === 1) {
                          stripAttrs(node);
                          stripAttrs(node.parentNode || document);
                        }
                      }
                    }
                  }
                });

                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                });

                setTimeout(function() { observer.disconnect(); }, 10000);

                document.addEventListener('DOMContentLoaded', function() {
                  stripAttrs(document);
                });
              })();
            `,
          }}
        />

        {/* ============================================================
            GOOGLE ANALYTICS 4 — chỉ chạy production
            ⚠️ Thay "G-XXXXXXXXXX" bằng Measurement ID thật khi có tài khoản
            ============================================================ */}
        {isProduction && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-XXXXXXXXXX', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* ============================================================
            FACEBOOK PIXEL — chỉ chạy production
            ⚠️ Thay "1234567890" bằng Pixel ID thật khi có tài khoản
            ============================================================ */}
        {isProduction && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){
                  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s);
                }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1234567890');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>

      <body
        className="min-h-screen bg-[#f6f8ff] text-slate-800 antialiased font-[var(--font-jakarta)]"
        suppressHydrationWarning
      >
        {/* ============================================================
            GLOBAL PROVIDERS — Áp dụng cho MỌI trang
            ✅ Suspense bọc AuthProvider để bắt suspension khi prerender
            ✅ ThemeProvider + ShopProvider bọc ngoài để mọi route đều có
               access vào cart, wishlist, modal state, theme...
            ============================================================ */}
        <Suspense fallback={null}>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider initialLanguage={initialLanguage}>
                <ShopProvider>
                  <AppShell>{children}</AppShell>
                </ShopProvider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </Suspense>

        {/* ============================================================
            JSON-LD STRUCTURED DATA
            ============================================================ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "HDC FASHION",
              alternateName: "HDC GROUP VN",
              description:
                "Chuyên thiết kế và may đo đồng phục doanh nghiệp, trường học, thể thao golf cao cấp.",
              image: "https://hdcfashion.vn/images/uniform_polo_corporate.jpg",
              logo: "https://hdcfashion.vn/images/icon.png",
              telephone: "+84984959586",
              email: "dongphuchuni@gmail.com",
              url: "https://hdcfashion.vn",
              priceRange: "100.000đ - 5.000.000đ",
              address: {
                "@type": "PostalAddress",
                streetAddress: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình",
                addressLocality: "Việt Trì",
                addressRegion: "Phú Thọ",
                addressCountry: "VN",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "08:00",
                closes: "18:00",
              },
              sameAs: ["https://zalo.me/0984959586"],
              founder: {
                "@type": "Person",
                name: "Nguyễn Thị Thương",
                jobTitle: "Founder & CEO",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}