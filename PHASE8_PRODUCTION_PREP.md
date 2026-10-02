# 🚀 HUNI Backend — Phase 8: Chuẩn Bị Production

> **Điều kiện:** Hoàn thành Phase 7 (tất cả tests pass) trước khi thực hiện
> **Mục tiêu:** Cấu hình môi trường production, tối ưu hiệu năng, chọn hosting phù hợp

---

## ✅ PROMPT 8.1 — Cấu Hình Môi Trường Production

```
Bạn là senior .NET DevOps engineer. Hãy cấu hình HuniBackend
cho môi trường production.

─── BƯỚC 1: TẮT CÁC TÍNH NĂNG DEV-ONLY ────────────────────

Cập nhật Program.cs:

// Swagger chỉ bật ở Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HUNI API v1");
        c.RoutePrefix = "swagger";
    });
}

// Chỉ migrate tự động ở Development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

─── BƯỚC 2: appsettings.Production.json ────────────────────

Tạo file src/HuniBackend.API/appsettings.Production.json:
(KHÔNG commit lên git — chỉ có trên server production)

{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "Jwt": {
    "SecretKey": "",
    "Issuer": "HuniBackend",
    "Audience": "HuniClient",
    "ExpiresInDays": 30
  },
  "Cors": {
    "AllowedOrigins": [
      "https://hunistore.com",
      "https://www.hunistore.com"
    ]
  },
  "Gemini": {
    "ApiKey": "",
    "ModelId": "gemini-2.5-flash",
    "FallbackModels": ["gemini-2.5-flash-lite", "gemini-2.0-flash"]
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "FromEmail": "noreply@hunistore.com",
    "Password": "",
    "AdminEmail": "admin@hunistore.com"
  },
  "RateLimit": {
    "OrdersPerHour": 5
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Kestrel": {
    "AddServerHeader": false
  }
}

─── BƯỚC 3: Cấu Hình Logging Production ────────────────────

Cài Serilog:
dotnet add src/HuniBackend.API package Serilog.AspNetCore
dotnet add src/HuniBackend.API package Serilog.Sinks.Console
dotnet add src/HuniBackend.API package Serilog.Sinks.File

Cập nhật Program.cs (đầu file):

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/huni-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

─── BƯỚC 4: Health Check Endpoint Nâng Cao ─────────────────

Cài thêm:
dotnet add src/HuniBackend.API package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore

Cập nhật Program.cs:

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddCheck("gemini_api", () => {
        // Inject IConfiguration đúng cách qua DI (không dùng builder.Configuration sau Build())
        var config = builder.Configuration; // OK ở đây vì chưa gọi builder.Build()
        var apiKey = config["Gemini:ApiKey"];
        return !string.IsNullOrEmpty(apiKey)
            ? HealthCheckResult.Healthy("Gemini API key configured")
            : HealthCheckResult.Degraded("Gemini API key not configured");
    });

// ⚠️ LƯU Ý: đoạn AddCheck phải nằm TRƯỚC builder.Build()
// Nếu cần dùng sau Build(), inject IConfiguration qua constructor:
// builder.Services.AddSingleton<GeminiHealthCheck>();
// .AddCheck<GeminiHealthCheck>("gemini_api");


// Thay health check endpoint cũ:
app.MapHealthChecks("/health", new HealthCheckOptions {
    ResponseWriter = async (context, report) => {
        context.Response.ContentType = "application/json";
        var result = new {
            status = report.Status.ToString().ToLower(),
            timestamp = DateTime.UtcNow,
            service = "HuniBackend",
            version = "1.0.0",
            checks = report.Entries.Select(e => new {
                name = e.Key,
                status = e.Value.Status.ToString().ToLower(),
                duration = e.Value.Duration.TotalMilliseconds
            })
        };
        await context.Response.WriteAsJsonAsync(result);
    }
});

// Health check đơn giản cho load balancer (không cần auth)
app.MapGet("/ping", () => "pong");

─── BƯỚC 5: Tắt Thông Tin Nhạy Cảm ────────────────────────

// Middleware: ẩn stack trace trong response lỗi production
app.UseExceptionHandler(errApp => {
    errApp.Run(async ctx => {
        ctx.Response.StatusCode = 500;
        ctx.Response.ContentType = "application/json";
        var error = ctx.Features.Get<IExceptionHandlerFeature>();
        if (error != null)
        {
            // Production: không lộ chi tiết lỗi
            var isDev = ctx.RequestServices
                .GetRequiredService<IWebHostEnvironment>()
                .IsDevelopment();

            await ctx.Response.WriteAsJsonAsync(new {
                success = false,
                error = isDev ? error.Error.Message : "Có lỗi xảy ra, vui lòng thử lại.",
                detail = isDev ? error.Error.StackTrace : null
            });
        }
    });
});

─── BƯỚC 5b: Security Headers ──────────────────────────────

// Thêm middleware bảo mật HTTP headers (đặt sớm trong pipeline):
app.Use(async (ctx, next) => {
    ctx.Response.Headers["X-Content-Type-Options"]  = "nosniff";
    ctx.Response.Headers["X-Frame-Options"]          = "DENY";
    ctx.Response.Headers["Referrer-Policy"]          = "no-referrer";
    ctx.Response.Headers["X-XSS-Protection"]         = "1; mode=block";
    ctx.Response.Headers["Permissions-Policy"]       = "geolocation=(), microphone=()";
    // Chỉ bật HSTS khi đã có HTTPS:
    if (!ctx.Request.IsHttps == false)
        ctx.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    await next();
});



─── BƯỚC 6: Chuẩn Bị Secrets Production ───────────────────

Sinh JWT Secret mạnh (chạy trong terminal):

# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

# Hoặc Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

Đổi Supabase DB password:
1. Supabase Dashboard → Project Settings → Database → Reset password
2. Cập nhật CONNECTION_STRING với password mới
3. Xác nhận pgAdmin 4 vẫn kết nối được

─── KIỂM TRA ────────────────────────────────────────────────

ASPNETCORE_ENVIRONMENT=Production dotnet run --project src/HuniBackend.API

✅ Swagger KHÔNG xuất hiện tại /swagger
✅ GET /health → { "status": "healthy", "checks": [...] }
✅ GET /ping → "pong"
✅ Lỗi 500 trả về "Có lỗi xảy ra" (không lộ stack trace)
✅ Logs ghi vào logs/huni-YYYYMMDD.log
✅ Security headers xuất hiện trong response (kiểm tra DevTools → Network → Response Headers)
✅ CORS chặn origin lạ:
   curl -I -H "Origin: https://evil.com" http://localhost:5000/api/products
   # → KHÔNG thấy Access-Control-Allow-Origin: https://evil.com
```


