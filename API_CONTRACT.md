# 📋 HUNI / HDC FASHION — API CONTRACT

> **Version:** v3.0 | **Ngày cập nhật:** 01/10/2026
> **Đọc từ source code thực tế** — 18 route files, 100% chính xác
>
> **Base URL:** `https://hunistore.com` (prod) · `http://localhost:3000` (dev)
> **Content-Type:** `application/json` toàn bộ
> **Auth:** NextAuth v5 · JWT · Session cookie
>
> **Ký hiệu phân quyền:**
> - *(public)* — Không cần đăng nhập
> - 🔒 — Phải đăng nhập (`session.user.id`)
> - 🔒 ADMIN — Phải có `session.user.role === "ADMIN"`
> - ⚡ BYPASS — Trong `dev` / `ADMIN_PREVIEW_MODE=true` không cần auth

---

## 📑 Mục Lục

| # | Nhóm | Endpoints |
|---|------|-----------|
| 1 | [Quy Ước Chung](#1-quy-ước-chung) | Response format · HTTP codes · Rate limit · Phone |
| 2 | [Auth](#2-auth--xác-thực) | Register · Login (NextAuth) |
| 3 | [Orders](#3-orders--đơn-hàng) | POST tạo đơn · GET danh sách (RBAC) |
| 4 | [Quotes](#4-quotes--báo-giá) | POST gửi yêu cầu báo giá |
| 5 | [Tracking](#5-tracking--tra-cứu-đơn) | GET tra cứu theo mã / SĐT |
| 6 | [Chat](#6-chat--ai-tư-vấn) | POST Gemini AI |
| 7 | [Products](#7-products--sản-phẩm) | GET list · GET detail · POST · PUT · DELETE |
| 8 | [Reviews](#8-reviews--đánh-giá) | GET · POST (mua hàng mới được review) |
| 9 | [Admin — Orders](#9-admin--quản-lý-đơn-hàng) | GET list · PATCH cập nhật |
| 10 | [Admin — Quotes](#10-admin--quản-lý-báo-giá) | GET list · PATCH cập nhật |
| 11 | [Admin — Products](#11-admin--sản-phẩm-qua-products-api) | *(dùng chung /api/products)* |
| 12 | [Admin — Customers](#12-admin--quản-lý-khách-hàng) | GET list + orderCount/quoteCount |
| 13 | [Admin — Vouchers](#13-admin--quản-lý-voucher) | GET list · POST tạo mới |
| 14 | [Admin — Reviews](#14-admin--quản-lý-đánh-giá) | GET · PATCH duyệt/trả lời · DELETE |
| 15 | [Admin — Returns](#15-admin--quản-lý-đổi-trả--hoàn-tiền) | GET · PATCH · DELETE |
| 16 | [Admin — Dashboard](#16-admin--dashboard-thống-kê) | GET tổng quan |
| 17 | [Database Schema](#17-database-schema) | Tất cả models Prisma |
| 18 | [Enums Reference](#18-enums-reference) | Tất cả enum values |
| 19 | [Error Codes](#19-error-codes-reference) | Bảng lỗi đầy đủ |
| 20 | [Security Notes](#20-security-notes) | Đã làm · Còn thiếu |

---

## 1. Quy Ước Chung

### Response Envelope

```json
// ✅ Thành công
{
  "success": true,
  "message": "Mô tả kết quả",
  "data": { ... }          // hoặc field cụ thể tùy endpoint
}

// ❌ Thất bại
{
  "success": false,
  "error": "Mô tả lỗi rõ ràng bằng tiếng Việt",
  "details": [             // chỉ có khi validation fail
    { "field": "customer.email", "message": "Email không hợp lệ" }
  ]
}
```

### HTTP Status Codes

| Code | Ý nghĩa | Khi nào |
|------|---------|---------|
| `200` | OK | GET, PUT, PATCH thành công |
| `201` | Created | POST tạo mới thành công |
| `400` | Bad Request | Validation fail, thiếu param |
| `401` | Unauthorized | Chưa đăng nhập |
| `403` | Forbidden | Không đủ quyền (không phải ADMIN) |
| `404` | Not Found | Resource không tồn tại |
| `409` | Conflict | Trùng lặp (email, slug, sku, mã voucher) |
| `429` | Too Many Requests | Rate limit |
| `500` | Internal Server Error | Lỗi DB hoặc lỗi không xử lý được |

### Rate Limiting

| Endpoint | Giới hạn | Cơ chế |
|----------|---------|--------|
| `POST /api/orders` | **5 req / IP / giờ** | In-memory Map |
| `POST /api/chat` | Theo Gemini API quota | Google quota |
| Các endpoint khác | Không giới hạn | — |

Response khi vượt rate limit (`429`):
```json
{ "success": false, "error": "Bạn đã gửi quá nhiều đơn hàng. Vui lòng thử lại sau 59 phút." }
```
Header đi kèm: `Retry-After: <seconds>`

### Phone Normalization

Tất cả endpoint nhận SĐT đều tự normalize:

| Input | Output |
|-------|--------|
| `0987654321` | `0987654321` |
| `0987.654.321` | `0987654321` |
| `0987 654 321` | `0987654321` |
| `+84987654321` | `84987654321` |

Yêu cầu sau normalize: 10–11 chữ số.

### Auth Guard Pattern (trong tất cả admin endpoint)

```
Chưa đăng nhập → 401 "Vui lòng đăng nhập..."
Đăng nhập nhưng không phải ADMIN → 403 "Truy cập bị từ chối..."
Đăng nhập + ADMIN → Cho phép tiếp tục
```

### Admin Bypass (chỉ admin/returns và admin/reviews)

```js
const isBypass =
  process.env.NODE_ENV !== "production" ||
  process.env.ADMIN_PREVIEW_MODE === "true" ||
  process.env.REQUIRE_ADMIN_AUTH !== "true";
```

Nếu `isBypass = true` → bỏ qua kiểm tra role ADMIN (chỉ áp dụng cho `/api/admin/returns` và `/api/admin/reviews`).

---

## 2. Auth — Xác Thực

### 2.1 `POST /api/register` — Đăng ký tài khoản *(public)*

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nva@company.vn",
  "phone": "0987654321",
  "password": "matkhau123"
}
```

**Validation (Zod `registerSchema`):**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `fullName` | ✅ | min 2, max 100 ký tự |
| `email` | ✅ | email hợp lệ, **unique** |
| `phone` | ✅ | 10–11 số (sau normalize) |
| `password` | ✅ | min 6, max 100 ký tự |

**Response `201`:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": "cma1b2c3d4",
    "email": "nva@company.vn",
    "fullName": "Nguyễn Văn A"
  }
}
```

**Response `409`:** Email đã tồn tại
```json
{ "success": false, "error": "Email này đã được đăng ký" }
```

**Side effects:** Hash password với bcrypt rounds=10, tạo `User` với `role: "CUSTOMER"`.

---

### 2.2 `POST /api/auth/[...nextauth]` — Đăng nhập *(NextAuth Credentials)*

Frontend dùng `signIn("credentials", { email, password })` từ `next-auth/react`.

**Credentials payload:**
```json
{ "email": "nva@company.vn", "password": "matkhau123" }
```

**JWT Session payload (sau khi đăng nhập thành công):**
```json
{
  "user": {
    "id": "cma1b2c3d4",
    "name": "Nguyễn Văn A",
    "email": "nva@company.vn",
    "role": "CUSTOMER",
    "avatar": null
  },
  "expires": "2026-10-31T..."
}
```

**Side effects:** Cập nhật `lastLoginAt` trong DB mỗi lần login thành công.

**Cấu hình:**
- Strategy: JWT stateless
- MaxAge: **30 ngày**
- Pages: `signIn: "/login"`, `error: "/login"`

---

### 2.3 `GET /api/auth/session` — Lấy session hiện tại *(NextAuth built-in)*

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER", "avatar": null },
  "expires": "2026-10-31T..."
}
```

---

## 3. Orders — Đơn Hàng

### 3.1 `POST /api/orders` — Tạo đơn hàng mới *(public, có Rate Limit)*

> **Bảo mật quan trọng:**
> - Server **tự tính lại giá** từ `productId + quantity`. Client gửi `unitPrice` chỉ để đối chiếu — lệch >1% → reject 400.
> - Server **tự tính phí logo** +15.000đ/chiếc nếu `customLogo` có giá trị.
> - Voucher được **validate lại server-side** — không tin giá trị discount từ client.

**Request Body:**
```json
{
  "customer": {
    "fullName": "Công Ty TNHH ABC",
    "phone": "0987654321",
    "email": "order@abc.com",
    "company": "Công Ty TNHH ABC",
    "address": "123 Nguyễn Trãi, Q.1, TP.HCM"
  },
  "items": [
    {
      "productId": "huni-polo-pro",
      "productName": "Áo Polo Doanh Nghiệp HDC Classic Gold",
      "quantity": 100,
      "unitPrice": 135000,
      "color": "Xanh Navy Hoàng Gia",
      "size": "L",
      "customLogo": {
        "url": "https://cdn.abc.com/logo.png",
        "position": "chest-left",
        "width": 8,
        "height": 5
      }
    }
  ],
  "voucherCode": "HUNI2026",
  "paymentMethod": "vietqr",
  "notes": "Giao hàng trước ngày 15/10",
  "vatInfo": {
    "taxCode": "0123456789",
    "companyName": "Công Ty TNHH ABC",
    "companyAddress": "123 Nguyễn Trãi, Q.1, TP.HCM",
    "email": "ketoan@abc.com"
  }
}
```

**Validation (Zod `createOrderSchema`):**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `customer.fullName` | ✅ | min 2, max 100 |
| `customer.phone` | ✅ | 10–11 số |
| `customer.email` | ❌ | email hoặc rỗng |
| `customer.company` | ❌ | max 200 |
| `customer.address` | ✅ | không rỗng |
| `items` | ✅ | array, min 1, max 50 |
| `items[].productId` | ✅ | phải tồn tại trong PRODUCTS data |
| `items[].productName` | ✅ | min 1, max 300 |
| `items[].quantity` | ✅ | integer, min **5**, max 100.000 |
| `items[].unitPrice` | ✅ | integer ≥ 0 (server đối chiếu, sai >1% → reject) |
| `items[].color` | ❌ | string |
| `items[].size` | ❌ | string |
| `items[].customLogo` | ❌ | bất kỳ object → cộng thêm 15.000đ/chiếc |
| `voucherCode` | ❌ | max 50 ký tự (server re-validate) |
| `paymentMethod` | ✅ | `"vietqr"` \| `"deposit30"` \| `"freesample"` |
| `notes` | ❌ | max 500 ký tự |
| `vatInfo` | ❌ | object hoặc null |
| `vatInfo.taxCode` | ✅* | min 1, max 50 |
| `vatInfo.companyAddress` | ✅* | min 1, max 500 |
| `vatInfo.email` | ✅* | email hợp lệ |

*Bắt buộc nếu `vatInfo` được gửi kèm.

**Response `201`:**
```json
{
  "success": true,
  "message": "Đơn hàng đã được tiếp nhận",
  "order": {
    "id": "cma456def",
    "orderNumber": "HN-261001-7823",
    "subtotal": 13500000,
    "discount": 675000,
    "total": 12825000,
    "status": "PENDING",
    "voucherApplied": "HUNI2026"
  },
  "rateLimit": { "remaining": 4 }
}
```

**Response `400` — Price mismatch:**
```json
{
  "success": false,
  "error": "Giá sản phẩm không hợp lệ. Vui lòng tải lại trang và thử lại.",
  "details": [
    {
      "field": "items.huni-polo-pro.unitPrice",
      "message": "Giá sản phẩm \"Áo Polo...\" không khớp (client: 100000đ, server: 135000đ)"
    }
  ]
}
```

**Response `429` — Rate limit:**
```json
{ "success": false, "error": "Bạn đã gửi quá nhiều đơn hàng. Vui lòng thử lại sau 59 phút." }
```

**Side effects:**
- Upsert `Customer` theo SĐT (tạo mới nếu chưa có, cập nhật nếu đã có)
- Gửi email admin + email xác nhận khách (background, không block response)

---

### 3.2 `GET /api/orders` 🔒 — Danh sách đơn (RBAC 2 tầng)

| Caller | Truy vấn | Kết quả |
|--------|----------|---------|
| Chưa đăng nhập | bất kỳ | `401` |
| CUSTOMER | không có `?mine=true` | `403` |
| CUSTOMER | `?mine=true` | Chỉ đơn khớp email/SĐT tài khoản |
| ADMIN | bất kỳ | Toàn bộ đơn hàng |

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `status` | Filter theo OrderStatus | — |
| `limit` | Số bản ghi | `20` (max 100) |
| `page` | Số trang | `1` |
| `mine` | `true` → CUSTOMER xem đơn của mình | — |

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "orders": [
    {
      "id": "cma456def",
      "orderNumber": "HN-261001-7823",
      "status": "PENDING",
      "paymentMethod": "vietqr",
      "subtotal": 13500000,
      "discount": 675000,
      "total": 12825000,
      "notes": "Giao hàng trước 15/10",
      "vatInfo": null,
      "createdAt": "2026-10-01T09:00:00.000Z",
      "updatedAt": "2026-10-01T09:00:00.000Z",
      "customer": {
        "id": "cma789ghi",
        "fullName": "Công Ty TNHH ABC",
        "phone": "0987654321",
        "email": "order@abc.com",
        "company": "Công Ty TNHH ABC"
      },
      "items": [
        {
          "id": "cma111jkl",
          "productId": "huni-polo-pro",
          "productName": "Áo Polo Doanh Nghiệp HDC Classic Gold",
          "quantity": 100,
          "unitPrice": 135000,
          "color": "Xanh Navy Hoàng Gia",
          "size": "L",
          "customLogo": null,
          "subtotal": 13500000
        }
      ]
    }
  ]
}
```

---

## 4. Quotes — Báo Giá

### 4.1 `POST /api/quotes` — Gửi yêu cầu báo giá *(public)*

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0909123456",
  "email": "nvb@school.edu.vn",
  "company": "Trường THPT Nguyễn Du",
  "category": "school",
  "quantity": 500,
  "estimatedPrice": 300000,
  "notes": "Cần thiết kế logo riêng cho trường"
}
```

**Validation (Zod `createQuoteSchema`):**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `fullName` | ✅ | min 2, max 100 |
| `phone` | ✅ | 10–11 số |
| `email` | ❌ | email hoặc rỗng |
| `company` | ❌ | max 200 |
| `category` | ✅ | `polo` \| `shirt` \| `suit` \| `golf` \| `school` \| `accessories` |
| `quantity` | ✅ | integer, min **10** |
| `estimatedPrice` | ❌ | integer ≥ 0 (VND) |
| `notes` | ❌ | max 500 ký tự |

**Response `201`:**
```json
{
  "success": true,
  "message": "Yêu cầu báo giá đã được tiếp nhận",
  "quoteId": "cma222mno"
}
```

**Side effects:** Upsert `Customer` theo SĐT, tạo `Quote` với `status: "NEW"`.

---

## 5. Tracking — Tra Cứu Đơn

### 5.1 `GET /api/tracking?code=...` *(public)*

**Query params:**

| Param | Bắt buộc | Mô tả |
|-------|----------|-------|
| `code` | ✅ | Mã đơn hàng (`HN-261001-7823`) hoặc SĐT (`0987654321`) |

**Logic tìm kiếm:**
1. Tìm `orderNumber === code.toUpperCase()`
2. Nếu không có → Tìm `customer.phone === code`
3. Nếu tìm theo SĐT → trả về **đơn gần nhất** (`orderBy: createdAt desc`)

**Response `200` — Tìm thấy:**
```json
{
  "success": true,
  "order": {
    "id": "cma456def",
    "orderNumber": "HN-261001-7823",
    "status": "PRODUCING",
    "paymentMethod": "deposit30",
    "subtotal": 13500000,
    "discount": 675000,
    "total": 12825000,
    "createdAt": "2026-10-01T09:00:00.000Z",
    "customer": {
      "fullName": "Công Ty TNHH ABC",
      "phone": "0987654321"
    },
    "items": [...]
  }
}
```

**Response `200` — Không tìm thấy:** `{ "success": true, "order": null }`

**Response `400` — Thiếu code:** `{ "success": false, "error": "Thiếu mã đơn hàng" }`

---

## 6. Chat — AI Tư Vấn

### 6.1 `POST /api/chat` *(public)*

> **Engine:** Gemini 2.5 Flash với fallback cascade:
> `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash` → `gemini-flash-latest`
>
> **Retry:** Tự động retry 2 lần cho lỗi 503/429 (backoff: 0ms → 500ms → 1500ms)

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "text": "Giá áo polo 200 cái?" },
    { "role": "model", "text": "Dạ với 200 áo, giá 135.000đ/chiếc ạ." },
    { "role": "user", "text": "Có thêu logo không?" }
  ]
}
```

**Quy tắc:**
- `messages`: array, min 1 phần tử
- `role`: `"user"` hoặc `"model"`
- `text`: string, **tối đa 1.000 ký tự** / message (trimmed)
- Server chỉ lấy **10 messages cuối** (MAX_HISTORY = 10)

**Gemini config:** `temperature: 0.65`, `topP: 0.9`, `maxOutputTokens: 2048`

**Response `200` — Thành công:**
```json
{ "reply": "Dạ HDC hỗ trợ thêu logo tại 1 vị trí miễn phí từ 30 áo ạ 😊" }
```

**Response `200` — AI fail (luôn HTTP 200):**
```json
{ "reply": "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây hoặc gọi hotline 0984.959.586 ạ." }
```

> Chat endpoint **luôn trả HTTP 200**, kể cả khi AI fail — fallback sang tin nhắn hướng dẫn hotline để không vỡ UI.

---

## 7. Products — Sản Phẩm

> **Fallback strategy:** `GET` endpoints tự động dùng `STATIC_PRODUCTS` nếu DB chưa seed (DB count = 0 hoặc lỗi kết nối).

### 7.1 `GET /api/products` — Danh sách sản phẩm *(public)*

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `category` | Filter category ID (`corporate`, `bespoke_suit`...) | — |
| `search` | Tìm trong `title`, `description`, `material` | — |
| `priceMin` | Giá từ (VND, integer) | — |
| `priceMax` | Giá đến (VND, integer) | — |
| `sort` | `popular` \| `priceAsc` \| `priceDesc` \| `rating` \| `discount` | `popular` |
| `page` | Số trang | `1` |
| `limit` | Items/trang | `12` (max 48) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "cma...", "slug": "ao-polo-hdc-classic-gold", "sku": "HN-POLO-01",
        "title": "Áo Polo Doanh Nghiệp HDC Classic Gold",
        "category": "corporate", "material": "Pique Cá Sấu Cotton Compact 4 Chiều",
        "price": 185000, "originalPrice": 245000,
        "images": ["/images/uniform_polo_corporate.jpg"],
        "features": ["Vải Pique thoáng khí", "Kháng khuẩn ion bạc"],
        "colors": [{"name": "Xanh Navy Hoàng Gia", "code": "#0B2042"}],
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "wholesaleTiers": [{"min": 10, "max": 49, "price": 185000, "label": "10-49 áo"}],
        "published": true, "featured": true,
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "total": 40, "page": 1, "totalPages": 4
  }
}
```

---

### 7.2 `GET /api/products/[id]` — Chi tiết sản phẩm *(public)*

`[id]` có thể là: `id` (cuid), `slug`, hoặc `sku`. Server tìm theo cả 3.

**Response `200`:** Trả về object sản phẩm đầy đủ (cùng shape như trên).

**Response `404`:** `{ "success": false, "error": "Không tìm thấy sản phẩm" }`

---

### 7.3 `POST /api/products` 🔒 ADMIN — Tạo sản phẩm mới

**Request Body:**
```json
{
  "slug": "ao-polo-hdc-classic-gold",
  "sku": "HN-POLO-01",
  "title": "Áo Polo Doanh Nghiệp HDC Classic Gold",
  "description": "Áo polo đồng phục doanh nghiệp cao cấp...",
  "category": "corporate",
  "material": "Pique Cá Sấu Cotton Compact 4 Chiều",
  "price": 185000,
  "originalPrice": 245000,
  "images": ["/images/uniform_polo_corporate.jpg"],
  "features": ["Vải Pique thoáng khí", "Kháng khuẩn ion bạc"],
  "colors": [{"name": "Xanh Navy Hoàng Gia", "code": "#0B2042"}],
  "sizes": ["S", "M", "L", "XL", "2XL"],
  "wholesaleTiers": [
    {"min": 10, "max": 49, "price": 185000, "label": "10-49 áo"},
    {"min": 50, "max": 99, "price": 165000, "label": "50-99 áo"},
    {"min": 100, "max": 99999, "price": 135000, "label": "100+ áo"}
  ],
  "published": true,
  "featured": false
}
```

**Validation (Zod `productCreateSchema`):**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `slug` | ✅ | min 2, max 200, **unique** |
| `sku` | ✅ | min 2, max 50, **unique** |
| `title` | ✅ | min 2, max 200 |
| `description` | ✅ | min 5 ký tự |
| `category` | ✅ | không rỗng |
| `price` | ✅ | integer ≥ 0 (VND) |
| `images` | ✅ | array string, min 1 phần tử |
| `material` | ❌ | max 200, nullable |
| `originalPrice` | ❌ | integer ≥ 0, nullable |
| `features` | ❌ | array string, default `[]` |
| `colors` | ❌ | bất kỳ (thường `[{name, code}]`) |
| `sizes` | ❌ | array string, default `[]` |
| `wholesaleTiers` | ❌ | bất kỳ (thường `[{min, max, price, label}]`) |
| `published` | ❌ | boolean, default `true` |
| `featured` | ❌ | boolean, default `false` |

**Response `201`:** `{ "success": true, "message": "Tạo sản phẩm thành công", "data": { ...product } }`

**Response `409`:**
```json
{ "success": false, "error": "Đường dẫn (slug) \"ao-polo-hdc-classic-gold\" đã tồn tại." }
```

---

### 7.4 `PUT /api/products/[id]` 🔒 ADMIN — Cập nhật sản phẩm

Tất cả field là **optional** (Partial update). Kiểm tra trùng `slug`/`sku` nếu thay đổi.

`[id]` có thể là `id` (cuid) hoặc `slug`.

**Response `200`:** `{ "success": true, "message": "Cập nhật sản phẩm thành công", "data": { ...product } }`

**Response `404`:** `{ "success": false, "error": "Không tìm thấy sản phẩm để cập nhật" }`

---

### 7.5 `DELETE /api/products/[id]` 🔒 ADMIN — Xoá sản phẩm

`[id]` có thể là `id` hoặc `slug`.

**Response `200`:** `{ "success": true, "message": "Xóa sản phẩm thành công" }`

---

## 8. Reviews — Đánh Giá

### 8.1 `GET /api/reviews?productId=...` *(public, nhưng trả thêm metadata nếu đăng nhập)*

**Query params:**

| Param | Bắt buộc | Mô tả |
|-------|----------|-------|
| `productId` | ✅ | ID sản phẩm |

**Logic canReview:**
- `ADMIN` → `canReview: true` (luôn)
- CUSTOMER đã đăng nhập → kiểm tra `OrderItem` có `productId` khớp email/SĐT user → `canReview: hasOrdered`
- Chưa đăng nhập → `canReview: false`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "cma...",
        "rating": 5,
        "content": "Áo đẹp, chất vải tốt, giao nhanh!",
        "createdAt": "2026-09-01T14:00:00.000Z",
        "user": { "fullName": "Công Ty ABC", "name": "Công Ty ABC", "avatar": null }
      }
    ],
    "avgRating": 4.8,
    "total": 124
  },
  "reviews": [...],
  "avgRating": 4.8,
  "total": 124,
  "canReview": true,
  "hasOrdered": true,
  "isAuthenticated": true
}
```

> **Lưu ý:** Response trả cả `data.reviews` và `reviews` ở root level — frontend có thể đọc từ cả hai.

**Response `400`:** `{ "error": "Thiếu thông tin productId" }`

---

### 8.2 `POST /api/reviews` 🔒 — Gửi đánh giá sản phẩm

> **Điều kiện:** Đã đăng nhập + đã có đơn hàng chứa `productId` (trừ ADMIN luôn được phép).
> Mỗi user chỉ đánh giá **1 lần / 1 sản phẩm** (unique constraint DB `[productId, userId]`).

**Request Body:**
```json
{
  "productId": "huni-polo-pro",
  "rating": 5,
  "content": "Áo đẹp, chất vải tốt, giao nhanh đúng hẹn!"
}
```

**Validation (inline, không dùng Zod):**

| Field | Ràng buộc |
|-------|-----------|
| `productId` | string, không rỗng |
| `rating` | number, 1–5 |
| `content` | string, min **5** ký tự |

**Response `201`:**
```json
{
  "success": true,
  "message": "Gửi đánh giá thành công",
  "review": {
    "id": "cma...",
    "rating": 5,
    "content": "Áo đẹp, chất vải tốt, giao nhanh đúng hẹn!",
    "createdAt": "2026-10-01T15:00:00.000Z",
    "user": { "name": "Nguyễn Văn A", "fullName": "Nguyễn Văn A", "avatar": null }
  },
  "data": { "review": { ...same } }
}
```

**Response `400`:** `{ "error": "Bạn đã gửi đánh giá cho sản phẩm này rồi." }` (đánh giá trùng)

**Response `401`:** `{ "error": "Vui lòng đăng nhập để gửi đánh giá sản phẩm." }`

**Response `403`:** `{ "error": "Bạn chỉ có thể đánh giá sản phẩm đã từng đặt may tại HUNI." }`

> **Fallback:** Nếu DB lỗi → trả về simulated review với `id: "sim-{timestamp}"` (HTTP 201) để UX không bị gián đoạn.

---

## 9. Admin — Quản Lý Đơn Hàng

### 9.1 `GET /api/admin/orders` 🔒 ADMIN

**Query params:**

| Param | Mô tả |
|-------|-------|
| `status` | Filter OrderStatus |
| `search` | Tìm theo orderNumber, tên/SĐT/email/công ty khách |
| `dateFrom` | ISO date string — lọc từ ngày |
| `dateTo` | ISO date string — lọc đến ngày |
| `page` | Mặc định `1` |
| `limit` | Mặc định `20`, max `100` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "orders": [ ...full order objects with customer + items ],
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "summary": {
      "pending": 12,
      "producing": 8,
      "completed": 110,
      "totalRevenue": 387500000
    }
  }
}
```

> `summary` tính toàn bộ DB, không chỉ trang hiện tại.

---

### 9.2 `PATCH /api/admin/orders/[id]` 🔒 ADMIN

`[id]` có thể là `id` (cuid) hoặc `orderNumber`.

**Request Body:**
```json
{ "status": "CONFIRMED", "notes": "Đã xác nhận đặt cọc 30%" }
```

**Validation (Zod `adminOrderUpdateSchema`):**

| Field | Ràng buộc |
|-------|-----------|
| `status` | OrderStatus enum, optional |
| `notes` | max 500, nullable, optional |

**Response `200`:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái đơn hàng thành công",
  "data": { ...updatedOrder with customer + items }
}
```

**Response `404`:** `{ "success": false, "error": "Không tìm thấy đơn hàng" }`

---

## 10. Admin — Quản Lý Báo Giá

### 10.1 `GET /api/admin/quotes` 🔒 ADMIN

**Query params:**

| Param | Mô tả |
|-------|-------|
| `status` | Filter QuoteStatus |
| `category` | Filter danh mục (polo, shirt, suit, golf, school, accessories) |
| `search` | Tìm theo tên/SĐT/email/công ty |
| `page` | Mặc định `1` |
| `limit` | Mặc định `20`, max `100` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "quotes": [ ...quote objects with customer ],
    "total": 89,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### 10.2 `PATCH /api/admin/quotes/[id]` 🔒 ADMIN

**Request Body:**
```json
{ "status": "QUOTED", "estimatedPrice": 175000, "notes": "Đã gửi bảng giá qua email" }
```

**Validation (Zod `adminQuoteUpdateSchema`):**

| Field | Ràng buộc |
|-------|-----------|
| `status` | QuoteStatus enum, optional |
| `estimatedPrice` | integer ≥ 0, nullable, optional |
| `notes` | max 500, nullable, optional |

**Response `200`:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái báo giá thành công",
  "data": { ...updatedQuote with customer }
}
```

**Response `404`:** `{ "success": false, "error": "Không tìm thấy yêu cầu báo giá" }`

---

## 11. Admin — Sản Phẩm (qua `/api/products`)

Admin dùng chung các endpoint tại [Section 7](#7-products--sản-phẩm):
- `POST /api/products` 🔒 ADMIN
- `PUT /api/products/[id]` 🔒 ADMIN
- `DELETE /api/products/[id]` 🔒 ADMIN

---

## 12. Admin — Quản Lý Khách Hàng

### 12.1 `GET /api/admin/customers` 🔒 ADMIN

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `search` | Tìm tên/SĐT/email/công ty | — |
| `page` | Số trang | `1` |
| `limit` | Items/trang | `20` (max 100) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "cma789ghi",
        "fullName": "Công Ty TNHH ABC",
        "phone": "0987654321",
        "email": "order@abc.com",
        "company": "Công Ty TNHH ABC",
        "address": "123 Nguyễn Trãi, Q.1, TP.HCM",
        "taxCode": "0123456789",
        "notes": null,
        "orderCount": 5,
        "quoteCount": 2,
        "createdAt": "2026-08-01T00:00:00.000Z",
        "updatedAt": "2026-10-01T09:00:00.000Z"
      }
    ],
    "total": 76,
    "page": 1,
    "limit": 20,
    "totalPages": 4
  }
}
```

> `orderCount` và `quoteCount` được tính qua Prisma `_count` relation.

---

## 13. Admin — Quản Lý Voucher

### 13.1 `GET /api/admin/vouchers` 🔒 ADMIN

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "vouchers": [
      {
        "id": "cma...",
        "code": "HUNI2026",
        "type": "percentage",
        "discount": 5,
        "minOrder": 0,
        "maxDiscount": 5000000,
        "usageLimit": null,
        "usedCount": 38,
        "active": true,
        "expiresAt": "2026-12-31T23:59:59.000Z",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-10-01T00:00:00.000Z"
      }
    ],
    "total": 3
  }
}
```

---

### 13.2 `POST /api/admin/vouchers` 🔒 ADMIN

**Request Body:**
```json
{
  "code": "SALE30",
  "type": "percentage",
  "discount": 10,
  "minOrder": 5000000,
  "maxDiscount": 2000000,
  "usageLimit": 100,
  "expiresAt": "2026-12-31T23:59:59",
  "active": true
}
```

**Validation (Zod `voucherCreateSchema`):**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `code` | ✅ | min 2, max 50, **auto uppercase**, **unique** |
| `type` | ✅ | `"percentage"` \| `"fixed"` |
| `discount` | ✅ | integer ≥ 1 (% hoặc VND) |
| `minOrder` | ❌ | integer ≥ 0, default `0` |
| `maxDiscount` | ❌ | integer ≥ 0, nullable (dùng cho type=percentage) |
| `usageLimit` | ❌ | integer ≥ 1, nullable (null = không giới hạn) |
| `expiresAt` | ❌ | ISO date string, nullable |
| `active` | ❌ | boolean, default `true` |

**Response `201`:** `{ "success": true, "message": "Tạo voucher thành công", "data": { ...voucher } }`

**Response `409`:** `{ "success": false, "error": "Mã voucher \"SALE30\" đã tồn tại trên hệ thống." }`

---

## 14. Admin — Quản Lý Đánh Giá

> **Storage:** Dùng **in-memory array** `MEMORY_REVIEWS` + fallback từ Prisma DB nếu có.
> **Auth:** Có BYPASS trong dev/preview mode.

### 14.1 `GET /api/admin/reviews` 🔒 ADMIN ⚡ BYPASS

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `search` | Tìm tên/email/SĐT/tên SP/SKU/nội dung | — |
| `rating` | Filter 1–5 sao, `all` = tất cả | — |
| `status` | `APPROVED` \| `PENDING` \| `HIDDEN` | — |
| `page` | Số trang | `1` |
| `limit` | Items/trang | `12` (max 100) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev-001",
        "customerName": "Nguyễn Văn Hưng",
        "customerEmail": "hung.nv@techcorp.vn",
        "customerPhone": "0912.345.678",
        "avatar": null,
        "productId": "polo-doanh-nghiep-hdc-pro",
        "productTitle": "Áo Polo Doanh Nghiệp HDC Classic",
        "productSku": "HDC-POLO-CORP-01",
        "productImage": "/images/06_polo_01.jpg",
        "rating": 5,
        "content": "Chất vải polo cá sấu compact rất mát...",
        "status": "APPROVED",
        "adminReply": "Dạ HDC Fashion chân thành cảm ơn...",
        "repliedAt": "2026-09-28T10:30:00.000Z",
        "createdAt": "2026-09-27T14:20:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 12,
    "totalPages": 1,
    "stats": {
      "totalReviews": 5,
      "avgRating": "4.4",
      "pendingCount": 2,
      "fiveStarPercent": 60
    }
  }
}
```

**Review status values:**
| Value | Ý nghĩa |
|-------|---------|
| `APPROVED` | Đã duyệt, hiển thị công khai |
| `PENDING` | Chờ duyệt |
| `HIDDEN` | Ẩn (không hiện với khách) |

---

### 14.2 `PATCH /api/admin/reviews` 🔒 ADMIN ⚡ BYPASS

**Request Body:**
```json
{
  "id": "rev-001",
  "status": "APPROVED",
  "adminReply": "Dạ HDC Fashion chân thành cảm ơn anh Hưng!"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `id` | ✅ | ID đánh giá |
| `status` | ❌ | `APPROVED` \| `PENDING` \| `HIDDEN` |
| `adminReply` | ❌ | Phản hồi của admin (null để xoá reply) |

**Response `200`:**
```json
{
  "success": true,
  "message": "Cập nhật đánh giá thành công",
  "data": { ...updatedReview }
}
```

> Khi set `adminReply` → tự động set `repliedAt: new Date().toISOString()`.

---

### 14.3 `DELETE /api/admin/reviews` 🔒 ADMIN ⚡ BYPASS

**Request Body:**
```json
{ "ids": ["rev-001", "rev-002"] }
// hoặc xoá 1 record:
{ "id": "rev-001" }
```

**Response `200`:**
```json
{
  "success": true,
  "deletedCount": 2,
  "message": "Đã xoá 2 đánh giá thành công"
}
```

**Response `400`:** `{ "success": false, "error": "Không có danh sách ID cần xoá" }`

---

## 15. Admin — Quản Lý Đổi Trả & Hoàn Tiền

> **Storage:** Dùng **in-memory array** `MEMORY_RETURNS` (chưa có Prisma model).
> **Auth:** Có BYPASS trong dev/preview mode.
> **Return ID format:** `RT-YYMMDD-XXX` (VD: `RT-261001-001`)

### 15.1 `GET /api/admin/returns` 🔒 ADMIN ⚡ BYPASS

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `search` | Tìm id/orderNumber/tên KH/SĐT/email/công ty/tên SP/lý do | — |
| `type` | `EXCHANGE` \| `REFUND` \| `all` | — |
| `status` | `PENDING` \| `PROCESSING` \| `EXCHANGED` \| `REFUNDED` \| `REJECTED` \| `all` | — |
| `page` | Số trang | `1` |
| `limit` | Items/trang | `12` (max 100) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "returns": [
      {
        "id": "RT-261001-001",
        "orderNumber": "HN-260930-1001",
        "customerName": "Nguyễn Văn Hưng",
        "customerPhone": "0912.345.678",
        "customerEmail": "hung.nv@techcorp.vn",
        "company": "TechCorp Việt Nam",
        "productId": "polo-doanh-nghiep-hdc-pro",
        "productTitle": "Áo Polo Doanh Nghiệp HDC Classic",
        "quantity": 5,
        "type": "EXCHANGE",
        "reason": "Sai kích thước / form áo chật hơn bảng size",
        "details": "Có 5 nhân viên phòng kinh doanh mặc size L bị kích bắp tay...",
        "refundAmount": 0,
        "bankInfo": null,
        "evidenceImages": ["/images/06_polo_01.jpg"],
        "status": "PROCESSING",
        "adminNotes": "Đã liên hệ anh Hưng, nhân viên kho đã chuẩn bị 5 áo size XL...",
        "createdAt": "2026-10-01T08:30:00.000Z",
        "updatedAt": "2026-10-01T10:15:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 12,
    "totalPages": 1,
    "stats": {
      "totalRequests": 5,
      "pendingCount": 1,
      "processingCount": 1,
      "completedCount": 2,
      "totalRefunded": 2585000
    }
  }
}
```

**Return type values:**
| Value | Ý nghĩa |
|-------|---------|
| `EXCHANGE` | Đổi sản phẩm (1 đổi 1) |
| `REFUND` | Hoàn tiền về tài khoản |

**Return status values:**
| Value | Ý nghĩa |
|-------|---------|
| `PENDING` | Mới yêu cầu, chờ xử lý |
| `PROCESSING` | Đang xử lý |
| `EXCHANGED` | Đã đổi hàng xong |
| `REFUNDED` | Đã hoàn tiền xong |
| `REJECTED` | Từ chối yêu cầu |

**bankInfo object (khi type = REFUND):**
```json
{
  "bankName": "Vietcombank (VCB)",
  "accountNumber": "10188992288",
  "accountHolder": "TRAN THI BICH MAI"
}
```

---

### 15.2 `PATCH /api/admin/returns` 🔒 ADMIN ⚡ BYPASS

**Request Body:**
```json
{
  "id": "RT-261001-001",
  "status": "EXCHANGED",
  "adminNotes": "Đã gửi 5 áo size XL qua GHN, tracking: GHNA123456789",
  "refundAmount": 0
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `id` | ✅ | ID yêu cầu đổi trả |
| `status` | ❌ | ReturnStatus enum |
| `adminNotes` | ❌ | Ghi chú xử lý của admin |
| `refundAmount` | ❌ | Số tiền hoàn (VND, integer) |

**Response `200`:**
```json
{
  "success": true,
  "message": "Cập nhật yêu cầu đổi trả thành công",
  "data": { ...updatedReturn }
}
```

---

### 15.3 `DELETE /api/admin/returns` 🔒 ADMIN ⚡ BYPASS

**Request Body:**
```json
{ "ids": ["RT-261001-001", "RT-261001-002"] }
// hoặc:
{ "id": "RT-261001-001" }
```

**Response `200`:**
```json
{
  "success": true,
  "deletedCount": 2,
  "message": "Đã xoá 2 yêu cầu đổi trả thành công"
}
```

---

## 16. Admin — Dashboard Thống Kê

### 16.1 `GET /api/admin/dashboard` 🔒 ADMIN

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalOrders": 142,
      "totalRevenue": 387500000,
      "totalQuotes": 89,
      "totalCustomers": 76
    },
    "statusCounts": {
      "orders": {
        "pending": 12,
        "producing": 8,
        "completed": 110,
        "cancelled": 3
      },
      "quotes": {
        "new": 5
      }
    },
    "recentOrders": [
      {
        "id": "cma...", "orderNumber": "HN-261001-7823", "status": "PENDING",
        "customer": { "fullName": "...", "phone": "..." },
        "items": [...]
      }
    ],
    "recentQuotes": [
      {
        "id": "cma...", "fullName": "...", "company": "...",
        "category": "polo", "quantity": 200, "status": "NEW",
        "customer": { ... }
      }
    ]
  }
}
```

> `recentOrders`: 5 đơn gần nhất | `recentQuotes`: 5 báo giá gần nhất
> `totalRevenue`: tổng `total` của các đơn KHÔNG bị `CANCELLED`
> Mỗi query đều có `.catch(() => 0)` — không bao giờ crash nếu DB lỗi 1 phần

---

## 17. Database Schema

### ERD tóm tắt

```
Customer ──< Order ──< OrderItem
Customer ──< Quote
User ──< Review
Product (standalone, có static fallback)
Voucher (standalone)
```

> **Lưu ý:** `Return` và `Review` (admin) dùng in-memory, chưa có Prisma model.

### `customers`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `fullName` | String | |
| `phone` | String | **unique**, index |
| `email` | String? | index |
| `company` | String? | |
| `address` | String? | |
| `taxCode` | String? | |
| `notes` | String? | |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | auto |

### `orders`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `orderNumber` | String | **unique**, format `HN-YYMMDD-XXXX` |
| `customerId` | String | FK → customers |
| `status` | OrderStatus | default PENDING |
| `paymentMethod` | String | `vietqr` / `deposit30` / `freesample` |
| `subtotal` | Int | VND, server-computed |
| `discount` | Int | VND, server-computed, default 0 |
| `total` | Int | VND, server-computed |
| `notes` | String? | |
| `vatInfo` | Json? | `{taxCode, companyName?, companyAddress, email}` |

### `order_items`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `orderId` | String | FK → orders (onDelete: **Cascade**) |
| `productId` | String | ID sản phẩm (snapshot) |
| `productName` | String | Tên SP tại thời điểm đặt (snapshot) |
| `quantity` | Int | |
| `unitPrice` | Int | VND, server-verified |
| `color` | String? | |
| `size` | String? | |
| `customLogo` | Json? | `{url, position, width, height}` |
| `subtotal` | Int | VND |

### `quotes`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `customerId` | String? | FK → customers (optional) |
| `fullName` | String | |
| `phone` | String | index |
| `email` | String? | |
| `company` | String? | |
| `category` | String | polo/shirt/suit/golf/school/accessories |
| `quantity` | Int | |
| `estimatedPrice` | Int? | VND |
| `notes` | String? | |
| `status` | QuoteStatus | default NEW |

### `products`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `slug` | String | **unique** |
| `sku` | String | **unique** |
| `title` | String | |
| `description` | Text | |
| `category` | String | index |
| `material` | String? | |
| `price` | Int | VND |
| `originalPrice` | Int? | VND |
| `images` | String[] | mảng URL |
| `features` | String[] | |
| `colors` | Json? | `[{name, code}]` |
| `sizes` | String[] | |
| `wholesaleTiers` | Json? | `[{min, max, price, label}]` |
| `published` | Boolean | default true, index |
| `featured` | Boolean | default false |

### `users`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `email` | String | **unique**, index |
| `passwordHash` | String | bcrypt rounds=10 |
| `fullName` | String | |
| `phone` | String? | |
| `avatar` | String? | URL |
| `role` | UserRole | default CUSTOMER, index |
| `lastLoginAt` | DateTime? | cập nhật mỗi login |

### `reviews`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `productId` | String | index |
| `userId` | String | FK → users (onDelete: Cascade), index |
| `rating` | SmallInt | 1–5 |
| `content` | String | |
| `createdAt` | DateTime | |
| Unique | `[productId, userId]` | 1 user / 1 review / 1 SP |

### `vouchers`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `code` | String | **unique**, index |
| `type` | String | `percentage` \| `fixed` |
| `discount` | Int | % hoặc VND |
| `minOrder` | Int | default 0 |
| `maxDiscount` | Int? | trần giảm (dùng cho percentage) |
| `usageLimit` | Int? | null = không giới hạn |
| `usedCount` | Int | default 0 |
| `active` | Boolean | default true, index |
| `expiresAt` | DateTime? | |

---

## 18. Enums Reference

### OrderStatus
```
PENDING    → Mới tiếp nhận, chờ xử lý
QUOTED     → Đã báo giá, chờ xác nhận
CONFIRMED  → Khách đã xác nhận, chốt đơn
PRODUCING  → Đang may / sản xuất
SHIPPED    → Đã giao vận chuyển
COMPLETED  → Hoàn thành, đã nhận hàng
CANCELLED  → Đã huỷ
```

### QuoteStatus
```
NEW        → Mới gửi, chưa xử lý
CONTACTED  → Đã gọi điện / liên hệ
QUOTED     → Đã gửi báo giá cho khách
CONVERTED  → Đã chuyển thành đơn hàng
CLOSED     → Đóng (không có nhu cầu)
```

### UserRole
```
CUSTOMER   → Khách hàng thông thường
ADMIN      → Quản trị viên
```

### ReturnType *(in-memory, chưa có DB model)*
```
EXCHANGE   → Đổi sản phẩm (1 đổi 1)
REFUND     → Hoàn tiền về tài khoản ngân hàng
```

### ReturnStatus *(in-memory, chưa có DB model)*
```
PENDING    → Mới yêu cầu
PROCESSING → Đang xử lý
EXCHANGED  → Đã đổi hàng xong
REFUNDED   → Đã hoàn tiền xong
REJECTED   → Từ chối (kèm lý do trong adminNotes)
```

### ReviewStatus *(in-memory admin only)*
```
APPROVED   → Đã duyệt, hiển thị công khai
PENDING    → Chờ duyệt
HIDDEN     → Ẩn khỏi trang công khai
```

---

## 19. Error Codes Reference

| HTTP | `error` / `message` | Nguyên nhân |
|------|---------------------|-------------|
| 400 | "Dữ liệu không hợp lệ" + `details[]` | Zod validation fail |
| 400 | "Thiếu mã đơn hàng" | `GET /api/tracking` thiếu `code` |
| 400 | "Giá sản phẩm không hợp lệ..." | Client price lệch >1% server |
| 400 | "Mã ưu đãi không hợp lệ" | Voucher code không tồn tại |
| 400 | "Mã ưu đãi đã hết hạn" | `expiresAt < now` |
| 400 | "Mã ưu đãi đã bị vô hiệu hóa" | `active = false` |
| 400 | "Đơn hàng tối thiểu Xđ..." | `subtotal < voucher.minSubtotal` |
| 400 | "Bạn đã gửi đánh giá cho sản phẩm này rồi." | Duplicate review |
| 400 | "Thiếu ID đánh giá" | PATCH admin/reviews thiếu `id` |
| 400 | "Thiếu mã yêu cầu đổi trả" | PATCH admin/returns thiếu `id` |
| 401 | "Vui lòng đăng nhập..." | Không có session |
| 403 | "Truy cập bị từ chối. Chỉ Quản trị viên..." | Role không phải ADMIN |
| 403 | "Bạn chỉ có thể đánh giá sản phẩm đã từng đặt may..." | Chưa mua sản phẩm |
| 404 | "Không tìm thấy đơn hàng" | Order ID/number không tồn tại |
| 404 | "Không tìm thấy yêu cầu báo giá" | Quote ID không tồn tại |
| 404 | "Không tìm thấy sản phẩm" | Product ID/slug không tồn tại |
| 409 | "Email này đã được đăng ký" | Duplicate email register |
| 409 | "Đường dẫn (slug) đã tồn tại" | Duplicate product slug |
| 409 | "Mã sản phẩm (SKU) đã tồn tại" | Duplicate product SKU |
| 409 | "Mã voucher ... đã tồn tại" | Duplicate voucher code |
| 429 | "Bạn đã gửi quá nhiều đơn..." | Rate limit 5 đơn/IP/giờ |
| 500 | "Không thể xử lý..." | Lỗi DB hoặc unhandled error |

---

## 20. Security Notes

### ✅ Đã Có

| Biện pháp | Áp dụng tại |
|-----------|-------------|
| **Server-side price re-validation** | `POST /api/orders` — tính lại từ DB, reject lệch >1% |
| **Server-side logo fee** | `POST /api/orders` — +15.000đ/chiếc nếu customLogo |
| **Server-side voucher re-validation** | `POST /api/orders` — không tin discount từ client |
| **Zod validation** | Tất cả POST/PUT/PATCH có input |
| **bcrypt hash rounds=10** | `POST /api/register` |
| **JWT stateless session** | NextAuth, maxAge 30 ngày |
| **Auth guard 2 tầng (401 + 403 RBAC)** | `GET /api/orders`, tất cả `/api/admin/*` |
| **Rate limit in-memory** | `POST /api/orders` — 5 req/IP/giờ |
| **SQL Injection safe** | Prisma ORM — parameterized queries |
| **Phone normalization** | Tất cả endpoint nhận SĐT |
| **Review unique constraint (DB)** | `@@unique([productId, userId])` |
| **Purchase-verification cho review** | `POST /api/reviews` — check OrderItem trước |
| **lastLoginAt tracking** | NextAuth `authorize()` callback |
| **Product static fallback** | Không crash khi DB chưa seed |
| **Review simulated fallback** | Không crash UI khi DB lỗi |
| **Chat luôn HTTP 200** | Không vỡ UI khi Gemini fail |

### ⚠️ Còn Cần Bổ Sung

| Vấn đề | Ưu tiên | Giải pháp |
|--------|---------|-----------|
| Rate limit dùng in-memory (mất khi restart) | 🔴 | Upstash Redis |
| `usedCount` voucher không tăng khi đặt hàng | 🔴 | Cập nhật trong `POST /api/orders` |
| `admin/returns` và `admin/reviews` dùng in-memory | 🔴 | Thêm Prisma model `Return` + cột `status`/`adminReply` vào `Review` |
| Chưa có rate limit cho `POST /api/register` | 🟡 | Thêm tương tự orders |
| Email chưa verify | 🟡 | Field `emailVerified` + link xác nhận |
| Auth config có hardcode secret fallback | 🟡 | Bắt buộc env var trong production |
| Chưa có CSRF protection explicit | 🟡 | NextAuth tự xử lý form — kiểm tra lại fetch calls |
| Chưa có input sanitization XSS | 🟢 | Strip HTML trước khi lưu DB |

---

*📄 API Contract v3.0 — HUNI / HDC Fashion*
*Được tạo từ đọc toàn bộ 18 route files · 01/10/2026*
*Cập nhật khi thêm/sửa route hoặc schema*
