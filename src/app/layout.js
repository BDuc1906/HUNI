import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import AuthProvider from "@/shared/providers/AuthProvider";

/* ============================================================
   FONT — Self-host, không FOUT, tự preload
   ============================================================ */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

/* ============================================================
   METADATA — SEO đầy đủ + Favicon icons
   ============================================================ */
export const metadata = {
  metadataBase: new URL("https://huniuniform.vn"),

  title: {
    default: "HUNI UNIFORM - Đồng Phục Doanh Nghiệp & May Đo Cao Cấp | HDC GROUP VN",
    template: "%s | HUNI UNIFORM",
  },
  description:
    "HDC GROUP VN - Thương hiệu HUNI Uniform do CEO Nguyễn Thị Thương sáng lập. Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục doanh nghiệp, trường học, thể thao golf cao cấp. Xưởng sản xuất trực tiếp 2.500m², hotline: 0984.959.586.",
  keywords:
    "đồng phục huni, huni uniform, đồng phục doanh nghiệp, may đo đồng phục, áo polo đồng phục, vest doanh nhân, hdc group vn, nguyễn thị thương, đồng phục phú thọ, đồng phục hà nội",
  authors: [{ name: "HDC GROUP VN - HUNI UNIFORM" }],
  creator: "HDC GROUP VN",
  publisher: "HUNI UNIFORM",
  formatDetection: { telephone: true, address: true, email: true },

  /* ---------- ICONS — Favicon HUNI ---------- */
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    apple: { url: "/icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/icon.png",
  },

  /* ---------- Open Graph ---------- */
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://huniuniform.vn",
    siteName: "HUNI UNIFORM",
    title: "HUNI UNIFORM - Nâng Tầm Thương Hiệu Cùng Đồng Phục Cao Cấp",
    description:
      "Thiết kế & may đo đồng phục doanh nghiệp cao cấp. May mẫu thử 0đ, thiết kế 3D miễn phí. Hotline 0984.959.586",
    images: [
      {
        url: "/images/uniform_polo_corporate.jpg",
        width: 1200,
        height: 630,
        alt: "HUNI UNIFORM - Đồng Phục Doanh Nghiệp Cao Cấp",
      },
    ],
  },

  /* ---------- Twitter Card ---------- */
  twitter: {
    card: "summary_large_image",
    title: "HUNI UNIFORM - Đồng Phục Doanh Nghiệp Cao Cấp",
    description: "Thiết kế & may đo đồng phục doanh nghiệp cao cấp. May mẫu thử 0đ.",
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
  themeColor: "#071b34",
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html
      lang="vi"
      className={`${jakarta.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
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
        className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-[var(--font-jakarta)]"
        suppressHydrationWarning
      >
        {/* ============================================================
            AUTH PROVIDER — NextAuth SessionProvider
            Bao quanh toàn bộ app để useSession() hoạt động
            ============================================================ */}
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* ============================================================
            JSON-LD STRUCTURED DATA
            ============================================================ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "HUNI UNIFORM",
              alternateName: "HDC GROUP VN",
              description:
                "Chuyên thiết kế và may đo đồng phục doanh nghiệp, trường học, thể thao golf cao cấp.",
              image: "https://huniuniform.vn/images/uniform_polo_corporate.jpg",
              telephone: "+84984959586",
              email: "dongphuchuni@gmail.com",
              url: "https://huniuniform.vn",
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