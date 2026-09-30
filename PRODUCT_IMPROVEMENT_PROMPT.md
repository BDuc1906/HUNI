# 🛍️ Phân Tích & Prompt Cải Tiến Module Sản Phẩm — HUNI/HDC

> **Dự án:** HUNI — Web thương mại điện tử đồng phục doanh nghiệp (Next.js 15, Prisma, NextAuth)  
> **Mục tiêu:** Nâng cấp toàn diện module sản phẩm từ góc nhìn Người Dùng (B2C) + Doanh Nghiệp (B2B)

---

## 🔍 Hiện Trạng Đã Phân Tích

### Files liên quan đến sản phẩm

| File | Vai trò |
|------|---------|
| `src/features/catalog/components/ProductCard.jsx` | Thẻ sản phẩm trong lưới danh mục |
| `src/features/catalog/components/ProductCatalog.jsx` | Trang danh mục, bộ lọc, sắp xếp |
| `src/features/catalog/components/ProductDetailModal.jsx` | Modal chi tiết sản phẩm + đặt hàng |
| `src/shared/data/products.js` | Data sản phẩm tĩnh (~40+ sản phẩm) |
| `src/shared/data/categories.js` | 5 danh mục: corporate, bespoke_suit, sport_golf, school, accessories |

### ✅ Điểm mạnh hiện tại

- UI clean, responsive tốt (mobile-first Tailwind)
- Bảng giá sỉ theo bậc (`wholesaleTiers`) — điểm nổi bật B2B
- Wishlist, Quick View, Logo Customizer
- Bộ lọc theo danh mục, giá, sắp xếp, tìm kiếm text
- Gallery ảnh với thumbnail điều hướng trong modal

### ❌ Điểm yếu / Thiếu sót cần cải thiện

| # | Vấn đề | Mức độ | Tác động |
|---|--------|--------|----------|
| 1 | Bấm giỏ hàng trên card → **auto thêm 10 cái** không hỏi user | 🔴 Cao | UX tệ, dễ nhầm với B2B |
| 2 | **Không có trang `/san-pham/[slug]`** — chỉ dùng modal | 🔴 Cao | SEO = 0, không share link được |
| 3 | Không có **skeleton loading** khi đổi filter | 🟡 Trung bình | Layout nhảy, UX kém |
| 4 | Không có **load-more / phân trang** (40+ sản phẩm load hết) | 🟡 Trung bình | Tải chậm trên mobile |
| 5 | Bộ lọc chất liệu có **state nhưng không có UI select** | 🟡 Trung bình | Tính năng chết |
| 6 | Không có **progress bar giá sỉ** ("thêm X chiếc để tiết kiệm thêm Y đ") | 🟡 Trung bình | Mất cơ hội tăng đơn B2B |
| 7 | Không có **nút Yêu cầu Báo Giá B2B** từ modal sản phẩm | 🟡 Trung bình | Mất lead doanh nghiệp lớn |
| 8 | Không hiển thị **badge % giảm giá** từ `originalPrice` | 🟢 Thấp | Không kích thích mua |
| 9 | Không có **breadcrumb** trong modal chi tiết | 🟢 Thấp | UX điều hướng kém |
| 10 | Không có **review / đánh giá thực tế** từ DB — chỉ data tĩnh giả | 🟢 Thấp | Mất trust người mua |

---

## 🤖 PROMPT CHÍNH — GIAO CHO AI AGENT

> Sao chép toàn bộ prompt dưới đây và giao cho AI agent thực thi:

---

