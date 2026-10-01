# 📋 API CONTRACT — HUNI / HDC FASHION

> **Phiên bản:** v1.0  
> **Cập nhật:** 2026-09-30  
> **Tech stack:** Next.js 15 App Router · PostgreSQL (Supabase) · Prisma ORM · NextAuth v5 (JWT)  
> **Base URL:** `https://hunistore.com` (production) | `http://localhost:3000` (dev)  
> **Content-Type:** `application/json` cho toàn bộ request/response  
> **Auth:** JWT session cookie (NextAuth) — các endpoint có 🔒 yêu cầu đăng nhập

---

## 📑 Mục Lục

1. [Quy Ước Chung](#1-quy-ước-chung)
2. [Auth — Xác Thực](#2-auth--xác-thực)
3. [Orders — Đơn Hàng](#3-orders--đơn-hàng)
4. [Quotes — Báo Giá](#4-quotes--báo-giá)
5. [Tracking — Tra Cứu Đơn](#5-tracking--tra-cứu-đơn)
6. [Chat — AI Tư Vấn](#6-chat--ai-tư-vấn)
7. [Products — Sản Phẩm (TODO)](#7-products--sản-phẩm-todo)
8. [Reviews — Đánh Giá (TODO)](#8-reviews--đánh-giá-todo)
9. [Admin — Quản Trị (TODO)](#9-admin--quản-trị-todo)
10. [Database Schema](#10-database-schema)
11. [Error Codes Reference](#11-error-codes-reference)
12. [Security Notes](#12-security-notes)

---

## 1. Quy Ước Chung

### Response Envelope

Mọi response đều theo chuẩn:

```json
// Thành công
{
  "success": true,
  "message": "...",        // (tuỳ endpoint)
  "data": { ... }          // hoặc field cụ thể
}

// Thất bại
{
  "success": false,
  "error": "Mô tả lỗi rõ ràng bằng tiếng Việt",
  "details": [             // (tuỳ endpoint - validation errors)
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

### HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| `200` | OK — Thành công (GET, PUT, PATCH) |
| `201` | Created — Tạo mới thành công (POST) |
| `400` | Bad Request — Dữ liệu không hợp lệ |
| `401` | Unauthorized — Chưa đăng nhập |
| `403` | Forbidden — Không đủ quyền |
| `404` | Not Found — Không tìm thấy |
| `409` | Conflict — Đã tồn tại (VD: email trùng) |
| `429` | Too Many Requests — Rate limit |
| `500` | Internal Server Error |

### Rate Limiting

| Endpoint | Giới hạn |
|----------|---------|
| `POST /api/orders` | 5 request / IP / giờ |
| `POST /api/chat` | Giới hạn bởi Gemini API quota |
| Các endpoint khác | Chưa có (TODO: thêm Upstash Redis) |

Response khi bị rate limit:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3540
```
```json
{
  "success": false,
  "error": "Bạn đã gửi quá nhiều đơn hàng. Vui lòng thử lại sau 59 phút."
}
```

### Validation — Phone

Server tự normalize SĐT: chấp nhận `0987654321`, `0987.654.321`, `0987 654 321`, `+84987654321`  
→ Output luôn là `0987654321` (10–11 số)

---

## 2. Auth — Xác Thực

### 2.1 `POST /api/register` — Đăng ký tài khoản

**Request Body:**

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
| `fullName` | ✅ | min 2, max 100 ký tự |
| `email` | ✅ | định dạng email hợp lệ, unique |
| `phone` | ✅ | 10–11 số (sau normalize) |
| `password` | ✅ | min 6, max 100 ký tự |

**Response `201`:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": "cm123abc",
    "email": "nva@company.vn",
    "fullName": "Nguyễn Văn A"
  }
}
```

**Response `409`** (email trùng):
```json
{
  "success": false,
  "error": "Email này đã được đăng ký"
}
```

---

### 2.2 `POST /api/auth/[...nextauth]` — Đăng nhập (NextAuth)

> Xử lý bởi NextAuth v5. Frontend dùng `signIn()` từ `next-auth/react`.

**Credentials Provider — Payload:**
```json
{
  "email": "nva@company.vn",
  "password": "matkhau123"
}
```

**Session JWT payload (sau khi đăng nhập):**
```json
{
  "user": {
    "id": "cm123abc",
    "name": "Nguyễn Văn A",
    "email": "nva@company.vn",
    "role": "CUSTOMER",
    "avatar": null
  }
}
```

**Session maxAge:** 30 ngày  
**Strategy:** JWT (stateless, không lưu DB)

---

### 2.3 `GET /api/auth/session` — Kiểm tra session (NextAuth)

```json
{
  "user": {
    "id": "cm123abc",
    "name": "Nguyễn Văn A",
    "email": "nva@company.vn",
    "role": "CUSTOMER",
    "avatar": null
  },
  "expires": "2026-10-30T..."
}
```

---

## 3. Orders — Đơn Hàng

### 3.1 `POST /api/orders` — Tạo đơn hàng mới

> ⚠️ **Bảo mật:** Server tự tính lại giá từ `productId + quantity`. Client gửi `unitPrice` chỉ để server đối chiếu — nếu lệch >1% sẽ bị từ chối.

**Request Body:**

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
      "customLogo": {
        "url": "https://...",
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
    "email": "kientoanchinhhung@abc.com"
  }
}
```

**Validation chi tiết:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `customer.fullName` | ✅ | min 2, max 100 |
| `customer.phone` | ✅ | 10–11 số |
| `customer.email` | ❌ | email hợp lệ hoặc rỗng |
| `customer.company` | ❌ | max 200 |
| `customer.address` | ✅ | không được rỗng |
| `items` | ✅ | min 1, max 50 items |
| `items[].productId` | ✅ | phải tồn tại trong PRODUCTS data |
| `items[].quantity` | ✅ | integer, min 5, max 100,000 |
| `items[].unitPrice` | ✅ | integer ≥ 0 (server đối chiếu) |
| `items[].color` | ❌ | string |
| `items[].size` | ❌ | string |
| `items[].customLogo` | ❌ | bất kỳ object |
| `voucherCode` | ❌ | max 50 ký tự (server re-validate) |
| `paymentMethod` | ✅ | `"vietqr"` \| `"deposit30"` \| `"freesample"` |
| `notes` | ❌ | max 500 ký tự |
| `vatInfo` | ❌ | object hoặc null |
| `vatInfo.taxCode` | ✅* | min 1, max 50 |
| `vatInfo.companyAddress` | ✅* | min 1, max 500 |
| `vatInfo.email` | ✅* | email hợp lệ |

> *Bắt buộc nếu `vatInfo` được gửi kèm

**Phí custom logo:** Server tự cộng thêm **15,000đ/chiếc** nếu `customLogo` có giá trị.

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
  "rateLimit": {
    "remaining": 4
  }
}
```

**Response `400`** (price mismatch):
```json
{
  "success": false,
  "error": "Giá sản phẩm không hợp lệ. Vui lòng tải lại trang và thử lại.",
  "details": [
    {
      "field": "items.huni-polo-pro.unitPrice",
      "message": "Giá sản phẩm \"Áo Polo Doanh Nghiệp HDC Classic Gold\" không khớp (client: 100000đ, server: 135000đ)"
    }
  ]
}
```

**Side effects:**
- Tạo `Customer` nếu SĐT chưa tồn tại, hoặc update thông tin nếu đã có
- Gửi email thông báo cho admin (nền - không block response)
- Gửi email xác nhận cho khách (nền - không block response)

---

### 3.2 `GET /api/orders` — Danh sách đơn hàng (🔒 Auth Guard & RBAC)

> 🔒 **Xác thực & Phân quyền:**
> - **Chưa đăng nhập:** Trả về `401 Unauthorized`.
> - **ADMIN:** Xem danh sách toàn bộ đơn hàng (hỗ trợ filter `status`, phân trang `page`, `limit`).
> - **CUSTOMER:** Chỉ được phép xem các đơn hàng của chính mình qua query `?mine=true`. Nếu người dùng không phải ADMIN cố tình gọi API lấy toàn bộ đơn hàng mà không có `?mine=true`, hệ thống sẽ trả về `403 Forbidden`.

**Query params:**

| Param | Bắt buộc | Mô tả |
|-------|----------|-------|
| `status` | ❌ | Filter theo `OrderStatus` enum |
| `limit` | ❌ | Số bản ghi (mặc định 20, tối đa 100) |
| `page` | ❌ | Trang hiện tại (mặc định 1) |
| `mine` | ❌ | `true` để lấy danh sách đơn của tài khoản đang đăng nhập |

**Ví dụ:** `GET /api/orders?status=PENDING&limit=10&page=1`

**Response `401`** (Chưa đăng nhập):
```json
{
  "success": false,
  "error": "Vui lòng đăng nhập để truy cập danh sách đơn hàng."
}
```

**Response `403`** (Không có quyền admin):
```json
{
  "success": false,
  "error": "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền xem danh sách đơn hàng hệ thống."
}
```

**Response `200`** (ADMIN hoặc CUSTOMER xem đơn của mình):
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "id": "cm456def",
      "orderNumber": "HN-261001-7823",
      "status": "PENDING",
      "paymentMethod": "vietqr",
      "subtotal": 13500000,
      "discount": 675000,
      "total": 12825000,
      "notes": "Giao hàng trước ngày 15/10",
      "vatInfo": null,
      "createdAt": "2026-10-01T16:00:00.000Z",
      "updatedAt": "2026-10-01T16:00:00.000Z",
      "customer": {
        "id": "cm789ghi",
        "fullName": "Công Ty ABC",
        "phone": "0987654321",
        "email": "order@abc.com",
        "company": "Công Ty TNHH ABC"
      },
      "items": [
        {
          "id": "cm111jkl",
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

### 3.3 `OrderStatus` Enum

```
PENDING    → Mới tiếp nhận, chờ xử lý
QUOTED     → Đã báo giá, chờ khách xác nhận
CONFIRMED  → Khách đã xác nhận, chốt đơn
PRODUCING  → Đang may / sản xuất
SHIPPED    → Đã giao vận chuyển
COMPLETED  → Hoàn thành, nhận hàng xong
CANCELLED  → Đã huỷ
```

---

## 4. Quotes — Báo Giá

### 4.1 `POST /api/quotes` — Gửi yêu cầu báo giá

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

**Validation:**

| Field | Bắt buộc | Ràng buộc |
|-------|----------|-----------|
| `fullName` | ✅ | min 2, max 100 |
| `phone` | ✅ | 10–11 số |
| `email` | ❌ | email hợp lệ hoặc rỗng |
| `company` | ❌ | max 200 |
| `category` | ✅ | `"polo"` \| `"shirt"` \| `"suit"` \| `"golf"` \| `"school"` \| `"accessories"` |
| `quantity` | ✅ | integer, min 10 |
| `estimatedPrice` | ❌ | integer ≥ 0 |
| `notes` | ❌ | max 500 ký tự |

**Response `201`:**
```json
{
  "success": true,
  "message": "Yêu cầu báo giá đã được tiếp nhận",
  "quoteId": "cm222mno"
}
```

**Side effects:**
- Tạo `Customer` nếu SĐT chưa tồn tại
- Tạo `Quote` với `status = "NEW"`

---

### 4.2 `QuoteStatus` Enum

```
NEW        → Mới gửi, chưa xử lý
CONTACTED  → Đã gọi điện / liên hệ
QUOTED     → Đã gửi báo giá cho khách
CONVERTED  → Đã chuyển thành đơn hàng thật
CLOSED     → Đóng (không có nhu cầu)
```

---

## 5. Tracking — Tra Cứu Đơn

### 5.1 `GET /api/tracking` — Tra cứu đơn hàng theo mã hoặc SĐT

**Query params:**

| Param | Bắt buộc | Mô tả |
|-------|----------|-------|
| `code` | ✅ | Mã đơn hàng (`HN-261001-7823`) hoặc SĐT (`0987654321`) |

**Ví dụ:**
- `GET /api/tracking?code=HN-261001-7823`
- `GET /api/tracking?code=0987654321`

**Logic tìm kiếm:**
- Nếu `code` khớp `orderNumber` (uppercase) → trả về đơn đó
- Nếu `code` khớp SĐT khách hàng → trả về **đơn gần nhất**

**Response `200`** (tìm thấy):
```json
{
  "success": true,
  "order": {
    "id": "cm456def",
    "orderNumber": "HN-261001-7823",
    "status": "PRODUCING",
    "paymentMethod": "deposit30",
    "subtotal": 13500000,
    "discount": 675000,
    "total": 12825000,
    "notes": "Giao hàng trước ngày 15/10",
    "createdAt": "2026-10-01T16:00:00.000Z",
    "customer": {
      "fullName": "Công Ty ABC",
      "phone": "0987654321"
    },
    "items": [
      {
        "productName": "Áo Polo Doanh Nghiệp HDC Classic Gold",
        "quantity": 100,
        "unitPrice": 135000,
        "color": "Xanh Navy Hoàng Gia",
        "size": "L",
        "subtotal": 13500000
      }
    ]
  }
}
```

**Response `200`** (không tìm thấy):
```json
{
  "success": true,
  "order": null
}
```

**Response `400`** (thiếu code):
```json
{
  "success": false,
  "error": "Thiếu mã đơn hàng"
}
```

---

## 6. Chat — AI Tư Vấn

### 6.1 `POST /api/chat` — Gửi tin nhắn cho AI

> **Engine:** Google Gemini 2.5 Flash (với fallback sang các model nhẹ hơn)  
> **Retry logic:** Tự động retry 2 lần với backoff 0ms → 500ms → 1500ms  
> **Fallback:** Nếu tất cả model thất bại → trả về tin nhắn hướng dẫn gọi hotline

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "text": "Giá áo polo cho 200 cái là bao nhiêu?"
    },
    {
      "role": "model",
      "text": "Dạ, với 200 áo polo, anh/chị sẽ được giá 135.000đ/chiếc..."
    },
    {
      "role": "user",
      "text": "Có thể thêu logo không?"
    }
  ]
}
```

**Quy tắc:**
- `messages` là array, tối thiểu 1 phần tử
- `role`: `"user"` hoặc `"model"`
- `text`: string, tối đa 1000 ký tự / message, trimmed
- Server chỉ lấy **10 messages cuối** (MAX_HISTORY = 10)

**Response `200`** (thành công):
```json
{
  "reply": "Dạ, HDC hỗ trợ in/thêu logo tại 1 vị trí miễn phí từ 30 áo trở lên ạ. Anh/chị cho em xin thêm thông tin về logo (file vector, vị trí đặt) để báo giá chính xác nhé 😊"
}
```

**Response `200`** (AI bị quá tải - luôn trả 200, không phải 503):
```json
{
  "reply": "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây, hoặc gọi hotline 0984.959.586 để được tư vấn trực tiếp ạ."
}
```

> **Lưu ý thiết kế:** Chat endpoint luôn trả HTTP 200 để không làm vỡ UI, ngay cả khi AI fail.

---

## 7. Products — Sản Phẩm (TODO)

> ⚠️ **Chưa có** — Hiện tại sản phẩm lấy từ data tĩnh `src/shared/data/products.js`.  
> Prisma đã có model `Product`. Cần build các endpoint này để chuyển sang DB-driven.

### 7.1 `GET /api/products` — Danh sách sản phẩm

**Query params (TODO):**

| Param | Mô tả |
|-------|-------|
| `category` | Filter theo category ID |
| `search` | Tìm kiếm text (title, material) |
| `priceMin` | Giá từ (VND) |
| `priceMax` | Giá đến (VND) |
| `sort` | `popular` \| `priceAsc` \| `priceDesc` \| `rating` \| `discount` |
| `page` | Số trang (mặc định 1) |
| `limit` | Số item/trang (mặc định 12, max 48) |

**Response schema (TODO):**
```json
{
  "success": true,
  "data": {
    "products": [ /* array Product */ ],
    "total": 40,
    "page": 1,
    "totalPages": 4
  }
}
```

---

### 7.2 `GET /api/products/[id]` — Chi tiết sản phẩm (TODO)

**Response schema (TODO):**
```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "slug": "ao-polo-doanh-nghiep-hdc-classic-gold",
    "sku": "HN-POLO-01",
    "title": "Áo Polo Doanh Nghiệp HDC Classic Gold",
    "description": "...",
    "category": "corporate",
    "material": "Pique Cá Sấu Cotton Compact 4 Chiều",
    "price": 185000,
    "originalPrice": 245000,
    "images": ["/images/uniform_polo_corporate.jpg"],
    "features": ["..."],
    "colors": [
      { "name": "Xanh Navy Hoàng Gia", "code": "#0B2042" }
    ],
    "sizes": ["S", "M", "L", "XL", "2XL"],
    "wholesaleTiers": [
      { "min": 10, "max": 49, "price": 185000, "label": "10 - 49 áo" }
    ],
    "published": true,
    "featured": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 7.3 `POST /api/products` 🔒 ADMIN — Tạo sản phẩm (TODO)

### 7.4 `PUT /api/products/[id]` 🔒 ADMIN — Sửa sản phẩm (TODO)

### 7.5 `DELETE /api/products/[id]` 🔒 ADMIN — Xoá sản phẩm (TODO)

---

## 8. Reviews — Đánh Giá (TODO)

> Model `Review` đã có trong Prisma. Cần build các endpoint sau:

### 8.1 `GET /api/reviews?productId=xxx` — Lấy đánh giá sản phẩm (TODO)

**Response schema (TODO):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "cm...",
        "rating": 5,
        "content": "Áo đẹp, chất vải tốt, giao nhanh!",
        "createdAt": "2026-09-01T...",
        "user": {
          "fullName": "Công Ty ABC",
          "avatar": null
        }
      }
    ],
    "avgRating": 4.8,
    "total": 124
  }
}
```

### 8.2 `POST /api/reviews` 🔒 — Tạo đánh giá (TODO)

> Chỉ user đã đăng nhập và đã có đơn hàng chứa `productId` mới được đánh giá.

**Request Body (TODO):**
```json
{
  "productId": "huni-polo-pro",
  "rating": 5,
  "content": "Áo đẹp, chất vải tốt, giao nhanh!"
}
```

**Validation:**
- `rating`: integer 1–5
- `content`: min 10, max 500 ký tự
- Mỗi user chỉ được đánh giá 1 lần / sản phẩm (TODO: unique constraint)

---

## 9. Admin — Quản Trị (TODO)

> Tất cả endpoint admin yêu cầu `session.user.role === "ADMIN"`.  
> Hiện tại `GET /api/orders` chưa có guard — cần bổ sung ngay.

### 9.1 `GET /api/admin/orders` 🔒 ADMIN — Danh sách đơn hàng với filter đầy đủ (TODO)
### 9.2 `PATCH /api/admin/orders/[id]` 🔒 ADMIN — Cập nhật trạng thái đơn (TODO)
### 9.3 `GET /api/admin/quotes` 🔒 ADMIN — Danh sách báo giá (TODO)
### 9.4 `PATCH /api/admin/quotes/[id]` 🔒 ADMIN — Cập nhật trạng thái báo giá (TODO)
### 9.5 `GET /api/admin/customers` 🔒 ADMIN — Danh sách khách hàng (TODO)
### 9.6 `GET /api/admin/dashboard` 🔒 ADMIN — Thống kê tổng quan (TODO)
### 9.7 `POST /api/admin/vouchers` 🔒 ADMIN — Tạo voucher mới (TODO)

---

## 10. Database Schema

### ERD tóm tắt

```
Customer ──< Order ──< OrderItem
Customer ──< Quote
User ──< Review
```

### Các Model & Fields

#### `customers`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `fullName` | String | |
| `phone` | String | unique, index |
| `email` | String? | index |
| `company` | String? | |
| `address` | String? | |
| `taxCode` | String? | |
| `notes` | String? | |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | auto-update |

#### `orders`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `orderNumber` | String | unique, format `HN-YYMMDD-XXXX` |
| `customerId` | String | FK → customers |
| `status` | OrderStatus | PENDING, QUOTED, CONFIRMED, PRODUCING, SHIPPED, COMPLETED, CANCELLED |
| `paymentMethod` | String | `vietqr` / `deposit30` / `freesample` |
| `subtotal` | Int | VND, server-computed |
| `discount` | Int | VND, server-computed |
| `total` | Int | VND, server-computed |
| `notes` | String? | |
| `vatInfo` | Json? | `{taxCode, companyName, companyAddress, email}` |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

#### `order_items`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `orderId` | String | FK → orders (onDelete: Cascade) |
| `productId` | String | ID sản phẩm |
| `productName` | String | Snapshot tại thời điểm đặt |
| `quantity` | Int | |
| `unitPrice` | Int | VND, server-verified |
| `color` | String? | |
| `size` | String? | |
| `customLogo` | Json? | `{url, position, width, height}` |
| `subtotal` | Int | VND |

#### `quotes`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `customerId` | String? | FK → customers (optional) |
| `fullName` | String | |
| `phone` | String | index |
| `email` | String? | |
| `company` | String? | |
| `category` | String | polo / shirt / suit / golf / school / accessories |
| `quantity` | Int | |
| `estimatedPrice` | Int? | VND |
| `notes` | String? | |
| `status` | QuoteStatus | NEW, CONTACTED, QUOTED, CONVERTED, CLOSED |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

#### `products`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `slug` | String | unique, URL-friendly |
| `sku` | String | unique |
| `title` | String | |
| `description` | Text | |
| `category` | String | |
| `material` | String? | |
| `price` | Int | VND |
| `originalPrice` | Int? | VND |
| `images` | String[] | mảng URL |
| `features` | String[] | |
| `colors` | Json? | `[{name, code}]` |
| `sizes` | String[] | |
| `wholesaleTiers` | Json? | `[{min, max, price, label}]` |
| `published` | Boolean | default true |
| `featured` | Boolean | default false |

#### `users`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `email` | String | unique, index |
| `passwordHash` | String | bcrypt, rounds=10 |
| `fullName` | String | |
| `phone` | String? | |
| `avatar` | String? | URL |
| `role` | UserRole | CUSTOMER / ADMIN |
| `lastLoginAt` | DateTime? | |

#### `reviews`
| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | cuid | PK |
| `productId` | String | index |
| `userId` | String | FK → users (onDelete: Cascade) |
| `rating` | SmallInt | 1–5 |
| `content` | String | |
| `createdAt` | DateTime | |

---

## 11. Error Codes Reference

| HTTP | `error` message | Nguyên nhân |
|------|-----------------|-------------|
| 400 | "Dữ liệu không hợp lệ" | Validation Zod fail, kèm `details[]` |
| 400 | "Thiếu mã đơn hàng" | GET /tracking thiếu `code` param |
| 400 | "Giá sản phẩm không hợp lệ..." | Client gửi giá lệch >1% so với server |
| 400 | "Mã ưu đãi không hợp lệ" | Voucher code không tồn tại |
| 400 | "Mã ưu đãi đã hết hạn" | Voucher hết hạn |
| 400 | "Mã ưu đãi đã bị vô hiệu hóa" | Voucher bị tắt |
| 400 | "Đơn hàng tối thiểu Xđ..." | Subtotal chưa đủ điều kiện voucher |
| 409 | "Email này đã được đăng ký" | Duplicate email khi register |
| 429 | "Bạn đã gửi quá nhiều đơn..." | Rate limit 5 đơn/IP/giờ |
| 500 | "Không thể xử lý đơn hàng..." | Lỗi DB hoặc lỗi không mong đợi |

---

## 12. Security Notes

### ✅ Đã có

| Biện pháp | Áp dụng tại |
|-----------|-------------|
| **Server-side price validation** | `POST /api/orders` — tính lại giá từ DB, reject nếu lệch >1% |
| **Server-side voucher validation** | `POST /api/orders` — không tin voucher từ client |
| **Zod schema validation** | Tất cả POST endpoints |
| **bcrypt hash** (rounds=10) | `POST /api/register` |
| **JWT session** (30 ngày) | NextAuth — stateless |
| **Rate limiting** (in-memory) | `POST /api/orders` — 5 req/IP/giờ |
| **SQL Injection safe** | Prisma ORM — parameterized queries |
| **Phone normalization** | Tất cả endpoint nhận SĐT |
| **Lỗi không expose internal** | Tất cả — chỉ log server, response chỉ có message chung |

### ⚠️ Cần bổ sung (TODO)

| Vấn đề | Ưu tiên | Giải pháp đề xuất |
|--------|---------|-------------------|
| `GET /api/orders` chưa có auth guard | 🔴 Cao | Kiểm tra `session.user.role === "ADMIN"` |
| Rate limit dùng in-memory | 🟡 Trung bình | Chuyển sang **Upstash Redis** khi scale |
| Chưa có CSRF protection rõ ràng | 🟡 Trung bình | NextAuth tự xử lý cho form — kiểm tra lại với fetch calls |
| Email chưa verify | 🟡 Trung bình | Thêm `emailVerified` field + link xác thực |
| Chưa có rate limit cho `/api/register` | 🟡 Trung bình | Thêm tương tự orders |
| Voucher lưu hardcode trong code | 🟢 Thấp | Chuyển sang model `Voucher` trong Prisma |
| Chưa có input sanitization XSS | 🟢 Thấp | Thêm DOMPurify hoặc strip HTML trước khi save |
| Secret key trong `authConfig` có fallback hardcode | 🟢 Thấp | Bắt buộc env var, không cho fallback trong prod |

---

*Tài liệu này được tạo tự động từ phân tích source code bởi Antigravity AI.*  
*Cập nhật khi có thay đổi API hoặc schema.*
