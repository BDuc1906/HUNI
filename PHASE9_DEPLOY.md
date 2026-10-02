# 🌐 HUNI — Phase 9: Deploy Thật Sự

> **Điều kiện:** Hoàn thành Phase 8 (production config xong) trước khi thực hiện
> **Mục tiêu:** Deploy Backend lên Railway + Frontend lên Vercel, chạy được end-to-end thật sự

---

## ✅ PROMPT 9.1 — Chuẩn Bị GitHub Repository

```
Bạn là DevOps engineer. Hãy chuẩn bị 2 GitHub repositories
cho HUNI Frontend và Backend trước khi deploy.

─── TẠO 2 REPOSITORIES ─────────────────────────────────────

Repo 1: huni-frontend  (chứa Next.js code — thư mục HUNI/)
Repo 2: huni-backend   (chứa C# code — thư mục HuniBackend/)

─── KIỂM TRA .GITIGNORE ────────────────────────────────────

# huni-backend/.gitignore (phải có các dòng này):
appsettings.Development.json
appsettings.Production.json
appsettings.Staging.json
.env
*.env.*
secrets.json
**/*.pfx
**/*.p12
bin/
obj/
publish/
logs/
*.user
.vs/
.vscode/settings.json

# huni-frontend/.gitignore (phải có):
.env.local
.env.production.local
.env*.local
node_modules/
.next/

─── TẠO FILE .env.example ─────────────────────────────────

# huni-backend/.env.example (commit lên git — không có giá trị thật):
DATABASE_URL=
JWT_SECRET_KEY=
GEMINI_API_KEY=
EMAIL_FROM=
EMAIL_PASSWORD=
ADMIN_EMAIL=
FRONTEND_URL=

# huni-frontend/.env.example:
NEXT_PUBLIC_API_URL=
NEXTAUTH_URL=

─── COMMIT VÀ PUSH ─────────────────────────────────────────

# Backend
git init
git add .
git commit -m "feat: initial HuniBackend C# .NET 9"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/huni-backend.git
git push -u origin main

# Frontend
git init
git add .
git commit -m "feat: HUNI frontend - refactored to call C# backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/huni-frontend.git
git push -u origin main

─── XÁC NHẬN ────────────────────────────────────────────────

✅ Không có file appsettings.Development.json trong repo
✅ Không có file .env.local trong repo
✅ Không có credentials nào trong bất kỳ file nào được commit
✅ .gitignore hoạt động đúng
```

---

## ✅ PROMPT 9.2 — Deploy Backend lên Railway

```
Bạn là DevOps engineer. Hãy deploy HuniBackend C# .NET 9 lên Railway.app.

─── BƯỚC 1: TẠO TÀI KHOẢN RAILWAY ─────────────────────────

1. Vào https://railway.app
2. Sign up bằng GitHub account
3. Kết nối Railway với GitHub của bạn

─── BƯỚC 2: TẠO PROJECT RAILWAY ────────────────────────────

1. New Project → Deploy from GitHub Repo
2. Chọn repo huni-backend
3. Railway tự nhận diện .NET project

─── BƯỚC 3: THÊM ENVIRONMENT VARIABLES ────────────────────

Vào tab Variables → thêm từng biến:

Tên biến                              Giá trị
─────────────────────────────────     ──────────────────────────────────────
ASPNETCORE_ENVIRONMENT               Production
ASPNETCORE_URLS                      http://0.0.0.0:$PORT
ConnectionStrings__DefaultConnection Host=db.xxx.supabase.co;Port=5432;...
Jwt__SecretKey                       [chuỗi 64 ký tự ngẫu nhiên]
Jwt__Issuer                          HuniBackend
Jwt__Audience                        HuniClient
Jwt__ExpiresInDays                   30
Gemini__ApiKey                       AIzaSy...
Gemini__ModelId                      gemini-2.5-flash
Email__SmtpHost                      smtp.gmail.com
Email__SmtpPort                      587
Email__FromEmail                     noreply@hunistore.com
Email__Password                      [gmail app password]
Email__AdminEmail                    admin@hunistore.com
Cors__AllowedOrigins__0              https://huni-frontend.vercel.app

LƯU Ý QUAN TRỌNG:
- Railway dùng $PORT tự động → phải set ASPNETCORE_URLS=http://0.0.0.0:$PORT
- Không hardcode port 5000 trong Railway

─── BƯỚC 4: TẠO RAILWAY NIXPACKS CONFIG ───────────────────

Tạo file railway.json ở root HuniBackend/:

{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "dotnet HuniBackend.API.dll",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

─── BƯỚC 5: TẠO RAILWAY DOCKERFILE (nếu Nixpacks fail) ────

Tạo Dockerfile ở root HuniBackend/:

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish src/HuniBackend.API/HuniBackend.API.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT
EXPOSE $PORT
ENTRYPOINT ["dotnet", "HuniBackend.API.dll"]

─── BƯỚC 6: THEO DÕI DEPLOY ────────────────────────────────

1. Railway tự động build khi push code lên GitHub
2. Xem logs real-time trong tab Deployments
3. Đợi status "Active" (thường 2-5 phút)

─── BƯỚC 7: CHẠY DB MIGRATION TRÊN RAILWAY ────────────────

Sau khi deploy thành công, chạy migration:

Option A — Railway Shell:
1. Tab Settings → Open Shell
2. dotnet ef database update --project src/HuniBackend.Infrastructure --startup-project src/HuniBackend.API

Option B — Tự động trong Program.cs:
// Thêm vào Program.cs nếu chưa có:
using var startupScope = app.Services.CreateScope();
var startupDb = startupScope.ServiceProvider.GetRequiredService<AppDbContext>();
startupDb.Database.Migrate();  // Tự migrate khi khởi động

─── BƯỚC 8: THÊM CUSTOM DOMAIN (tùy chọn) ─────────────────

Railway mặc định: https://huni-backend.up.railway.app
Custom domain:    https://api.hunistore.com

1. Tab Settings → Custom Domain → Add Domain
2. Thêm DNS record tại nhà cung cấp domain:
   Type: CNAME
   Name: api
   Value: huni-backend.up.railway.app

─── KIỂM TRA SAU DEPLOY ────────────────────────────────────

URL của bạn: https://[project-name].up.railway.app

✅ GET https://[url]/health   → { "status": "healthy" }
✅ GET https://[url]/ping     → "pong"
✅ GET https://[url]/api/products → 200 + list sản phẩm
✅ Không có /swagger (production)
✅ HTTPS tự động (Railway tự cấp SSL)
```

