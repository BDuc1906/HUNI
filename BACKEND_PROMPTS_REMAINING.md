# 📋 HUNI Backend — Prompt 4 → 10
## Copy từng prompt giao thẳng cho AI Agent

> **Thứ tự bắt buộc:** P4 → P5 → P6 → P7 → P8 → P9 → P10
> **Trạng thái hiện tại:** P0✅ P1✅ P2✅ P3✅ P4✅ P5✅ P6✅ P7✅ → Tiếp theo là P8

---

## ✅ PROMPT 4 — Quotes + Tracking + Chat

```
Đọc file BACKEND_CSHARP_PROMPT.md — thực hiện PROMPT 4.

Nhiệm vụ — tạo 3 nhóm endpoint:

─── NHÓM 1: QUOTES ───────────────────────────────────────────

1. Tạo Application/DTOs/Quotes/CreateQuoteRequest.cs:
   { fullName, phone, email?, company?, category, quantity, estimatedPrice?, notes? }

2. Tạo Application/Validators/CreateQuoteValidator.cs (FluentValidation):
   - fullName: min 2, max 100
   - phone: 10-11 số sau normalize
   - category: phải là một trong {polo, shirt, suit, golf, school, accessories}
   - quantity: int, min 10

3. Tạo Application/Services/QuoteService.cs:
   - CreateQuoteAsync(request, ipAddress):
     1. Validate
     2. NormalizePhone()
     3. Upsert Customer theo SĐT
     4. db.Quotes.Add(new Quote { Status = QuoteStatus.NEW })
     5. Return 201 + { success: true, message: "Yêu cầu báo giá đã được tiếp nhận", quoteId }

4. Tạo API/Controllers/QuotesController.cs:
   POST /api/quotes *(public)* → 201

─── NHÓM 2: TRACKING ─────────────────────────────────────────

5. Tạo Application/Services/TrackingService.cs:
   - TrackOrderAsync(code):
     1. Tìm theo orderNumber (toUpperCase)
     2. Nếu không có → tìm theo phone (normalize) → đơn gần nhất
     3. Trả null nếu không tìm thấy (KHÔNG phải 404)

6. Tạo API/Controllers/TrackingController.cs:
   GET /api/tracking?code=... *(public)*
   - Thiếu code → 400 "Thiếu mã đơn hàng"
   - Tìm thấy → 200 { success: true, order: { ...full order } }
   - Không tìm thấy → 200 { success: true, order: null }  ← KHÔNG phải 404

─── NHÓM 3: CHAT AI ──────────────────────────────────────────

7. Tạo Infrastructure/Services/GeminiChatService.cs:
   - Gọi Gemini REST API qua HttpClient (không dùng Google SDK)
   - URL: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}
   - Fallback cascade: gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash → gemini-flash-latest
   - Retry 2 lần cho lỗi 503/429 (backoff: 500ms → 1500ms)
   - Lấy tối đa 10 messages cuối, trim mỗi message max 1000 ký tự
   - System prompt: "Bạn là trợ lý tư vấn đồng phục HUNI. Trả lời tiếng Việt, thân thiện, chuyên nghiệp."

8. Tạo API/Controllers/ChatController.cs:
   POST /api/chat *(public)*
   Request: { messages: [{ role: "user"|"model", text: "..." }] }
   - LUÔN trả HTTP 200 kể cả khi AI fail
   - Thành công: { reply: "..." }
   - AI fail: { reply: "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây hoặc gọi hotline 0984.959.586 ạ." }

9. Đăng ký DI trong Program.cs:
   - AddScoped<IQuoteService, QuoteService>()
   - AddScoped<ITrackingService, TrackingService>()
   - AddHttpClient<IChatService, GeminiChatService>()

Sau khi code xong:
- dotnet build → không lỗi
- Test Swagger:
  POST /api/quotes (quantity=5) → phải 400 "Số lượng tối thiểu 10"
  POST /api/quotes đúng → 201 + quoteId
  GET /api/tracking?code=HN-261002-0001 → 200 (order hoặc null)
  GET /api/tracking (không có code) → 400
  POST /api/chat với messages → 200 + { reply: "..." }
  POST /api/chat khi Gemini lỗi → vẫn 200 (không phải 500)
```

---

## ✅ PROMPT 5 — Products API