```
Bạn là một senior full-stack developer chuyên Next.js 15 App Router.
Bạn đang làm việc với codebase HUNI tại `c:\Users\Ngoc Minh Kien\Downloads\HUNI`.

Đây là web thương mại điện tử B2B/B2C chuyên đồng phục doanh nghiệp.
Nhiệm vụ của bạn là nâng cấp toàn diện module sản phẩm gồm 3 files chính:

  - src/features/catalog/components/ProductCard.jsx
  - src/features/catalog/components/ProductCatalog.jsx
  - src/features/catalog/components/ProductDetailModal.jsx

TRƯỚC KHI CODE: Đọc node_modules/next/dist/docs/ để nắm API Next.js hiện tại.
Đọc src/shared/providers/ShopProvider.jsx để hiểu toàn bộ state & context hiện có.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK 1 — ProductCard.jsx: Cải thiện thẻ sản phẩm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BADGE GIẢM GIÁ %:
   - Nếu product.originalPrice > product.price thì tính:
       discountPct = Math.round((1 - product.price / product.originalPrice) * 100)
   - Hiển thị badge đỏ "-XX%" ở góc dưới-trái ảnh (bên cạnh badge "May mẫu 0đ")
   - Màu: bg-rose-500 text-white font-black

2. SỬA NÚT GIỎ HÀNG TRÊN CARD:
   - Bỏ hành vi addToCart(product, 10) khi bấm nút giỏ hàng trên card
   - Thay bằng setQuickViewProduct(product) để mở modal chi tiết → user tự chọn số lượng
   - Cập nhật tooltip title từ "Thêm vào giỏ" → "Xem & Đặt hàng"

3. PROGRESS BAR GIÁ SỈ (tạo mới dưới dòng giá sỉ):
   - Tính: bậc giá hiện tại = wholesaleTiers[0] (vì card mặc định hiển thị giá lẻ)
   - Tính min của bậc tiếp theo: nextTier = wholesaleTiers[1]
   - Hiển thị dòng nhỏ màu emerald-600:
       "🏷️ Đặt từ {nextTier.min} chiếc → giá chỉ {nextTier.price.toLocaleString('vi-VN')}đ"
   - Chỉ hiển thị nếu wholesaleTiers.length >= 2

4. MOBILE ACTION BUTTONS:
   - Hiện tại: 2 nút hover chỉ hiển thị trên md:flex (desktop hover)
   - Thêm: Trên mobile (block md:hidden), render 2 nút nhỏ nằm ngang ở dưới card
     thay vì hidden — "Xem chi tiết" và "Mô phỏng logo" với text size xs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK 2 — ProductCatalog.jsx: Bộ lọc & UX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. HOÀN THIỆN BỘ LỌC CHẤT LIỆU:
   - State selectedMaterial đã có nhưng không có UI
   - Tính danh sách materials unique bằng useMemo:
       const materialOptions = useMemo(() =>
         [...new Set(PRODUCTS.map(p => p.material))].sort(), [])
   - Thêm <select> vào Secondary Filter Bar cạnh bộ lọc Giá với label "Chất liệu:"
   - Option đầu: value="all" text="Tất cả chất liệu"

2. SKELETON LOADING:
   - Tạo component SkeletonCard inline (không file riêng):
       6 div với rounded-2xl, animate-pulse, bg-slate-200 giả hình ảnh và text
   - Dùng useTransition từ React để wrap setActiveCategory, setSearchFilter, v.v.
   - Khi isPending === true thì render grid 6 SkeletonCard thay vì ProductCard

3. LOAD-MORE PATTERN:
   - Thêm state: const [visibleCount, setVisibleCount] = useState(9)
   - Reset visibleCount về 9 khi filter/category thay đổi (useEffect)
   - Render: filteredProducts.slice(0, visibleCount).map(...)
   - Dưới grid thêm:
       - Nếu visibleCount < filteredProducts.length: nút "Xem thêm X sản phẩm"
         (X = min(9, filteredProducts.length - visibleCount))
       - Counter text: "Đang xem {Math.min(visibleCount, filteredProducts.length)} / {filteredProducts.length} sản phẩm"

4. THÊM OPTION SẮP XẾP "Giảm giá nhiều nhất":
   - Thêm <option value="discount">Giảm giá nhiều nhất</option> vào select Sắp xếp
   - Trong sort logic thêm:
       if (sortBy === "discount")
         return ((b.originalPrice - b.price) / b.originalPrice) -
                ((a.originalPrice - a.price) / a.originalPrice)

5. BADGE ĐẾM BỘ LỌC ACTIVE:
   - Tính số filter đang active:
       const activeFiltersCount = [
         activeCategory !== "all",
         searchFilter.trim() !== "",
         selectedMaterial !== "all",
         priceRange !== "all"
       ].filter(Boolean).length
   - Nút "Đặt lại" hiển thị badge tròn đỏ nếu activeFiltersCount > 0:
       "Đặt lại" + (activeFiltersCount > 0 ? <span className="...badge...">{activeFiltersCount}</span> : null)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK 3 — ProductDetailModal.jsx: Chi tiết & Chuyển đổi B2B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SAVINGS PROGRESS BAR (thanh tiến trình giá sỉ):
   - Tính vị trí hiện tại của quantity trong wholesaleTiers
   - Tìm nextTier: bậc giá tiếp theo mà quantity chưa đạt
   - Nếu còn nextTier, render thanh progress bên dưới bảng giá sỉ:

     <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
       <div className="flex justify-between text-[10px] text-emerald-700 font-semibold mb-1.5">
         <span>Thêm {nextTier.min - quantity} chiếc nữa</span>
         <span>→ giá {nextTier.price.toLocaleString('vi-VN')}đ/chiếc</span>
       </div>
       <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
         <div
           className="h-full bg-emerald-500 rounded-full transition-all"
           style={{ width: `${(quantity / nextTier.min) * 100}%` }}
         />
       </div>
       <div className="text-[10px] text-emerald-600 mt-1">
         💰 Tiết kiệm thêm {((currentUnitPrice - nextTier.price) * nextTier.min).toLocaleString('vi-VN')}đ nếu đặt đủ {nextTier.min} chiếc
       </div>
     </div>

   - Nếu đã đạt bậc cao nhất: hiển thị "🎉 Bạn đang nhận giá tốt nhất!"

2. NÚT YÊU CẦU BÁO GIÁ B2B (khi quantity >= 100):
   - Kiểm tra ShopProvider xem đã có setIsQuoteOpen chưa
   - Nếu có: thêm nút "📋 Báo Giá B2B" màu xanh brand vào sticky action bar
   - Khi click: gọi setIsQuoteOpen(true), setQuickViewProduct(null)
   - Nếu ShopProvider chưa có: thêm state isQuoteOpen vào ShopProvider và expose qua context
   - Nút chỉ render khi quantity >= 100 — dùng conditional rendering

3. ACCORDION ĐẶC ĐIỂM SẢN PHẨM:
   - Thêm section mới dưới phần màu sắc/size, trước phần "Số lượng đặt may"
   - Tạo state: const [openTab, setOpenTab] = useState(null)
   - 3 tab dạng accordion (click tiêu đề để mở/đóng):

   Tab 1 — "✦ Đặc điểm nổi bật":
     - Render product.features dưới dạng list
     - Mỗi item: <CheckCircle2 className="text-emerald-500"/> + text

   Tab 2 — "🧺 Hướng dẫn bảo quản":
     - Text mặc định dựa theo material:
         Nếu material.includes("Kate") → "Giặt máy ≤30°C, không tẩy, ủi mặt trái"
         Nếu material.includes("Seamless") → "Giặt tay hoặc máy chế độ nhẹ, không vắt mạnh"
         Nếu material.includes("Wool") → "Giặt khô, ủi qua vải lót, bảo quản nơi thoáng mát"
         Mặc định → "Giặt máy ≤40°C, phơi nơi thoáng, không phơi trực tiếp nắng gắt"

   Tab 3 — "🛡️ Chính sách":
     - Render 3 dòng: "✓ Bảo hành 30 ngày lỗi sản xuất"
                      "✓ Đổi trả trong 7 ngày nếu lỗi"
                      "✓ Giao hàng toàn quốc, theo dõi đơn realtime"

4. BREADCRUMB MINI:
   - Import CATEGORIES từ @/shared/data
   - Tìm catName = CATEGORIES.find(c => c.id === product.category)?.name || product.category
   - Render ở đầu cột phải (trước Row 1 SKU), dưới padding-top:
     <nav className="text-[10px] text-slate-400 flex items-center gap-1 flex-wrap">
       <span>Sản phẩm</span>
       <span>›</span>
       <button onClick={() => { setActiveCategory(product.category); setQuickViewProduct(null); }}
               className="hover:text-brand-600 transition-colors">
         {catName}
       </button>
       <span>›</span>
       <span className="text-slate-600 line-clamp-1">{product.title}</span>
     </nav>
   - Lưu ý: cần import setActiveCategory từ useShop (đã có trong ShopProvider)

5. SHARE BUTTON:
   - Thêm import { Share2 } from "lucide-react"
   - Thêm nút icon Share2 vào sticky action bar (cạnh nút Phone):
     <button
       onClick={async () => {
         const url = window.location.origin + '/san-pham/' + product.id;
         await navigator.clipboard.writeText(url);
         showToast("Đã sao chép link sản phẩm!", "success");
       }}
       title="Chia sẻ sản phẩm"
       className="flex sm:flex-none items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition-colors active:scale-[0.98] shrink-0"
     >
       <Share2 className="w-3.5 h-3.5 text-brand-600" />
     </button>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YÊU CẦU KỸ THUẬT BẮT BUỘC:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Giữ nguyên tất cả comment và docstring hiện có trong 3 file
- Không thay đổi cấu trúc props hoặc Context API của ShopProvider ngoài những thay đổi bắt buộc ở Task 3.2
- Dùng Tailwind CSS thuần — không thêm thư viện UI mới
- Tất cả text UI phải bằng tiếng Việt
- Không dùng inline style ngoài style={{ width: `...%` }} cho progress bar
- Sau khi hoàn thành, chạy: npm run build
- Báo cáo kết quả: số file đã sửa, số lỗi (nếu có), screenshot các tính năng mới

THỨ TỰ THỰC HIỆN:
  1. Đọc ShopProvider.jsx
  2. Đọc node_modules/next/dist/docs/
  3. TASK 1 → kiểm tra dev server
  4. TASK 2 → kiểm tra dev server
  5. TASK 3 → kiểm tra dev server
  6. npm run build → báo cáo
```