---

## ✅ PROMPT 8.2 — Tối Ưu Hiệu Năng

```
Bạn là senior .NET performance engineer. Hãy tối ưu hiệu năng
HuniBackend trước khi deploy production.

─── 1. RESPONSE COMPRESSION ────────────────────────────────

Cập nhật Program.cs:

builder.Services.AddResponseCompression(opt => {
    opt.EnableForHttps = true;
    opt.Providers.Add<BrotliCompressionProvider>();
    opt.Providers.Add<GzipCompressionProvider>();
    opt.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat([
        "application/json"
    ]);
});

builder.Services.Configure<BrotliCompressionProviderOptions>(opt =>
    opt.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(opt =>
    opt.Level = CompressionLevel.Fastest);

// Pipeline (đặt sớm nhất có thể)
app.UseResponseCompression();

─── 2. RESPONSE CACHING (Products & Static Data) ──────────

builder.Services.AddOutputCache(opt => {
    opt.AddPolicy("Products5min", p => p
        .Expire(TimeSpan.FromMinutes(5))
        .Tag("products"));          // ← Tag để invalidate khi có mutation
    opt.AddPolicy("Static1h",     p => p
        .Expire(TimeSpan.FromHours(1))
        .Tag("static"));
});

app.UseOutputCache();

// Áp dụng vào ProductsController:
[HttpGet]
[OutputCache(PolicyName = "Products5min")]
public async Task<IResult> GetProducts([FromQuery] ProductQueryParams query)
{ ... }

// Khi admin thêm/sửa/xóa product → invalidate cache:
// Inject IOutputCacheStore vào service rồi gọi:
// await cache.EvictByTagAsync("products", cancellationToken);


─── 3. DB QUERY OPTIMIZATION ───────────────────────────────

Thêm AsNoTracking() cho tất cả GET queries (không cần tracking):

// Trong tất cả Service.GetAsync() methods:
var orders = await db.Orders
    .AsNoTracking()            // ← Thêm dòng này
    .Include(o => o.Customer)
    .Include(o => o.Items)
    .Where(...)
    .OrderByDescending(o => o.CreatedAt)
    .Skip((page - 1) * limit)
    .Take(limit)
    .ToListAsync();

// Đối với Admin Dashboard — chạy song song thay vì tuần tự:
var totalTask   = db.Orders.AsNoTracking().CountAsync();
var revenueTask = db.Orders.AsNoTracking()
    .Where(o => o.Status != OrderStatus.CANCELLED)
    .SumAsync(o => (long)o.Total);
var pendingTask = db.Orders.AsNoTracking()
    .CountAsync(o => o.Status == OrderStatus.PENDING);

await Task.WhenAll(totalTask, revenueTask, pendingTask);

var total   = totalTask.Result;
var revenue = revenueTask.Result;
var pending = pendingTask.Result;

─── 4. DB CONNECTION POOL ──────────────────────────────────

Cập nhật connection string (thêm pool settings):

Host=db.xxx.supabase.co;Port=5432;Database=postgres;
Username=postgres.xxx;Password=...;
SSL Mode=Require;Trust Server Certificate=true;
Maximum Pool Size=20;                  ← Tối đa 20 connections
Minimum Pool Size=2;                   ← Giữ sẵn 2 connections
Connection Idle Lifetime=300;          ← Đóng connection nhàn rỗi sau 5 phút
Connection Pruning Interval=10;

─── 5. PAGINATION BẮT BUỘC ────────────────────────────────

Kiểm tra tất cả GET list endpoints đều có pagination:
- Không cho trả toàn bộ records
- Default: page=1, limit=20
- Max limit = 100 (orders/products) | 50 (reviews) | 200 (admin)

─── KIỂM TRA HIỆU NĂNG ─────────────────────────────────────

# Cài k6 để load test
choco install k6   # Windows

# Tạo file load-test.js:
import http from 'k6/http';
export const options = { vus: 50, duration: '30s' };
export default function () {
    http.get('http://localhost:5000/api/products');
}

# Chạy test
k6 run load-test.js

# Mục tiêu:
✅ p95 response time < 200ms (GET /api/products)
✅ p95 response time < 500ms (POST /api/orders)
✅ Không có lỗi 500 khi 50 users đồng thời
✅ Memory không tăng liên tục (không có memory leak)
```