```
Đọc file BACKEND_CSHARP_PROMPT.md — thực hiện PROMPT 5.

Nhiệm vụ:

1. Tạo Infrastructure/Data/Seeds/products-seed.json:
   - Export danh sách sản phẩm từ src/shared/data/products.js (frontend)
   - Convert sang JSON với các field: id, slug, sku, title, description, category,
     material, price, originalPrice, images[], features[], colors (JSON), sizes[],
     wholesaleTiers (JSON), published, featured

2. Tạo Infrastructure/Data/Seeds/StaticProductsLoader.cs:
   - Load từ products-seed.json vào List<Product> (cache singleton)
   - Dùng khi DB chưa có sản phẩm (fallback)

3. Tạo Application/DTOs/Products/ProductDtos.cs:
   - ProductListResponse, ProductDetailResponse, CreateProductRequest, UpdateProductRequest

4. Tạo Application/Validators/ProductCreateValidator.cs:
   - slug: min 2, max 200
   - sku: min 2, max 50
   - title: min 2, max 200
   - description: min 5
   - category: không rỗng
   - price: int ≥ 0
   - images: array, min 1 phần tử

5. Tạo Application/Services/ProductService.cs:
   - GetProductsAsync(query): DB nếu có sản phẩm published, fallback static
     Filter: category, search (title/description/material), priceMin, priceMax
     Sort: popular(featured desc) | priceAsc | priceDesc
     Pagination: page, limit (max 48)
   - GetProductByIdAsync(id): tìm theo id OR slug OR sku (DB → static)
   - CreateProductAsync(request): check trùng slug/sku → 409, tạo mới → 201
   - UpdateProductAsync(id, request): partial update, check trùng nếu thay đổi slug/sku
   - DeleteProductAsync(id): hard delete từ DB

6. Tạo API/Controllers/ProductsController.cs:
   GET    /api/products          *(public)*  → list + pagination
   GET    /api/products/{id}     *(public)*  → detail (id | slug | sku)
   POST   /api/products          🔒 ADMIN   → 201
   PUT    /api/products/{id}     🔒 ADMIN   → 200
   DELETE /api/products/{id}     🔒 ADMIN   → 200

7. Đăng ký DI:
   - AddScoped<IProductService, ProductService>()
   - AddSingleton<StaticProductsLoader>()

Sau khi code xong:
- dotnet build → không lỗi
- Test Swagger:
  GET /api/products → list sản phẩm (từ static nếu DB trống)
  GET /api/products/ao-polo-hdc → detail theo slug
  POST /api/products (không auth) → 401
  POST /api/products (ADMIN token) → 201
  PUT  /api/products/{id} slug trùng → 409
  DELETE /api/products/{id} → 200
```

---

## ✅ PROMPT 6 — Reviews API

```
Đọc file BACKEND_CSHARP_PROMPT.md — thực hiện PROMPT 6.

Nhiệm vụ:

1. Tạo Application/DTOs/Reviews/ReviewDtos.cs:
   - ReviewResponse: { id, rating, content, createdAt, user:{fullName, name, avatar} }
   - CreateReviewRequest: { productId, rating, content }
   - ReviewListResponse: { reviews[], avgRating, total, canReview, hasOrdered, isAuthenticated }

2. Tạo Application/Services/ReviewService.cs:

   GetReviewsAsync(productId, userId?):
   - Lấy reviews từ DB theo productId, order by createdAt desc
   - Tính avgRating (default 5.0 nếu chưa có review)
   - Check canReview:
     + Chưa login → canReview = false
     + ADMIN → canReview = true (luôn)
     + CUSTOMER → check OrderItem có productId khớp email/phone user
   - Trả cả "data" field VÀ root-level (tương thích frontend):
     { success, data: {reviews, avgRating, total}, reviews, avgRating, total, canReview, hasOrdered, isAuthenticated }

   CreateReviewAsync(request, userId):
   - Auth check → 401 nếu chưa login
   - Validate: productId không rỗng, rating 1-5, content min 5 ký tự
   - Check đã review chưa (unique [productId, userId]) → 400 "Bạn đã gửi đánh giá..."
   - Nếu role != ADMIN → check đã mua hàng:
     + Tìm OrderItem với productId khớp email/phone user
     + Nếu DB có đơn hàng nhưng user chưa mua → 403
     + Nếu DB chưa có đơn nào (dev/demo) → bỏ qua check
   - db.Reviews.Add(new Review { ... })
   - Return 201 + { success, message: "Gửi đánh giá thành công",
                    review: { id, rating, content, createdAt, user:{name, fullName, avatar} },
                    data: { review: {...same} } }

   Fallback: Nếu DB lỗi → return simulated review với id "sim-{timestamp}" (HTTP 201)

3. Tạo API/Controllers/ReviewsController.cs:
   GET  /api/reviews?productId=... *(public, context-aware)*
   POST /api/reviews               🔒 Đăng nhập

4. Đăng ký DI:
   - AddScoped<IReviewService, ReviewService>()

Sau khi code xong:
- dotnet build → không lỗi
- Test Swagger:
  GET /api/reviews?productId=abc → 200 (canReview false nếu chưa login)
  GET /api/reviews (thiếu productId) → 400
  POST /api/reviews (không auth) → 401
  POST /api/reviews (đã login, chưa mua) → 403
  POST /api/reviews (ADMIN) → 201
  POST /api/reviews lần 2 cùng productId → 400 "Bạn đã gửi đánh giá..."
```