---

## 📦 Prompt B — SEO: Trang Sản Phẩm Riêng (Nâng cao)

> Thực hiện sau khi hoàn thành Prompt chính ở trên

```
Tạo trang sản phẩm riêng với Next.js App Router tại src/app/san-pham/[id]/page.jsx:

1. generateStaticParams(): return PRODUCTS.map(p => ({ id: p.id }))

2. generateMetadata({ params }):
   - title: `${product.title} | HUNI Đồng Phục`
   - description: product.description
   - openGraph: { images: [product.image], type: 'website' }
   - alternates: { canonical: `/san-pham/${product.id}` }

3. Nội dung trang:
   - Layout 2 cột (md:grid-cols-12) giống ProductDetailModal nhưng là server component
   - Bên trái: Gallery ảnh
   - Bên phải: Thông tin + bảng giá sỉ (dạng static, không có quantity picker)
   - Thêm "Đặt hàng ngay" button → mở catalog với product pre-selected (client component nhỏ)

4. Structured Data JSON-LD (thêm vào <head>):
   {
     "@context": "https://schema.org",
     "@type": "Product",
     "name": product.title,
     "image": product.image,
     "description": product.description,
     "sku": product.sku,
     "offers": {
       "@type": "Offer",
       "price": product.price,
       "priceCurrency": "VND",
       "availability": "https://schema.org/InStock"
     }
   }
```

