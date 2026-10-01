# 🛠️ ADMIN DASHBOARD — Prompt Thiết Kế Giao Diện Quản Trị
## HUNI / HDC Fashion — Đồng Phục Doanh Nghiệp

> **Mục đích:** Prompt chi tiết dành cho AI agent xây dựng toàn bộ giao diện quản trị viên (Admin Panel)
> **Tech stack:** Next.js 15 App Router · Tailwind CSS · shadcn/ui · Recharts · Prisma
> **Route prefix:** `/admin/*` — chỉ truy cập được khi `session.user.role === "ADMIN"`

---

## 📑 Mục Lục Prompt

- [Prompt A — Khung Admin Layout + Auth Guard](#prompt-a--khung-admin-layout--auth-guard)
- [Prompt B — Trang Dashboard Tổng Quan](#prompt-b--trang-dashboard-tổng-quan)
- [Prompt C — Quản Lý Đơn Hàng](#prompt-c--quản-lý-đơn-hàng)
- [Prompt D — Quản Lý Báo Giá](#prompt-d--quản-lý-báo-giá)
- [Prompt E — Quản Lý Sản Phẩm](#prompt-e--quản-lý-sản-phẩm)
- [Prompt F — Quản Lý Khách Hàng](#prompt-f--quản-lý-khách-hàng)
- [Prompt G — Quản Lý Voucher](#prompt-g--quản-lý-voucher)
- [Thứ Tự Thực Hiện](#thứ-tự-thực-hiện)

---

## Prompt A — Khung Admin Layout + Auth Guard

```
Bạn là senior Next.js developer. Hãy xây dựng phần khung (layout) cho Admin Panel của dự án HUNI (đồng phục doanh nghiệp).

## YÊU CẦU KỸ THUẬT
- File: src/app/admin/layout.jsx
- Dùng Next.js 15 App Router (Server Component)
- Auth: import { auth } from "@/server/auth" — kiểm tra session.user.role === "ADMIN", nếu không đủ quyền → redirect("/login")
- Tailwind CSS + shadcn/ui components

## LAYOUT CẦN TẠO
Sidebar cố định bên trái (w-64), nội dung chính chiếm phần còn lại.

### Sidebar bao gồm:
1. Logo HDC Fashion + badge "Admin"
2. Navigation links (dùng Next.js Link):
   - /admin → Dashboard (icon: LayoutDashboard)
   - /admin/orders → Đơn Hàng (icon: ShoppingBag) + badge số lượng PENDING
   - /admin/quotes → Báo Giá (icon: FileText) + badge số lượng NEW
   - /admin/products → Sản Phẩm (icon: Package)
   - /admin/customers → Khách Hàng (icon: Users)
   - /admin/vouchers → Voucher (icon: Tag)
3. Footer sidebar: Avatar admin + email + nút Đăng xuất

### Header bar trên cùng:
- Breadcrumb tự động theo route hiện tại
- Hiển thị ngày giờ hiện tại (Việt Nam timezone)
- Avatar admin + tên

## CHI TIẾT PHONG CÁCH
- Màu sắc: sidebar bg-slate-900 text-white, active link bg-blue-600, hover bg-slate-800
- Font: Inter
- Responsive: mobile → sidebar thu gọn thành icon only (w-16)
- Transition: smooth khi hover/active

## CÁC FILE CẦN TẠO
1. src/app/admin/layout.jsx — Layout chính với auth check
2. src/app/admin/components/AdminSidebar.jsx — Component sidebar
3. src/app/admin/components/AdminHeader.jsx — Component header
4. src/middleware.js (hoặc cập nhật nếu đã có) — Protect /admin/* route

## LƯU Ý
- Sidebar badges PENDING/NEW: fetch từ GET /api/admin/dashboard để lấy statusCounts
- Dùng "use server" cho layout, "use client" chỉ cho các phần interactive
- Không được hardcode dữ liệu — tất cả từ API
```

---

## Prompt B — Trang Dashboard Tổng Quan

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang Dashboard tổng quan cho Admin Panel của HUNI.

## FILE CẦN TẠO
- src/app/admin/page.jsx (Server Component)
- src/app/admin/components/StatsCard.jsx
- src/app/admin/components/RecentOrdersTable.jsx
- src/app/admin/components/RecentQuotesTable.jsx
- src/app/admin/components/OrderStatusChart.jsx

## API SỬ DỤNG
GET /api/admin/dashboard → trả về:
{
  stats: { totalOrders, totalRevenue, totalQuotes, totalCustomers },
  statusCounts: { orders: {pending, producing, completed, cancelled}, quotes: {new} },
  recentOrders: [...5 đơn gần nhất],
  recentQuotes: [...5 báo giá gần nhất]
}

## UI CÁC PHẦN

### 1. Stats Cards — 4 thẻ hàng ngang
Mỗi thẻ (StatsCard) gồm:
- Icon lớn (màu theo loại)
- Số liệu chính (lớn, đậm)
- Label mô tả
- Thay đổi so với tháng trước (nếu có)

Các thẻ:
| Thẻ | Icon | Màu | Số liệu |
|-----|------|-----|---------|
| Tổng Đơn Hàng | ShoppingBag | Blue | totalOrders |
| Doanh Thu | TrendingUp | Green | totalRevenue (VND) |
| Yêu Cầu Báo Giá | FileText | Orange | totalQuotes |
| Khách Hàng | Users | Purple | totalCustomers |

### 2. OrderStatusChart — Biểu đồ tròn (Pie Chart - dùng Recharts)
Hiển thị phân bổ trạng thái đơn hàng:
- Chờ xử lý (PENDING) — màu vàng
- Đang may (PRODUCING) — màu xanh dương
- Hoàn thành (COMPLETED) — màu xanh lá
- Đã huỷ (CANCELLED) — màu đỏ

### 3. RecentOrdersTable — Bảng 5 đơn gần nhất
Columns: Mã đơn | Khách hàng | Sản phẩm | Tổng tiền | Trạng thái | Thời gian
- Trạng thái hiển thị dạng Badge với màu tương ứng
- Click vào dòng → navigate đến /admin/orders?search={orderNumber}
- Số tiền format: "13.500.000đ"

### 4. RecentQuotesTable — Bảng 5 báo giá gần nhất
Columns: Công ty/Khách | SĐT | Danh mục | Số lượng | Trạng thái | Thời gian
- Click vào dòng → navigate đến /admin/quotes

## FORMAT TIỀN VND
Dùng: new Intl.NumberFormat('vi-VN').format(amount) + 'đ'

## LƯU Ý
- Server Component: fetch data trực tiếp, không dùng useEffect
- Dùng Suspense + loading skeleton cho từng section
- Tất cả số liệu real-time từ API, không hardcode
```

---

## Prompt C — Quản Lý Đơn Hàng

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang quản lý đơn hàng cho Admin Panel HUNI.

## FILES CẦN TẠO
- src/app/admin/orders/page.jsx
- src/app/admin/orders/components/OrdersTable.jsx
- src/app/admin/orders/components/OrderStatusBadge.jsx
- src/app/admin/orders/components/OrderDetailPanel.jsx
- src/app/admin/orders/components/OrderStatusUpdateModal.jsx

## API SỬ DỤNG
- GET /api/admin/orders?status=&search=&dateFrom=&dateTo=&page=&limit=
- PATCH /api/admin/orders/[id] — { status, notes }

## UI CẦN XÂY DỰNG

### 1. Thanh Filter & Search (Filter Bar)
Bố cục ngang, gồm:
- Search input: placeholder "Tìm mã đơn, tên KH, SĐT, công ty..."
- Dropdown Status: Tất cả | Chờ xử lý | Đã báo giá | Xác nhận | Đang may | Đã giao | Hoàn thành | Đã huỷ
- Date range picker: Từ ngày — Đến ngày
- Nút Export CSV (icon Download)

### 2. Summary Bar
Dải ngang hiển thị nhanh:
- 🟡 Chờ xử lý: {pending} | 🔵 Đang may: {producing} | ✅ Hoàn thành: {completed} | 💰 Tổng doanh thu: {totalRevenue}đ

### 3. OrdersTable — Bảng đơn hàng
Columns:
| Cột | Nội dung |
|-----|---------|
| Mã đơn | orderNumber, click → mở OrderDetailPanel |
| Khách hàng | fullName + company (dòng phụ nhỏ hơn) + SĐT |
| Sản phẩm | Tên SP đầu tiên + "+X sản phẩm khác" nếu nhiều |
| Tổng tiền | total (VND, đậm xanh lá) |
| PT Thanh toán | vietqr / deposit30 / freesample với icon |
| Trạng thái | OrderStatusBadge (chip màu) |
| Ngày tạo | dd/MM/yyyy HH:mm |
| Hành động | Nút "Cập nhật" → mở OrderStatusUpdateModal |

Phân trang: Previous | 1 2 3 ... | Next (bottom right)

### 4. OrderStatusBadge — Badge màu theo trạng thái
| Status | Màu | Label |
|--------|-----|-------|
| PENDING | Vàng | ⏳ Chờ xử lý |
| QUOTED | Tím | 📋 Đã báo giá |
| CONFIRMED | Xanh dương | ✅ Xác nhận |
| PRODUCING | Cam | 🔧 Đang may |
| SHIPPED | Indigo | 🚚 Đã giao |
| COMPLETED | Xanh lá | ✔️ Hoàn thành |
| CANCELLED | Đỏ | ❌ Đã huỷ |

### 5. OrderDetailPanel — Slide-in panel bên phải (không modal, dùng Sheet từ shadcn)
Khi click vào một đơn hàng, panel trượt từ phải sang. Hiển thị:

**Header:**
- Mã đơn HN-XXXXXX (lớn, đậm)
- OrderStatusBadge hiện tại
- Ngày tạo

**Section Thông Tin Khách Hàng:**
- Tên | SĐT | Email | Công ty | Địa chỉ
- Thông tin VAT (nếu có): Mã số thuế | Tên công ty | Email xuất hoá đơn

**Section Sản Phẩm:**
Bảng nhỏ: Tên SP | Màu | Size | Số lượng | Đơn giá | Logo | Thành tiền

**Section Tổng Cộng:**
- Tạm tính: Xđ
- Voucher (nếu có): -Xđ
- **Tổng thanh toán: Xđ** (lớn, xanh lá đậm)

**Section Ghi Chú:**
- Nội dung notes của đơn

**Footer:**
- Nút "Cập nhật trạng thái" → mở OrderStatusUpdateModal

### 6. OrderStatusUpdateModal
Modal confirm khi cập nhật trạng thái:
- Dropdown chọn status mới
- Textarea ghi chú (optional)
- Nút "Xác nhận" → PATCH /api/admin/orders/[id]
- Loading state khi đang gửi
- Toast success/error sau khi xong

## TRẢI NGHIỆM QUAN TRỌNG
- Khi cập nhật status thành công: refresh table, cập nhật badge trong panel, hiện toast "✅ Đã cập nhật trạng thái"
- Search debounce 300ms
- Empty state: hình minh hoạ + "Chưa có đơn hàng nào" khi filter không có kết quả
```

---

## Prompt D — Quản Lý Báo Giá

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang quản lý yêu cầu báo giá cho Admin Panel HUNI.

## FILES CẦN TẠO
- src/app/admin/quotes/page.jsx
- src/app/admin/quotes/components/QuotesTable.jsx
- src/app/admin/quotes/components/QuoteStatusBadge.jsx
- src/app/admin/quotes/components/QuoteDetailPanel.jsx
- src/app/admin/quotes/components/QuoteUpdateModal.jsx

## API SỬ DỤNG
- GET /api/admin/quotes?status=&category=&search=&page=&limit=
- PATCH /api/admin/quotes/[id] — { status, estimatedPrice, notes }

## UI CẦN XÂY DỰNG

### 1. Filter Bar
- Search input: tên, SĐT, email, công ty
- Dropdown Status: Tất cả | Mới | Đã liên hệ | Đã báo giá | Chuyển đơn | Đóng
- Dropdown Danh mục: Tất cả | Polo | Sơ mi | Vest/Suit | Golf | Đồng phục trường | Phụ kiện
- Nút Export CSV

### 2. QuotesTable — Bảng báo giá
Columns:
| Cột | Nội dung |
|-----|---------|
| Khách hàng | fullName + company |
| SĐT | phone (click → copy) |
| Danh mục | Badge danh mục sản phẩm |
| Số lượng | quantity + "chiếc" |
| Báo giá KH | estimatedPrice (VND) hoặc "—" |
| Trạng thái | QuoteStatusBadge |
| Ngày gửi | dd/MM/yyyy HH:mm |
| Hành động | Nút "Xử lý" |

### 3. QuoteStatusBadge
| Status | Màu | Label |
|--------|-----|-------|
| NEW | Xanh dương nhạt | 🔔 Mới |
| CONTACTED | Vàng | 📞 Đã liên hệ |
| QUOTED | Tím | 📄 Đã báo giá |
| CONVERTED | Xanh lá | ✅ Chuyển đơn |
| CLOSED | Xám | 🔒 Đóng |

### 4. QuoteDetailPanel (Sheet từ shadcn)
Trượt từ phải vào khi click, hiển thị:
- Thông tin liên hệ: Tên, SĐT, Email, Công ty
- Yêu cầu: Danh mục, Số lượng, Giá tham khảo khách
- Ghi chú của khách
- Timeline trạng thái (stepper ngang): Mới → Liên hệ → Báo giá → Chuyển đơn / Đóng
- Nút "Cập nhật" mở QuoteUpdateModal

### 5. QuoteUpdateModal
- Dropdown chọn status mới
- Input số "Báo giá đề xuất (VND)" — optional
- Textarea ghi chú admin
- Nút Xác nhận → PATCH /api/admin/quotes/[id]

## TÍNH NĂNG ĐẶC BIỆT
- Click vào SĐT → copy vào clipboard + toast "Đã copy SĐT"
- Khi status chuyển sang CONVERTED → hiển thị gợi ý "Tạo đơn hàng mới cho khách này?"
- NEW quotes nổi bật hơn (hàng có màu nền vàng nhạt)
```

---

## Prompt E — Quản Lý Sản Phẩm

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang quản lý sản phẩm cho Admin Panel HUNI.

## FILES CẦN TẠO
- src/app/admin/products/page.jsx
- src/app/admin/products/new/page.jsx
- src/app/admin/products/[id]/edit/page.jsx
- src/app/admin/products/components/ProductsTable.jsx
- src/app/admin/products/components/ProductForm.jsx
- src/app/admin/products/components/WholesaleTiersEditor.jsx
- src/app/admin/products/components/ColorEditor.jsx

## API SỬ DỤNG
- GET /api/products?category=&search=&page=&limit=12
- GET /api/products/[id]
- POST /api/products (🔒 ADMIN)
- PUT /api/products/[id] (🔒 ADMIN)
- DELETE /api/products/[id] (🔒 ADMIN)

## TRANG 1: Danh sách sản phẩm (/admin/products)

### Filter Bar
- Search input
- Dropdown danh mục: corporate / bespoke_suit / sport_golf / school / accessories
- Toggle: Tất cả | Đã xuất bản | Nháp | Nổi bật
- Nút "Thêm sản phẩm mới" (xanh dương) → /admin/products/new

### ProductsTable — Bảng sản phẩm
Columns:
| Cột | Nội dung |
|-----|---------|
| Ảnh | Thumbnail nhỏ (48x48) |
| Tên sản phẩm | title (đậm) + sku (xám nhỏ bên dưới) |
| Danh mục | Badge |
| Giá | price (đậm) / originalPrice gạch ngang |
| Trạng thái | Published: chip xanh "Hiển thị" / đỏ "Nháp" |
| Nổi bật | Toggle switch |
| Hành động | Nút "Sửa" → /admin/products/[id]/edit \| Nút "Xoá" (đỏ, confirm trước) |

### Xoá sản phẩm
- Hiển thị Dialog confirm: "Bạn có chắc muốn xoá sản phẩm này? Hành động không thể hoàn tác."
- Nút "Xoá" → DELETE /api/products/[id]
- Toast success/error sau khi xong

## TRANG 2: Form Tạo / Chỉnh Sửa sản phẩm (ProductForm — dùng cho cả /new và /[id]/edit)

### Layout: 2 cột (2/3 + 1/3)

#### Cột trái (2/3) — Thông tin chính:
**Section Thông tin cơ bản:**
- Tên sản phẩm (required)
- Slug URL (required, auto-generate từ title, có thể sửa)
- SKU (required)
- Danh mục (dropdown required)
- Chất liệu (optional)
- Mô tả chi tiết (Textarea lớn, required)

**Section Giá:**
- Giá niêm yết (VND, required)
- Giá gốc / Giá cũ (VND, optional — để tính % giảm)

**Section WholesaleTiersEditor:**
Bảng nhập mốc giá sỉ, mỗi dòng gồm:
- Từ (min) — Đến (max) — Đơn giá (VND) — Label (auto-fill: "X-Y chiếc")
- Nút "+ Thêm mốc" / "Xoá" từng dòng
- Preview real-time: "100 áo → 135.000đ/chiếc, tiết kiệm 50.000đ"

**Section Đặc điểm sản phẩm:**
- Dynamic list input: nhập một đặc điểm → Enter → thêm chip
- Ví dụ: "Vải Pique thoáng khí", "Kháng khuẩn ion bạc"

#### Cột phải (1/3) — Trạng thái & Media:
**Section Trạng thái:**
- Toggle "Xuất bản" (published)
- Toggle "Nổi bật" (featured)

**Section Hình ảnh:**
- Upload zone (drag & drop) hoặc nhập URL
- Preview danh sách ảnh, kéo thả để sắp xếp
- Nút xoá từng ảnh

**Section ColorEditor:**
- Danh sách màu sắc, mỗi màu gồm:
  - Color picker (hex)
  - Tên màu tiếng Việt
  - Nút xoá
- Nút "+ Thêm màu"

**Section Kích cỡ:**
- Checkbox group: XS / S / M / L / XL / 2XL / 3XL / 4XL
- Thêm kích cỡ tuỳ chỉnh

### Footer Form:
- Nút "Lưu nháp" (outline) → published: false
- Nút "Xuất bản" (primary xanh) → published: true
- Nút "Huỷ" → back

## VALIDATION CLIENT-SIDE
- Slug: tự động slug-ify từ title (lowercase, replace space → "-", bỏ ký tự đặc biệt)
- Giá sỉ: min phải < max; đơn giá phải < giá niêm yết
- Phải có ít nhất 1 ảnh

## LƯU Ý KỸ THUẬT
- Dùng react-hook-form + zod cho form validation
- Slug preview: hiển thị "URL sẽ là: /san-pham/{slug}"
- Auto-save draft mỗi 30s vào localStorage
```

---

## Prompt F — Quản Lý Khách Hàng

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang quản lý khách hàng cho Admin Panel HUNI.

## FILES CẦN TẠO
- src/app/admin/customers/page.jsx
- src/app/admin/customers/components/CustomersTable.jsx
- src/app/admin/customers/components/CustomerDetailPanel.jsx

## API SỬ DỤNG
- GET /api/admin/customers?search=&page=&limit=
- GET /api/orders?mine=false (admin xem toàn bộ, filter theo customerId)

## UI CẦN XÂY DỰNG

### 1. Filter Bar
- Search input: tên, SĐT, email, công ty
- Sort by: Mới nhất | Nhiều đơn nhất | A-Z tên

### 2. CustomersTable
Columns:
| Cột | Nội dung |
|-----|---------|
| Khách hàng | Tên + công ty (dòng phụ) |
| SĐT | phone (click → copy) |
| Email | email hoặc "—" |
| Số đơn hàng | orderCount (chip xanh) |
| Số báo giá | quoteCount (chip cam) |
| Ngày đăng ký | dd/MM/yyyy |
| Hành động | Nút "Xem chi tiết" |

### 3. CustomerDetailPanel (Sheet từ shadcn)
**Header:**
- Avatar chữ cái đầu (tên) + Tên khách hàng lớn
- Công ty | SĐT | Email

**Tabs:**
- Tab 1: "Thông tin" — địa chỉ, mã số thuế, ghi chú
- Tab 2: "Lịch sử đơn hàng" — bảng các đơn đã đặt (orderNumber, status, total, date)
- Tab 3: "Báo giá" — bảng các yêu cầu báo giá (category, quantity, status, date)

**Thống kê nhanh (dạng thẻ nhỏ ngang):**
- Tổng số đơn: X
- Tổng doanh thu từ khách này: Xđ
- Đơn gần nhất: dd/MM/yyyy

## TÍNH NĂNG ĐẶC BIỆT
- Click SĐT → copy vào clipboard
- Tìm kiếm real-time (debounce 300ms)
- Badge "VIP" nếu orderCount ≥ 5
```

---

## Prompt G — Quản Lý Voucher

```
Bạn là senior React/Next.js developer. Hãy xây dựng trang quản lý voucher/mã giảm giá cho Admin Panel HUNI.

## FILES CẦN TẠO
- src/app/admin/vouchers/page.jsx
- src/app/admin/vouchers/components/VouchersTable.jsx
- src/app/admin/vouchers/components/CreateVoucherModal.jsx
- src/app/admin/vouchers/components/VoucherStatusBadge.jsx

## API SỬ DỤNG
- GET /api/admin/vouchers
- POST /api/admin/vouchers

## UI CẦN XÂY DỰNG

### 1. Header
- Tiêu đề "Quản lý Voucher"
- Nút "+ Tạo voucher mới" (primary) → mở CreateVoucherModal

### 2. VouchersTable
Columns:
| Cột | Nội dung |
|-----|---------|
| Mã voucher | code (monospace font, copy khi click) |
| Loại | Badge: "% Phần trăm" hoặc "VND Cố định" |
| Mức giảm | discount (% hoặc VNĐ cụ thể) |
| Đơn tối thiểu | minOrder (VND) hoặc "Không giới hạn" |
| Giới hạn giảm | maxDiscount (VND) hoặc "—" |
| Đã dùng / Giới hạn | usedCount / usageLimit (hoặc "∞") |
| Hết hạn | expiresAt (dd/MM/yyyy) hoặc "Không HH" |
| Trạng thái | VoucherStatusBadge |
| Hành động | Nút "Tắt" / "Bật" (toggle active) |

### 3. VoucherStatusBadge
- active + chưa hết hạn → chip xanh "Hoạt động"
- active = false → chip xám "Đã tắt"
- expiresAt < now → chip đỏ "Hết hạn"
- usedCount >= usageLimit → chip cam "Đã dùng hết"

### 4. CreateVoucherModal
**Form fields:**
| Field | UI | Ràng buộc |
|-------|-----|-----------|
| Mã voucher | Input (auto uppercase khi gõ) | min 2, max 50 |
| Loại giảm | Radio: "Phần trăm (%)" hoặc "Số tiền cố định (đ)" | required |
| Mức giảm | Number input + đơn vị % hoặc đ | min 1 |
| Đơn hàng tối thiểu | Number input (VND) | ≥ 0 |
| Giảm tối đa (cho %) | Number input (VND) | optional, nullable |
| Giới hạn lượt dùng | Number input | optional, null = không giới hạn |
| Ngày hết hạn | Date picker | optional |
| Kích hoạt ngay | Toggle | default ON |

**Preview real-time:**
"Voucher HUNI2026: Giảm 5% tối đa 5.000.000đ cho đơn từ 0đ, còn hiệu lực đến 31/12/2026"

**Nút:** "Tạo voucher" → POST /api/admin/vouchers → toast + refresh table

### 5. Thống kê tổng quan (banner trên bảng)
- 🟢 Đang hoạt động: X voucher
- 🔴 Hết hạn: X voucher
- 📊 Tổng lượt đã dùng: X

## LƯU Ý KỸ THUẬT
- Mã voucher auto-uppercase realtime khi người dùng gõ
- Nếu type = "percentage" → hiện thêm field "Giảm tối đa"
- Confirm trước khi tắt voucher đang dùng nhiều
```

---

## Thứ Tự Thực Hiện

```
Thứ tự đề xuất để AI agent thực thi:

PHASE 1 — FOUNDATION (làm trước)
  → Prompt A: Layout + Auth Guard
  (Phải có trước, các prompt khác đều phụ thuộc vào layout này)

PHASE 2 — CORE PAGES (theo thứ tự ưu tiên vận hành)
  → Prompt B: Dashboard (tổng quan, nhìn thấy tình hình ngay)
  → Prompt C: Đơn Hàng (nghiệp vụ quan trọng nhất)
  → Prompt D: Báo Giá (leads B2B)

PHASE 3 — CONTENT & CUSTOMER
  → Prompt E: Sản Phẩm (quản lý catalog)
  → Prompt F: Khách Hàng (CRM cơ bản)
  → Prompt G: Voucher (marketing)

MỖI PROMPT NÊN THỰC HIỆN THEO QUY TRÌNH:
  1. Đọc API_CONTRACT.md (đặc biệt phần liên quan)
  2. Đọc prisma/schema.prisma để hiểu data shape
  3. Viết code theo prompt
  4. Chạy npm run dev kiểm tra không có lỗi
  5. Test thử API call bằng cách điều hướng trang admin
```

---

## Ghi Chú Chung Cho AI Agent

```
### STACK BẮT BUỘC DÙNG
- Next.js 15 App Router (PHẢI đọc node_modules/next/dist/docs/ trước khi code)
- shadcn/ui: Sheet, Dialog, Badge, Button, Input, Select, Tabs, Toast
- Tailwind CSS (không được dùng CSS custom nhiều)
- Recharts cho biểu đồ
- react-hook-form + zod cho form

### PATTERN BẮT BUỘC
// Server Component fetch data:
async function getData() {
  const res = await fetch('/api/admin/...', {
    headers: { cookie: ... }, // forward session cookie
    cache: 'no-store'
  });
  return res.json();
}

// Client Component mutation:
const handleUpdate = async () => {
  const res = await fetch('/api/admin/orders/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes })
  });
  if (res.ok) {
    toast.success('✅ Cập nhật thành công');
    router.refresh(); // refresh Server Component data
  }
};

### FORMAT TIỀN VND
const formatVND = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

### FORMAT NGÀY GIỜ
const formatDate = (date) => new Date(date).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

### EMPTY STATE
Mỗi bảng phải có empty state: icon minh hoạ + text "Chưa có dữ liệu" khi kết quả rỗng.

### LOADING STATE
Dùng Suspense + loading.jsx skeleton, KHÔNG dùng global spinner.

### ERROR HANDLING
Mọi fetch call đều cần try/catch, toast error khi thất bại.
```

---

*Tài liệu này được tạo từ phân tích source code thực tế của dự án HUNI · 01/10/2026*
*Sử dụng cùng với API_CONTRACT.md để tham chiếu chi tiết API*