---

## ✅ PROMPT 7 — Admin APIs (Dashboard + Orders + Quotes + Customers + Vouchers + Reviews + Returns)

```
Đọc file BACKEND_CSHARP_PROMPT.md — thực hiện PROMPT 7.
TẤT CẢ endpoint phải có [Authorize(Roles = "ADMIN")].

─── ADMIN DASHBOARD ──────────────────────────────────────────

1. Tạo API/Controllers/Admin/AdminDashboardController.cs:
   GET /api/admin/dashboard 🔒 ADMIN
   - Chạy SONG SONG (Task.WhenAll) 11 queries:
     totalOrders, totalRevenue (sum total where status != CANCELLED),
     totalQuotes, totalCustomers,
     pendingOrders, producingOrders, completedOrders, cancelledOrders,
     newQuotes, recentOrders(5), recentQuotes(5)
   - Response: { stats, statusCounts:{orders:{pending,producing,completed,cancelled}, quotes:{new}},
                 recentOrders, recentQuotes }

─── ADMIN ORDERS ─────────────────────────────────────────────

2. Tạo API/Controllers/Admin/AdminOrdersController.cs:
   GET   /api/admin/orders 🔒 ADMIN
   - Query params: status, search (orderNumber|fullName|phone|email|company), dateFrom, dateTo, page, limit(max 100)
   - Response kèm "summary": { pending, producing, completed, totalRevenue } (tính toàn DB)

   PATCH /api/admin/orders/{id} 🔒 ADMIN
   - id có thể là id (cuid) HOẶC orderNumber
   - Body: { status?: OrderStatus, notes?: string (max 500) }
   - Validate status enum
   - 404 nếu không tìm thấy
   - Response: { success, message, data: updatedOrder }

─── ADMIN QUOTES ─────────────────────────────────────────────

3. Tạo API/Controllers/Admin/AdminQuotesController.cs:
   GET   /api/admin/quotes 🔒 ADMIN
   - Query params: status, category, search (name|phone|email|company), page, limit

   PATCH /api/admin/quotes/{id} 🔒 ADMIN
   - Body: { status?: QuoteStatus, estimatedPrice?: int, notes?: string }
   - 404 nếu không tìm thấy

─── ADMIN CUSTOMERS ──────────────────────────────────────────

4. Tạo API/Controllers/Admin/AdminCustomersController.cs:
   GET /api/admin/customers 🔒 ADMIN
   - Query params: search, page, limit
   - Include _count: orderCount, quoteCount
   - Response: customers[{ ...fields, orderCount, quoteCount }]

─── ADMIN VOUCHERS ───────────────────────────────────────────

5. Tạo Application/Validators/VoucherCreateValidator.cs:
   - code: min 2, max 50 (auto uppercase)
   - type: "percentage" | "fixed"
   - discount: int ≥ 1
   - minOrder: int ≥ 0
   - usageLimit: int ≥ 1, nullable

6. Tạo API/Controllers/Admin/AdminVouchersController.cs:
   GET  /api/admin/vouchers 🔒 ADMIN → list tất cả, sort by createdAt desc
   POST /api/admin/vouchers 🔒 ADMIN
   - Check trùng code (uppercase) → 409
   - db.Vouchers.Add(...)
   - Return 201

─── ADMIN REVIEWS (IN-MEMORY) ────────────────────────────────

7. Tạo Infrastructure/InMemory/AdminReviewStore.cs:
   - Static List<AdminReview> với 5 reviews mẫu (xem API_CONTRACT.md Section 14)
   - ReviewStatus enum: APPROVED, PENDING, HIDDEN

8. Tạo API/Controllers/Admin/AdminReviewsController.cs:
   GET    /api/admin/reviews 🔒 ADMIN
   - Filter: search, rating(1-5), status, page, limit(max 100)
   - Thử đọc từ DB trước, fallback in-memory nếu DB trống
   - Response kèm stats: { totalReviews, avgRating, pendingCount, fiveStarPercent }

   PATCH  /api/admin/reviews 🔒 ADMIN
   - Body: { id, status?, adminReply? }
   - id bắt buộc → 400 nếu thiếu
   - Set repliedAt = now khi có adminReply

   DELETE /api/admin/reviews 🔒 ADMIN
   - Body: { ids: [...] } hoặc { id: "..." }
   - → 400 nếu không có id nào

─── ADMIN RETURNS (IN-MEMORY) ────────────────────────────────

9. Tạo Infrastructure/InMemory/AdminReturnStore.cs:
   - Static List<ReturnRequest> với 5 returns mẫu (xem API_CONTRACT.md Section 15)
   - ReturnType: EXCHANGE, REFUND
   - ReturnStatus: PENDING, PROCESSING, EXCHANGED, REFUNDED, REJECTED

10. Tạo API/Controllers/Admin/AdminReturnsController.cs:
    GET    /api/admin/returns 🔒 ADMIN
    - Filter: search, type(EXCHANGE|REFUND), status, page, limit(max 100)
    - Response kèm stats: { totalRequests, pendingCount, processingCount, completedCount, totalRefunded }

    PATCH  /api/admin/returns 🔒 ADMIN
    - Body: { id, status?, adminNotes?, refundAmount? }
    - id bắt buộc → 400 nếu thiếu

    DELETE /api/admin/returns 🔒 ADMIN
    - Body: { ids: [...] } hoặc { id: "..." }

Sau khi code xong:
- dotnet build → không lỗi
- Test Swagger (dùng ADMIN token):
  GET /api/admin/dashboard → stats + recentOrders + recentQuotes
  GET /api/admin/orders?search=HN → filter theo orderNumber
  PATCH /api/admin/orders/{orderNumber} → cập nhật status
  POST /api/admin/vouchers → 201 + voucher mới
  POST /api/admin/vouchers cùng code → 409
  GET /api/admin/reviews → list + stats
  PATCH /api/admin/reviews body {id, adminReply: "..."} → có repliedAt
  GET /api/admin/returns → list + stats
  PATCH /api/admin/returns body {id, status: "REFUNDED"} → cập nhật
```

