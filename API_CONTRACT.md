# 📋 API CONTRACT — HUNI / HDC FASHION

> **Phiên bản:** v2.0 (Cập nhật từ source code thực tế 01/10/2026)
> **Tech stack:** Next.js 15 App Router · PostgreSQL (Supabase) · Prisma ORM · NextAuth v5 (JWT)
> **Base URL:** `https://hunistore.com` (production) | `http://localhost:3000` (dev)
> **Content-Type:** `application/json`
> **Auth:** JWT session cookie (NextAuth) — endpoint có 🔒 yêu cầu đăng nhập · 🔒 ADMIN yêu cầu role ADMIN

---

## 📑 Mục Lục

1. [Quy Ước Chung](#1-quy-ước-chung)
2. [Auth — Xác Thực](#2-auth--xác-thực)
3. [Orders — Đơn Hàng](#3-orders--đơn-hàng)
4. [Quotes — Báo Giá](#4-quotes--báo-giá)
5. [Tracking — Tra Cứu Đơn](#5-tracking--tra-cứu-đơn)
6. [Chat — AI Tư Vấn](#6-chat--ai-tư-vấn)
7. [Products — Sản Phẩm](#7-products--sản-phẩm)
8. [Reviews — Đánh Giá](#8-reviews--đánh-giá)
9. [Admin — Quản Trị](#9-admin--quản-trị)
10. [Database Schema](#10-database-schema)
11. [Error Codes Reference](#11-error-codes-reference)
12. [Security Notes](#12-security-notes)

---

## 1. Quy Ước Chung

### Response Envelope

```json
// Thành công
{ "success": true, "message": "...", "data": { ... } }

// Thất bại
{
  "success": false,
  "error": "Mô tả lỗi tiếng Việt",
  "details": [{ "field": "email", "message": "Email không hợp lệ" }]
}
```

### HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request — Validation fail |
| `401` | Unauthorized — Chưa đăng nhập |
| `403` | Forbidden — Không đủ quyền |
| `404` | Not Found |
| `409` | Conflict — Trùng lặp (email, slug, sku, voucher code) |
| `429` | Rate Limit |
| `500` | Internal Server Error |

### Rate Limiting (In-memory — 1 instance)

| Endpoint | Giới hạn |
|----------|---------|
| `POST /api/orders` | 5 req / IP / giờ |
| `POST /api/chat` | Giới hạn bởi Gemini API |
| Khác | Chưa có — TODO: Upstash Redis |

### Phone Normalization

Chấp nhận: `0987654321` / `0987.654.321` / `+84987654321` → Output: `0987654321` (10–11 số)

---

## 2. Auth — Xác Thực

### 2.1 `POST /api/register` — Đăng ký tài khoản

**Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nva@company.vn",
  "phone": "0987654321",
  "password": "matkhau123"
}
```

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `fullName` | ✅ | min 2, max 100 |
| `email` | ✅ | email hợp lệ, unique |
| `phone` | ✅ | 10–11 số |
| `password` | ✅ | min 6, max 100 |

**Response `201`:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": { "id": "cm...", "email": "nva@company.vn", "fullName": "Nguyễn Văn A" }
}
```

**Response `409`:** `"Email này đã được đăng ký"`

---

### 2.2 `POST /api/auth/[...nextauth]` — Đăng nhập (NextAuth)

Frontend dùng `signIn()` từ `next-auth/react`.

**JWT Session payload:**
```json
{
  "user": { "id": "cm...", "name": "Nguyễn Văn A", "email": "...", "role": "CUSTOMER", "avatar": null }
}
```

**Session:** JWT stateless, maxAge 30 ngày.

---

## 3. Orders — Đơn Hàng

### 3.1 `POST /api/orders` — Tạo đơn hàng

> ⚠️ **Server-side price guard:** Server tính lại giá từ `productId + quantity`. Client gửi `unitPrice` để đối chiếu — lệch >1% → reject.
> Phí logo: Server tự cộng thêm **15.000đ/chiếc** nếu `customLogo` có giá trị.
> Rate limit: **5 đơn / IP / giờ**.

**Request:**
```json
{
  "customer": {
    "fullName": "Công Ty ABC",
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
      "customLogo": { "url": "https://...", "position": "chest-left", "width": 8, "height": 5 }
    }
  ],
  "voucherCode": "HUNI2026",
  "paymentMethod": "vietqr",
  "notes": "Giao hàng trước 15/10",
  "vatInfo": {
    "taxCode": "0123456789",
    "companyName": "Công Ty TNHH ABC",
    "companyAddress": "123 Nguyễn Trãi, Q.1, TP.HCM",
    "email": "ketoan@abc.com"
  }
}
```

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `customer.fullName` | ✅ | min 2, max 100 |
| `customer.phone` | ✅ | 10–11 số |
| `customer.email` | ❌ | email hợp lệ hoặc rỗng |
| `customer.address` | ✅ | không rỗng |
| `items` | ✅ | min 1, max 50 |
| `items[].productId` | ✅ | phải tồn tại trong PRODUCTS |
| `items[].quantity` | ✅ | integer, min 5, max 100.000 |
| `items[].unitPrice` | ✅ | integer ≥ 0 (server đối chiếu) |
| `paymentMethod` | ✅ | `"vietqr"` \| `"deposit30"` \| `"freesample"` |
| `voucherCode` | ❌ | max 50 ký tự |
| `notes` | ❌ | max 500 |
| `vatInfo.taxCode` | ✅* | min 1, max 50 |
| `vatInfo.companyAddress` | ✅* | min 1, max 500 |
| `vatInfo.email` | ✅* | email hợp lệ |

**Response `201`:**
```json
{
  "success": true,
  "message": "Đơn hàng đã được tiếp nhận",
  "order": {
    "id": "cm456def",
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

**Side effects:** Gửi email admin + email xác nhận khách (background, không block response).

---

### 3.2 `GET /api/orders` 🔒 — Danh sách đơn (RBAC 2 tầng)

| Caller | Điều kiện | Kết quả |
|--------|-----------|---------|
| Chưa đăng nhập | — | `401` |
| CUSTOMER | không có `?mine=true` | `403` |
| CUSTOMER | `?mine=true` | Đơn của chính tài khoản |
| ADMIN | bất kỳ | Toàn bộ đơn |

**Query params:**

| Param | Mô tả |
|-------|-------|
| `status` | Filter theo OrderStatus |
| `limit` | Mặc định 20, max 100 |
| `page` | Mặc định 1 |
| `mine` | `true` — CUSTOMER xem đơn của mình |

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "total": 42,
  "page": 1,
  "totalPages": 3,
  "orders": [ { "id": "...", "orderNumber": "HN-...", "status": "PENDING", "customer": {...}, "items": [...] } ]
}
```

---

### 3.3 `OrderStatus` Enum

| Giá trị | Ý nghĩa |
|---------|---------|
| `PENDING` | Mới tiếp nhận |
| `QUOTED` | Đã báo giá |
| `CONFIRMED` | Đã xác nhận |
| `PRODUCING` | Đang sản xuất |
| `SHIPPED` | Đã giao vận chuyển |
| `COMPLETED` | Hoàn thành |
| `CANCELLED` | Đã huỷ |

---

## 4. Quotes — Báo Giá

### 4.1 `POST /api/quotes` — Gửi yêu cầu báo giá

**Request:**
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0909123456",
  "email": "nvb@school.edu.vn",
  "company": "Trường THPT Nguyễn Du",
  "category": "school",
  "quantity": 500,
  "estimatedPrice": 300000,
  "notes": "Cần thiết kế logo riêng"
}
```

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `fullName` | ✅ | min 2, max 100 |
| `phone` | ✅ | 10–11 số |
| `category` | ✅ | `polo` \| `shirt` \| `suit` \| `golf` \| `school` \| `accessories` |
| `quantity` | ✅ | integer, min 10 |
| `email` | ❌ | email hoặc rỗng |
| `estimatedPrice` | ❌ | integer ≥ 0 |
| `notes` | ❌ | max 500 |

**Response `201`:**
```json
{ "success": true, "message": "Yêu cầu báo giá đã được tiếp nhận", "quoteId": "cm..." }
```

---

### 4.2 `QuoteStatus` Enum

| Giá trị | Ý nghĩa |
|---------|---------|
| `NEW` | Mới gửi |
| `CONTACTED` | Đã liên hệ |
| `QUOTED` | Đã gửi báo giá |
| `CONVERTED` | Đã chuyển thành đơn hàng |
| `CLOSED` | Đóng |

---

## 5. Tracking — Tra Cứu Đơn

### 5.1 `GET /api/tracking?code=...`

**Query params:** `code` — Mã đơn (`HN-261001-7823`) hoặc SĐT (`0987654321`)

Tìm theo `orderNumber` (uppercase) HOẶC SĐT khách → trả đơn gần nhất.

**Response `200`:**
```json
{
  "success": true,
  "order": {
    "id": "...", "orderNumber": "HN-261001-7823", "status": "PRODUCING",
    "customer": { "fullName": "Công Ty ABC", "phone": "0987654321" },
    "items": [...]
  }
}
```

**Response `200` (không tìm thấy):** `{ "success": true, "order": null }`

---

## 6. Chat — AI Tư Vấn

### 6.1 `POST /api/chat`

**Engine:** Gemini 2.5 Flash + fallback model + retry (0ms → 500ms → 1500ms).

**Request:**
```json
{
  "messages": [
    { "role": "user", "text": "Giá áo polo 200 cái?" },
    { "role": "model", "text": "Dạ, 200 áo polo giá 135.000đ/chiếc..." },
    { "role": "user", "text": "Có thêu logo không?" }
  ]
}
```

**Quy tắc:** Max 10 messages cuối, mỗi message max 1.000 ký tự.

**Response `200`:**
```json
{ "reply": "Dạ, HDC hỗ trợ thêu logo miễn phí từ 30 áo ạ 😊" }
```

> Luôn trả HTTP 200 kể cả khi AI fail — fallback sang tin nhắn hướng dẫn hotline.

---

## 7. Products — Sản Phẩm

> **Chiến lược fallback:** GET endpoints tự động fallback sang `STATIC_PRODUCTS` nếu DB chưa seed.

### 7.1 `GET /api/products` — Danh sách sản phẩm (Public)

**Query params:**

| Param | Mô tả | Mặc định |
|-------|-------|---------|
| `category` | Filter category ID | — |
| `search` | Tìm text trong title, description, material | — |
| `priceMin` | Giá từ (VND) | — |
| `priceMax` | Giá đến (VND) | — |
| `sort` | `popular` \| `priceAsc` \| `priceDesc` \| `rating` \| `discount` | `popular` |
| `page` | Số trang | `1` |
| `limit` | Items/trang (max 48) | `12` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "products": [ { "id": "...", "slug": "...", "sku": "...", "title": "...", "price": 185000, ... } ],
    "total": 40, "page": 1, "totalPages": 4
  }
}
```

---

### 7.2 `GET /api/products/[id]` — Chi tiết sản phẩm (Public)

`[id]` có thể là `id` (cuid), `slug`, hoặc `sku`.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "cm...", "slug": "ao-polo-doanh-nghiep-hdc-classic-gold",
    "sku": "HN-POLO-01", "title": "Áo Polo Doanh Nghiệp HDC Classic Gold",
    "category": "corporate", "material": "Pique Cá Sấu Cotton Compact 4 Chiều",
    "price": 185000, "originalPrice": 245000,
    "images": ["/images/uniform_polo_corporate.jpg"],
    "features": ["..."], "colors": [{"name": "Xanh Navy", "code": "#0B2042"}],
    "sizes": ["S","M","L","XL","2XL"],
    "wholesaleTiers": [{"min": 10, "max": 49, "price": 185000, "label": "10-49 áo"}],
    "published": true, "featured": true
  }
}
```

---

### 7.3 `POST /api/products` 🔒 ADMIN — Tạo sản phẩm

**Request:**
```json
{
  "slug": "ao-polo-doanh-nghiep-hdc-classic-gold",
  "sku": "HN-POLO-01",
  "title": "Áo Polo Doanh Nghiệp HDC Classic Gold",
  "description": "Mô tả chi tiết sản phẩm...",
  "category": "corporate",
  "material": "Pique Cá Sấu Cotton Compact 4 Chiều",
  "price": 185000,
  "originalPrice": 245000,
  "images": ["/images/uniform_polo_corporate.jpg"],
  "features": ["Vải Pique thoáng khí", "Kháng khuẩn ion bạc"],
  "colors": [{"name": "Xanh Navy", "code": "#0B2042"}],
  "sizes": ["S","M","L","XL","2XL"],
  "wholesaleTiers": [{"min": 10, "max": 49, "price": 185000, "label": "10-49 áo"}],
  "published": true,
  "featured": false
}
```

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `slug` | ✅ | min 2, max 200, unique |
| `sku` | ✅ | min 2, max 50, unique |
| `title` | ✅ | min 2, max 200 |
| `description` | ✅ | min 5 |
| `category` | ✅ | không rỗng |
| `price` | ✅ | integer ≥ 0 |
| `images` | ✅ | array, min 1 phần tử |
| `material`, `originalPrice`, `features`, `colors`, `sizes`, `wholesaleTiers` | ❌ | tuỳ chọn |
| `published` | ❌ | boolean, default `true` |
| `featured` | ❌ | boolean, default `false` |

**Response `201`:** `{ "success": true, "message": "Tạo sản phẩm thành công", "data": { ... } }`

**Response `409`:** `"Đường dẫn (slug) đã tồn tại"` hoặc `"Mã sản phẩm (SKU) đã tồn tại"`

---

### 7.4 `PUT /api/products/[id]` 🔒 ADMIN — Cập nhật sản phẩm

Tất cả field là optional (partial update). Kiểm tra trùng `slug` / `sku` nếu có thay đổi.

**Response `200`:** `{ "success": true, "message": "Cập nhật sản phẩm thành công", "data": { ... } }`

---

### 7.5 `DELETE /api/products/[id]` 🔒 ADMIN — Xoá sản phẩm

**Response `200`:** `{ "success": true, "message": "Xóa sản phẩm thành công" }`

---

## 8. Reviews — Đánh Giá

### 8.1 `GET /api/reviews?productId=xxx` — Lấy đánh giá

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      { "id": "cm...", "rating": 5, "content": "Áo đẹp, giao nhanh!", "createdAt": "...",
        "user": { "fullName": "Công Ty ABC", "avatar": null } }
    ],
    "avgRating": 4.8, "total": 124
  }
}
```

---

### 8.2 `POST /api/reviews` 🔒 — Tạo đánh giá

> Chỉ user đã đăng nhập và đã có đơn hàng chứa `productId` mới được đánh giá.
> Mỗi user chỉ đánh giá 1 lần / sản phẩm (unique constraint DB).

**Request:**
```json
{ "productId": "huni-polo-pro", "rating": 5, "content": "Áo đẹp, chất vải tốt!" }
```

**Validation:**

| Field | Ràng buộc |
|-------|-----------|
| `productId` | string, không rỗng |
| `rating` | integer 1–5 |
| `content` | min 5, max 500 ký tự |

**Response `201`:** `{ "success": true, "message": "Đánh giá đã được ghi nhận", "data": { ... } }`

---

## 9. Admin — Quản Trị

> Tất cả endpoint `/api/admin/*` yêu cầu: **đăng nhập** (401) + **role ADMIN** (403).

### 9.1 `GET /api/admin/dashboard` 🔒 ADMIN — Thống kê tổng quan

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
      "orders": { "pending": 12, "producing": 8, "completed": 110, "cancelled": 3 },
      "quotes": { "new": 5 }
    },
    "recentOrders": [ { "id": "...", "orderNumber": "HN-...", "customer": {...}, "items": [...] } ],
    "recentQuotes": [ { "id": "...", "fullName": "...", "category": "polo", "quantity": 200 } ]
  }
}
```

---

### 9.2 `GET /api/admin/orders` 🔒 ADMIN — Danh sách đơn hàng (đầy đủ filter)

**Query params:**

| Param | Mô tả |
|-------|-------|
| `status` | Filter OrderStatus |
| `search` | Tìm theo orderNumber, tên/SĐT/email/công ty khách |
| `dateFrom` | ISO date — lọc từ ngày |
| `dateTo` | ISO date — lọc đến ngày |
| `page` | Mặc định 1 |
| `limit` | Mặc định 20, max 100 |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "total": 142, "page": 1, "limit": 20, "totalPages": 8,
    "summary": { "pending": 12, "producing": 8, "completed": 110, "totalRevenue": 387500000 }
  }
}
```

---

### 9.3 `PATCH /api/admin/orders/[id]` 🔒 ADMIN — Cập nhật đơn hàng

`[id]` có thể là `id` (cuid) hoặc `orderNumber`.

**Request:**
```json
{ "status": "CONFIRMED", "notes": "Đã xác nhận đặt cọc 30%" }
```

**Validation:**

| Field | Ràng buộc |
|-------|-----------|
| `status` | OrderStatus enum (optional) |
| `notes` | max 500, nullable (optional) |

**Response `200`:** `{ "success": true, "message": "Cập nhật trạng thái đơn hàng thành công", "data": { ... } }`

---

### 9.4 `GET /api/admin/quotes` 🔒 ADMIN — Danh sách báo giá

**Query params:**

| Param | Mô tả |
|-------|-------|
| `status` | Filter QuoteStatus |
| `category` | Filter category (polo, shirt, suit...) |
| `search` | Tìm theo tên/SĐT/email/công ty |
| `page` | Mặc định 1 |
| `limit` | Mặc định 20, max 100 |

**Response `200`:**
```json
{
  "success": true,
  "data": { "quotes": [...], "total": 89, "page": 1, "limit": 20, "totalPages": 5 }
}
```

---

### 9.5 `PATCH /api/admin/quotes/[id]` 🔒 ADMIN — Cập nhật báo giá

**Request:**
```json
{ "status": "QUOTED", "estimatedPrice": 175000, "notes": "Đã gửi bảng giá qua email" }
```

**Validation:**

| Field | Ràng buộc |
|-------|-----------|
| `status` | QuoteStatus enum (optional) |
| `estimatedPrice` | integer ≥ 0, nullable (optional) |
| `notes` | max 500, nullable (optional) |

---

### 9.6 `GET /api/admin/customers` 🔒 ADMIN — Danh sách khách hàng

**Query params:** `search`, `page`, `limit` (max 100)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "cm...", "fullName": "Công Ty ABC", "phone": "0987654321",
        "email": "...", "company": "...", "address": "...",
        "taxCode": "...", "notes": "...",
        "orderCount": 5, "quoteCount": 2,
        "createdAt": "...", "updatedAt": "..."
      }
    ],
    "total": 76, "page": 1, "limit": 20, "totalPages": 4
  }
}
```

---

### 9.7 `GET /api/admin/vouchers` 🔒 ADMIN — Danh sách voucher

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "vouchers": [
      {
        "id": "cm...", "code": "HUNI2026", "type": "percentage", "discount": 5,
        "minOrder": 0, "maxDiscount": 5000000, "usageLimit": null, "usedCount": 38,
        "active": true, "expiresAt": "2026-12-31T23:59:59.000Z"
      }
    ],
    "total": 3
  }
}
```

---

### 9.8 `POST /api/admin/vouchers` 🔒 ADMIN — Tạo voucher mới

**Request:**
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

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `code` | ✅ | min 2, max 50, tự động uppercase, unique |
| `type` | ✅ | `"percentage"` \| `"fixed"` |
| `discount` | ✅ | integer ≥ 1 |
| `minOrder` | ❌ | integer ≥ 0, default 0 |
| `maxDiscount` | ❌ | integer ≥ 0, nullable |
| `usageLimit` | ❌ | integer ≥ 1, nullable (null = không giới hạn) |
| `expiresAt` | ❌ | ISO date string, nullable |
| `active` | ❌ | boolean, default true |

**Response `201`:** `{ "success": true, "message": "Tạo voucher thành công", "data": { ... } }`

**Response `409`:** `"Mã voucher \"SALE30\" đã tồn tại trên hệ thống."`

---

## 10. Database Schema

### ERD tóm tắt

```
Customer ──< Order ──< OrderItem
Customer ──< Quote
User ──< Review
Voucher (độc lập)
Product (độc lập, có static fallback)
```

### Models

#### `customers`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `fullName` | String | |
| `phone` | String | unique, index |
| `email` | String? | index |
| `company`, `address`, `taxCode`, `notes` | String? | |

#### `orders`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `orderNumber` | String | unique, `HN-YYMMDD-XXXX` |
| `customerId` | String | FK → customers |
| `status` | OrderStatus | default PENDING |
| `paymentMethod` | String | vietqr / deposit30 / freesample |
| `subtotal`, `discount`, `total` | Int | VND, server-computed |
| `vatInfo` | Json? | `{taxCode, companyName, companyAddress, email}` |

#### `order_items`
| Field | Type | Ghi chú |
|-------|------|---------|
| `orderId` | String | FK → orders (Cascade) |
| `productId`, `productName` | String | snapshot tại thời điểm đặt |
| `quantity`, `unitPrice`, `subtotal` | Int | |
| `color`, `size` | String? | |
| `customLogo` | Json? | `{url, position, width, height}` |

#### `quotes`
| Field | Type | Ghi chú |
|-------|------|---------|
| `category` | String | polo/shirt/suit/golf/school/accessories |
| `quantity` | Int | |
| `estimatedPrice` | Int? | VND |
| `status` | QuoteStatus | default NEW |

#### `products`
| Field | Type | Ghi chú |
|-------|------|---------|
| `slug` | String | unique |
| `sku` | String | unique |
| `price`, `originalPrice` | Int | VND |
| `images`, `features`, `sizes` | String[] | |
| `colors`, `wholesaleTiers` | Json? | |
| `published` | Boolean | default true |
| `featured` | Boolean | default false |

#### `users`
| Field | Type | Ghi chú |
|-------|------|---------|
| `email` | String | unique |
| `passwordHash` | String | bcrypt rounds=10 |
| `role` | UserRole | CUSTOMER / ADMIN |
| `lastLoginAt` | DateTime? | cập nhật mỗi lần login |

#### `reviews`
| Field | Type | Ghi chú |
|-------|------|---------|
| `productId` | String | index |
| `userId` | String | FK → users (Cascade) |
| `rating` | SmallInt | 1–5 |
| Unique constraint | `[productId, userId]` | 1 user / 1 đánh giá / 1 sản phẩm |

#### `vouchers`
| Field | Type | Ghi chú |
|-------|------|---------|
| `code` | String | unique, uppercase |
| `type` | String | `percentage` \| `fixed` |
| `discount` | Int | % hoặc VND |
| `minOrder` | Int | default 0 |
| `maxDiscount` | Int? | trần giảm giá |
| `usageLimit` | Int? | null = không giới hạn |
| `usedCount` | Int | default 0 |
| `active` | Boolean | default true |
| `expiresAt` | DateTime? | |

---

## 11. Error Codes Reference

| HTTP | `error` | Nguyên nhân |
|------|---------|-------------|
| 400 | "Dữ liệu không hợp lệ" + `details[]` | Zod validation fail |
| 400 | "Thiếu mã đơn hàng" | GET /tracking thiếu `code` |
| 400 | "Giá sản phẩm không hợp lệ..." | Client price lệch >1% |
| 400 | "Mã ưu đãi không hợp lệ / hết hạn / bị tắt / đơn chưa đủ" | Voucher validation |
| 401 | "Vui lòng đăng nhập..." | Chưa có session |
| 403 | "Truy cập bị từ chối. Chỉ Quản trị viên..." | Role không phải ADMIN |
| 404 | "Không tìm thấy..." | Resource không tồn tại |
| 409 | "...đã tồn tại" | Duplicate email / slug / sku / voucher code |
| 429 | "Bạn đã gửi quá nhiều đơn..." | Rate limit 5 đơn/IP/giờ |
| 500 | "Không thể xử lý..." | Lỗi DB hoặc lỗi server |

---

## 12. Security Notes

### ✅ Đã có

| Biện pháp | Áp dụng |
|-----------|---------|
| Server-side price re-validation | `POST /api/orders` |
| Server-side voucher re-validation | `POST /api/orders` |
| Zod schema validation | Tất cả POST/PUT/PATCH |
| bcrypt hash rounds=10 | `POST /api/register` |
| JWT session 30 ngày | NextAuth stateless |
| Auth guard 2 tầng (401 + 403 RBAC) | `GET /api/orders`, `/api/admin/*` |
| Rate limit in-memory | `POST /api/orders` |
| SQL Injection safe | Prisma parameterized queries |
| Phone normalization | Tất cả endpoint nhận SĐT |
| Unique review constraint DB | `reviews(productId, userId)` |
| Logo fee server-computed (+15k/chiếc) | `POST /api/orders` |

### ⚠️ Còn cần bổ sung

| Vấn đề | Ưu tiên | Giải pháp |
|--------|---------|-----------|
| Rate limit in-memory (mất khi restart) | 🟡 | Upstash Redis |
| Chưa có rate limit cho `/api/register` | 🟡 | Thêm tương tự orders |
| Email chưa verify | 🟡 | `emailVerified` field + link xác nhận |
| `usedCount` voucher chưa tăng khi đặt hàng | 🟡 | Cập nhật trong `POST /api/orders` |
| Secret key có hardcode fallback | 🟢 | Bắt buộc env var trong prod |
| Chưa có input sanitization XSS | 🟢 | Strip HTML trước khi lưu DB |
| Review chưa check đã mua hàng chưa | 🟢 | Verify orderId trong `POST /api/reviews` |

---

*API Contract v2.0 — Tạo từ source code thực tế · HUNI/HDC Fashion · 01/10/2026*