---

## 🌟 Prompt C — Review & Rating Thực Tế (Nâng cao)

> Thực hiện sau khi Prompt B hoàn tất

```
Xây dựng hệ thống review sản phẩm kết nối database Prisma:

1. Prisma Schema (thêm vào prisma/schema.prisma):
   model Review {
     id        String   @id @default(cuid())
     productId String
     userId    String
     rating    Int      @db.SmallInt
     content   String
     createdAt DateTime @default(now())
     user      User     @relation(fields: [userId], references: [id])
     @@index([productId])
   }

2. API Routes:
   - POST /api/reviews: tạo review mới, yêu cầu session + kiểm tra đã có đơn hàng productId
   - GET /api/reviews?productId=X: lấy danh sách reviews, trả về { reviews, avgRating, total }

3. Component ReviewSection.jsx tại src/features/catalog/components/ReviewSection.jsx:
   - Hiển thị avgRating dạng sao đầy/nửa/rỗng
   - Danh sách reviews có avatar (initials), tên, ngày, nội dung
   - Form thêm review chỉ hiện khi user đã đăng nhập + đã có đơn hàng sản phẩm đó

4. Tích hợp vào ProductDetailModal.jsx:
   - Thêm <ReviewSection productId={product.id} /> dưới accordion đặc điểm
   - Lazy load bằng React.Suspense để không ảnh hưởng thời gian mở modal
```

---

*Tạo bởi Antigravity AI · HUNI Project · 2026*