---

## ✅ PROMPT 8 — Kết Nối Frontend Next.js → C# Backend

```
Bạn là senior Next.js developer. Hãy refactor frontend HUNI để chỉ còn là
UI Layer — xóa toàn bộ API routes và DB access, gọi C# backend qua HTTP.

─── BƯỚC 1: XÓA CODE KHÔNG CẦN THIẾT ───────────────────────

Xóa hoàn toàn:
  src/app/api/              ← TOÀN BỘ 18 route files
  src/server/db.js          ← Prisma client
  src/server/validators.js  ← Zod schemas (đã có FluentValidation ở C#)
  src/server/mailer.js      ← Email (C# MailKit xử lý)
  src/server/auth/          ← Auth config (thay bằng C# JWT)
  prisma/                   ← schema.prisma, migrations/

Xóa khỏi .env:
  DATABASE_URL
  DIRECT_URL
  NEXTAUTH_SECRET (nếu không còn dùng NextAuth)

─── BƯỚC 2: TẠO API CLIENT ──────────────────────────────────

Tạo src/shared/lib/apiClient.js:

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('huni_token');
}

export async function backendFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok && res.status === 401) {
    localStorage.removeItem('huni_token');
    window.location.href = '/login';
  }

  return res.json();
}

export const api = {
  get:    (path)        => backendFetch(path, { method: 'GET' }),
  post:   (path, body)  => backendFetch(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)  => backendFetch(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body)  => backendFetch(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path, body)  => backendFetch(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};

─── BƯỚC 3: TẠO AUTH PROVIDER ───────────────────────────────

Tạo src/shared/providers/AuthProvider.jsx:
- State: { user, token, loading }
- login(email, password) → api.post('/api/auth/login') → lưu token localStorage
- logout() → xóa token
- register(data) → api.post('/api/auth/register')
- Tự động load user khi có token (GET /api/auth/me)

─── BƯỚC 4: CẬP NHẬT .env.local ────────────────────────────

# Xóa DATABASE_URL, thêm:
NEXT_PUBLIC_API_URL=http://localhost:5000

─── BƯỚC 5: THAY THẾ FETCH CALLS ───────────────────────────

Tìm và thay thế trong tất cả component/page:

| File | Thay đổi |
|------|---------|
| CheckoutModal.jsx | fetch('/api/orders') → api.post('/api/orders', data) |
| QuickQuoteSection.jsx | fetch('/api/quotes') → api.post('/api/quotes', data) |
| OrderTrackingModal.jsx | fetch('/api/tracking') → api.get(`/api/tracking?code=${code}`) |
| ProductCatalog.jsx | fetch('/api/products') → api.get('/api/products?...') |
| ProductDetail.jsx | fetch('/api/products/[id]') → api.get(`/api/products/${id}`) |
| ReviewSection.jsx | fetch('/api/reviews') → api.get(`/api/reviews?productId=${id}`) |
| ReviewForm.jsx | fetch('/api/reviews') → api.post('/api/reviews', data) |
| ChatWidget.jsx | fetch('/api/chat') → api.post('/api/chat', { messages }) |
| LoginForm.jsx | signIn() NextAuth → authProvider.login(email, password) |
| RegisterForm.jsx | fetch('/api/register') → authProvider.register(data) |

─── BƯỚC 6: ADMIN PAGES ─────────────────────────────────────

Cập nhật src/app/admin/ pages:
- Dùng api.get/post/patch với ADMIN token
- Ví dụ: api.get('/api/admin/dashboard')
         api.get('/api/admin/orders?page=1&limit=20')
         api.patch(`/api/admin/orders/${id}`, { status: 'CONFIRMED' })

─── BƯỚC 7: KIỂM TRA ────────────────────────────────────────

Chạy: npm run build → không lỗi
Chạy: npm run dev → mở localhost:3000
Test end-to-end:
  ✅ Đăng ký tài khoản mới
  ✅ Đăng nhập → token lưu localStorage
  ✅ Xem danh sách sản phẩm
  ✅ Gửi đơn hàng
  ✅ Chat AI
  ✅ Admin đăng nhập → xem dashboard
```