---

## ✅ PROMPT 9.3 — Deploy Frontend lên Vercel

```
Bạn là senior Next.js developer. Hãy deploy HUNI Frontend lên Vercel.

─── BƯỚC 1: CẤU HÌNH NEXT.JS CHO PRODUCTION ──────────────

Kiểm tra next.config.js có đúng không:

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',          // Cần cho Docker
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },
  // Không có DATABASE_URL hay Prisma config ở đây
};

export default nextConfig;

─── BƯỚC 2: DEPLOY LÊN VERCEL ──────────────────────────────

Option A — Vercel CLI (nhanh nhất):

npm i -g vercel
vercel login
vercel  # Deploy ngay, trả lời các câu hỏi

Option B — Vercel Dashboard:
1. Vào https://vercel.com → New Project
2. Import GitHub repo huni-frontend
3. Framework Preset: Next.js (tự nhận)
4. Root Directory: ./  (để mặc định)

─── BƯỚC 3: THÊM ENVIRONMENT VARIABLES VERCEL ─────────────

Trong Vercel Dashboard → Settings → Environment Variables:

Tên biến                    Môi trường      Giá trị
─────────────────────────   ─────────────   ──────────────────────────────────
NEXT_PUBLIC_API_URL         All             https://[railway-url].up.railway.app
NEXTAUTH_URL                Production      https://[your-app].vercel.app
NEXTAUTH_SECRET             All             [random 32+ char string]

LƯU Ý:
- NEXT_PUBLIC_* được expose cho browser → chỉ chứa URL, KHÔNG chứa secrets
- Không có DATABASE_URL (frontend không kết nối DB trực tiếp nữa)

─── BƯỚC 4: CẬP NHẬT CORS BACKEND ─────────────────────────

Sau khi Vercel cấp URL (vd: huni-frontend.vercel.app), cập nhật Railway:

Cors__AllowedOrigins__0 = https://huni-frontend.vercel.app
Cors__AllowedOrigins__1 = https://www.hunistore.com   (khi có domain thật)

Redeploy Railway để nhận CORS mới.

─── BƯỚC 5: CUSTOM DOMAIN VERCEL (tùy chọn) ───────────────

Vercel Dashboard → Settings → Domains → Add:
hunistore.com → www.hunistore.com

DNS tại nhà cung cấp domain:
  Type: A     | Name: @   | Value: 76.76.21.21
  Type: CNAME | Name: www | Value: cname.vercel-dns.com

─── BƯỚC 6: KIỂM TRA END-TO-END ────────────────────────────

Mở https://[vercel-url].vercel.app

Luồng test hoàn chỉnh:
1. ✅ Trang chủ load được, có sản phẩm hiển thị
2. ✅ Click vào sản phẩm → xem chi tiết
3. ✅ Đăng ký tài khoản mới
4. ✅ Đăng nhập → token lưu trong browser
5. ✅ Thêm sản phẩm vào giỏ → tạo đơn hàng
6. ✅ Tra cứu đơn hàng vừa tạo
7. ✅ Chat với AI chatbot
8. ✅ Admin login → vào dashboard → xem đơn hàng
9. ✅ Network tab: tất cả API calls đến Railway URL (không có /api routes Next.js)

─── TROUBLESHOOTING THƯỜNG GẶP ─────────────────────────────

Lỗi CORS:
→ Kiểm tra Cors__AllowedOrigins trong Railway khớp với Vercel URL

Lỗi 401 khi gọi API:
→ Kiểm tra token được lưu đúng trong localStorage
→ Kiểm tra Authorization header được gửi đúng

Lỗi "fetch failed" trên Vercel:
→ Kiểm tra NEXT_PUBLIC_API_URL đúng Railway URL (có https://)
→ Railway server có đang chạy không?

Sản phẩm không hiển thị:
→ Railway DB migration đã chạy chưa?
→ Static products loader có hoạt động không?
```

---

## 📊 Tóm Tắt Phase 9

```
Prompt 9.1 → Chuẩn bị GitHub repos (2 repos riêng biệt, .gitignore sạch)
Prompt 9.2 → Deploy Backend C# → Railway.app (~5 phút)
Prompt 9.3 → Deploy Frontend Next.js → Vercel (~3 phút)

Sau Phase 9:
  ✅ Backend chạy tại: https://[name].up.railway.app
  ✅ Frontend chạy tại: https://[name].vercel.app
  ✅ HTTPS tự động cho cả 2
  ✅ End-to-end hoạt động: FE → BE → DB
  ✅ Sẵn sàng Phase 10: Monitoring!
```

---

*🌐 HUNI Phase 9 — Deploy Production*
*Backend: Railway.app | Frontend: Vercel | DB: Supabase PostgreSQL*
*Ngày tạo: 02/10/2026*