---

## ✅ PROMPT 8.3 — Chọn Hosting & Cấu Hình Môi Trường

```
Bạn là DevOps engineer. Hãy hướng dẫn chọn và cấu hình hosting
cho HUNI Backend C# .NET 9.

─── SO SÁNH HOSTING OPTIONS ────────────────────────────────

| Platform    | Giá           | RAM    | CPU   | Khó  | Phù hợp      |
|-------------|---------------|--------|-------|------|--------------|
| Railway     | ~$5/tháng     | 512MB  | Share | Dễ   | Demo/Startup |
| Render      | Free/$7/tháng | 512MB  | Share | Dễ   | Demo/Startup |
| Fly.io      | ~$3-7/tháng   | 256MB+ | Share | Vừa  | Production   |
| VPS Vultr   | $6/tháng      | 1GB    | 1vCPU | Khó  | Production   |
| Azure App   | ~$13/tháng    | 1.75GB | Share | Vừa  | Enterprise   |

→ KHUYẾN NGHỊ: Railway (bắt đầu) → VPS Vultr (khi có traffic)

─── CẤU HÌNH RAILWAY (KHUYẾN NGHỊ CHO BẮT ĐẦU) ────────────

1. Tạo tài khoản railway.app
2. New Project → Deploy from GitHub repo
3. Chọn repo HuniBackend
4. Thêm Environment Variables:
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=Host=db.xxx.supabase.co;...
   Jwt__SecretKey=your-256bit-secret
   Jwt__Issuer=HuniBackend
   Jwt__Audience=HuniClient
   Jwt__ExpiresInDays=30
   Gemini__ApiKey=AIzaSy...
   Email__Password=gmail-app-password
   Email__AdminEmail=admin@hunistore.com
   Cors__AllowedOrigins__0=https://hunistore.vercel.app

   ⚠️ NẾU PASSWORD CÓ KÝ TỰ ĐẶC BIỆT (;, @, =, #):
   Dùng URI format thay vì key=value format để tránh parse lỗi:
   ConnectionStrings__DefaultConnection=postgresql://postgres.xxx:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres?sslmode=require


5. Railway tự detect .NET project → tự build và deploy
6. Sau deploy → nhận URL: https://huni-backend.up.railway.app

─── CẤU HÌNH VPS (PRODUCTION SCALE) ──────────────────────

# Trên VPS Ubuntu 22.04:

# 1. Cài .NET 9 Runtime
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages.deb
sudo dpkg -i packages.deb
sudo apt-get update && sudo apt-get install -y dotnet-runtime-9.0

# 2. Publish backend
dotnet publish src/HuniBackend.API -c Release -o /var/www/huni-backend

# 3. Tạo systemd service
sudo nano /etc/systemd/system/huni-backend.service

[Unit]
Description=HUNI Backend C# .NET 9
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/huni-backend
ExecStart=/usr/bin/dotnet HuniBackend.API.dll
Restart=always
RestartSec=10
EnvironmentFile=/var/www/huni-backend/.env.production
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000
StandardOutput=journal
StandardError=journal
SyslogIdentifier=huni-backend

[Install]
WantedBy=multi-user.target

# 4. Khởi động service
sudo systemctl daemon-reload
sudo systemctl enable huni-backend
sudo systemctl start huni-backend
sudo systemctl status huni-backend  # Phải thấy "active (running)"

# 5. Cài Nginx làm reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/huni-api

server {
    listen 80;
    server_name api.hunistore.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
        client_max_body_size 5M;
    }
}

sudo ln -s /etc/nginx/sites-available/huni-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# 6. Cài SSL miễn phí (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.hunistore.com
# → Tự cấu hình HTTPS + tự gia hạn

─── KIỂM TRA SAU DEPLOY ────────────────────────────────────

✅ GET https://api.hunistore.com/health → { "status": "healthy" }
✅ GET https://api.hunistore.com/ping → "pong"
✅ HTTPS hoạt động (chứng chỉ xanh)
✅ HTTP tự redirect sang HTTPS
✅ Swagger KHÔNG xuất hiện (production mode)
✅ Frontend gọi được: NEXT_PUBLIC_API_URL=https://api.hunistore.com
```

---

## 📊 Tóm Tắt Phase 8

```
Prompt 8.1 → Cấu hình production (tắt Swagger, logging, health check nâng cao)
Prompt 8.2 → Tối ưu hiệu năng (compression, caching, AsNoTracking, connection pool)
Prompt 8.3 → Chọn hosting + cấu hình Railway / VPS + Nginx + SSL

Kết quả sau Phase 8:
  ✅ Backend sẵn sàng chạy production
  ✅ Logs ghi vào file xoay vòng 30 ngày
  ✅ Health check endpoint đầy đủ
  ✅ Response time p95 < 200ms
  ✅ Hosting được chọn và cấu hình
  → Sẵn sàng Phase 9: Deploy thật!
```

---

*🚀 HUNI Phase 8 — Chuẩn Bị Production*
*Ngày tạo: 02/10/2026*