---

## ✅ PROMPT 9 — Docker Compose

```
Bạn là DevOps engineer. Hãy tạo Docker Compose để chạy
Frontend Next.js + Backend C# .NET 9 cùng nhau.

─── FILE CẦN TẠO ────────────────────────────────────────────

1. docker-compose.yml (đặt tại thư mục cha chứa cả HUNI/ và HuniBackend/):

version: '3.9'
services:
  backend:
    build:
      context: ./HuniBackend
      dockerfile: Dockerfile
    container_name: huni-backend
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${DATABASE_URL}
      - Jwt__SecretKey=${JWT_SECRET_KEY}
      - Jwt__Issuer=HuniBackend
      - Jwt__Audience=HuniClient
      - Jwt__ExpiresInDays=30
      - Gemini__ApiKey=${GEMINI_API_KEY}
      - Email__SmtpHost=smtp.gmail.com
      - Email__SmtpPort=587
      - Email__FromEmail=${EMAIL_FROM}
      - Email__Password=${EMAIL_PASSWORD}
      - Email__AdminEmail=${ADMIN_EMAIL}
      - Cors__AllowedOrigins__0=http://localhost:3000
      - Cors__AllowedOrigins__1=${FRONTEND_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./HUNI
      dockerfile: Dockerfile
    container_name: huni-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
      - NEXTAUTH_URL=${FRONTEND_URL}
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped

2. HuniBackend/Dockerfile:

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/HuniBackend.API/HuniBackend.API.csproj", "src/HuniBackend.API/"]
COPY ["src/HuniBackend.Application/HuniBackend.Application.csproj", "src/HuniBackend.Application/"]
COPY ["src/HuniBackend.Domain/HuniBackend.Domain.csproj", "src/HuniBackend.Domain/"]
COPY ["src/HuniBackend.Infrastructure/HuniBackend.Infrastructure.csproj", "src/HuniBackend.Infrastructure/"]
RUN dotnet restore "src/HuniBackend.API/HuniBackend.API.csproj"
COPY . .
WORKDIR "/src/src/HuniBackend.API"
RUN dotnet build "HuniBackend.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HuniBackend.API.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HuniBackend.API.dll"]

3. HUNI/Dockerfile:

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

4. .env (đặt cùng docker-compose.yml, KHÔNG commit lên git):

DATABASE_URL=Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres.xxx;Password=...;SSL Mode=Require;Trust Server Certificate=true
JWT_SECRET_KEY=huni-super-secret-key-256bit-minimum-length-here!
GEMINI_API_KEY=AIzaSy...
EMAIL_FROM=noreply@hunistore.com
EMAIL_PASSWORD=gmail-app-password
ADMIN_EMAIL=admin@hunistore.com
FRONTEND_URL=https://hunistore.com

5. .gitignore (thêm vào root):
.env
.env.*
!.env.example

6. .env.example (commit lên git để người khác biết cần gì):

DATABASE_URL=
JWT_SECRET_KEY=
GEMINI_API_KEY=
EMAIL_FROM=
EMAIL_PASSWORD=
ADMIN_EMAIL=
FRONTEND_URL=

─── LỆNH CHẠY ───────────────────────────────────────────────

# Build và chạy cả 2
docker-compose up --build -d

# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Dừng
docker-compose down

# Kiểm tra
curl http://localhost:5000/health
curl http://localhost:3000

─── KIỂM TRA ────────────────────────────────────────────────
  ✅ http://localhost:5000/health → { "status": "healthy" }
  ✅ http://localhost:5000/swagger → Swagger UI
  ✅ http://localhost:3000 → Next.js frontend
  ✅ Frontend gọi được backend qua HTTP
```

---

## ✅ PROMPT 10 — Bảo Mật Toàn Diện (Security Hardening)

```
Đọc file BACKEND_CSHARP_PROMPT.md — thực hiện PROMPT 10.
Implement theo thứ tự P10-A → P10-I.

─── P10-A: ẨN API KEY & XÓA GIT SECRETS ────────────────────

1. Chạy lệnh init .NET User Secrets:
   dotnet user-secrets init --project src/HuniBackend.API
   dotnet user-secrets set "Jwt:SecretKey" "..." --project src/HuniBackend.API
   dotnet user-secrets set "Gemini:ApiKey" "..." --project src/HuniBackend.API
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..." --project src/HuniBackend.API

2. Cập nhật HuniBackend/.gitignore (xem file BACKEND_CSHARP_PROMPT.md P10-A)

3. Kiểm tra không có hardcoded credentials:
   grep -r "Password=" src/ --include="*.cs" | grep -v "//.*Password"
   # Phải không có kết quả nào

─── P10-B: BẢO MẬT DATABASE & RLS ──────────────────────────

4. Cập nhật AppDbContext để:
   - EnableSensitiveDataLogging(false) — không log SQL params
   - CommandTimeout(30) — timeout 30 giây
   - EnableDetailedErrors(isDevelopment)

5. Chạy SQL trong Supabase SQL Editor:
   -- Tạo DB user riêng (ít quyền)
   CREATE USER huni_app WITH PASSWORD 'strong-random-password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO huni_app;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO huni_app;

   -- Bật RLS cho bảng users
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

─── P10-C: MÃ HÓA DỮ LIỆU & HTTPS ─────────────────────────

6. Tạo Infrastructure/Services/EncryptionService.cs:
   - AES-256 encrypt/decrypt
   - Áp dụng cho Customer.TaxCode và Order.VatInfo

7. Cập nhật Program.cs:
   app.UseHsts();
   app.UseHttpsRedirection();

─── P10-D: KHÓA QUYỀN TRUY CẬP RECORD ──────────────────────

8. Thêm resource-based auth check vào OrdersController:
   - User chỉ được xem đơn hàng của chính mình (khớp email/phone)
   - Trả 403 nếu không phải chủ record và không phải ADMIN

9. Đảm bảo UpdateOrderRequest chỉ nhận field được phép:
   - Chỉ { notes? } — không có status, total, customerId
   - Đơn COMPLETED/CANCELLED → không cho sửa

─── P10-E: COOKIE, RATE LIMIT, BRUTE FORCE ─────────────────

10. Tạo Infrastructure/Services/LoginAttemptTracker.cs:
    - Khóa sau 5 lần sai trong 15 phút
    - Thêm vào AuthController.Login()

11. Thêm AspNetCoreRateLimit vào Program.cs:
    - Toàn bộ API: 200 req/phút/IP
    - Auth endpoints: 10 req/5 phút/IP
    - Register: 3 lần/giờ/IP

─── P10-F: ESCAPE & FILE UPLOAD ─────────────────────────────

12. Cài NuGet: HtmlSanitizer
    dotnet add package HtmlSanitizer --project src/HuniBackend.Infrastructure

13. Tạo Application/Helpers/InputSanitizer.cs:
    - StripHtml(input): xóa tất cả HTML tags
    - ContainsMaliciousContent(input): phát hiện script injection

14. Áp dụng trong OrderService, QuoteService, ReviewService:
    order.Notes = InputSanitizer.StripHtml(request.Notes);
    review.Content = InputSanitizer.StripHtml(request.Content);

15. Giới hạn request body (Program.cs):
    builder.WebHost.ConfigureKestrel(opt =>
        opt.Limits.MaxRequestBodySize = 5 * 1024 * 1024);  // 5MB

─── P10-G: GIẢM DỮ LIỆU TRẢ VỀ ────────────────────────────

16. Review tất cả Controller — đảm bảo:
    - Không return entity trực tiếp (phải qua DTO)
    - Không trả passwordHash trong bất kỳ response nào
    - Pagination max 100 records

─── P10-H: SECURITY HEADERS & HTTPS ────────────────────────

17. Tạo API/Middleware/SecurityHeadersMiddleware.cs với 7 headers:
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    X-XSS-Protection: 1; mode=block
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Content-Security-Policy: default-src 'self'; ...
    Strict-Transport-Security: max-age=31536000; includeSubDomains

18. Ẩn Server header:
    builder.WebHost.ConfigureKestrel(opt => opt.AddServerHeader = false);

19. Thêm middleware vào Program.cs (trước UseAuthentication):
    app.UseMiddleware<SecurityHeadersMiddleware>();

─── P10-I: QUÉT DEPENDENCIES ────────────────────────────────

20. Chạy lệnh audit:
    dotnet list package --vulnerable --include-transitive

21. Tạo nuget.config tại root HuniBackend/

22. Tạo .github/workflows/security-scan.yml (GitHub Actions)

─── KIỂM TRA CUỐI CÙNG ──────────────────────────────────────

Test bảo mật:
  ✅ dotnet build → không lỗi, không warning
  ✅ GET http://localhost:5000/api/auth/login sai password 6 lần → bị khóa 15 phút
  ✅ POST /api/orders 6 lần từ cùng IP → lần 6 nhận 429
  ✅ Response headers có: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security
  ✅ Response KHÔNG có header "Server: Kestrel"
  ✅ dotnet list package --vulnerable → không có kết quả
  ✅ GET /api/auth/me → không có trường "passwordHash" trong response
```

---

## 📊 Tổng Kết Tiến Độ

```
✅ Prompt 0  — Solution + Program.cs
✅ Prompt 1  — Database + EF Core + Migrations
✅ Prompt 2  — Auth (Register + Login + JWT)
✅ Prompt 3  — Orders API
✅ Prompt 4  — Quotes + Tracking + Chat
✅ Prompt 5  — Products API
✅ Prompt 6  — Reviews API
✅ Prompt 7  — Admin APIs (7 controllers)
⬜ Prompt 8  — Frontend refactor (xóa API routes)
✅ Prompt 9  — Docker Compose
✅ Prompt 10 — Security Hardening
```

---

*HUNI Backend Prompts — Phase 2 → Phase 6*
*Ngày tạo: 02/10/2026*
