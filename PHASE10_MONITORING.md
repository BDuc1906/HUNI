# 📊 HUNI — Phase 10: Monitoring & Vận Hành

> **Điều kiện:** Hoàn thành Phase 9 (đã deploy thành công) trước khi thực hiện
> **Mục tiêu:** Theo dõi hệ thống, bắt lỗi real-time, backup dữ liệu, duy trì hệ thống ổn định

---

## ✅ PROMPT 10.1 — Cài Đặt Error Tracking (Sentry)

```
Bạn là senior DevOps engineer. Hãy tích hợp Sentry để bắt lỗi real-time
cho cả Backend C# và Frontend Next.js.

─── BACKEND: SENTRY C# ─────────────────────────────────────

1. Cài package:
dotnet add src/HuniBackend.API package Sentry.AspNetCore

2. Cập nhật appsettings.Production.json:
{
  "Sentry": {
    "Dsn": "https://YOUR_DSN@sentry.io/YOUR_PROJECT_ID",
    "Environment": "production",
    "TracesSampleRate": 0.1,        // 10% transactions được trace
    "MinimumBreadcrumbLevel": "Warning",
    "MinimumEventLevel": "Error"
  }
}

3. Cập nhật Program.cs:

builder.WebHost.UseSentry(o => {
    o.Dsn = builder.Configuration["Sentry:Dsn"];
    o.Debug = builder.Environment.IsDevelopment();
    o.TracesSampleRate = 0.1;
    o.Environment = builder.Environment.EnvironmentName;
    // Lọc các lỗi không quan trọng
    o.AddEventProcessor(new SentryEventProcessor());
});

// Cập nhật GlobalExceptionMiddleware:
public async Task InvokeAsync(HttpContext context)
{
    try { await _next(context); }
    catch (Exception ex)
    {
        // Gửi lên Sentry
        SentrySdk.CaptureException(ex);

        _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new {
            success = false,
            error = context.RequestServices
                .GetRequiredService<IWebHostEnvironment>()
                .IsDevelopment()
                ? ex.Message
                : "Có lỗi xảy ra, vui lòng thử lại sau."
        });
    }
}

// Bắt lỗi có context (ví dụ trong OrderService):
try { ... }
catch (Exception ex) {
    SentrySdk.ConfigureScope(scope => {
        scope.User = new SentryUser { Email = userEmail };
        scope.SetTag("orderNumber", orderNumber);
        scope.SetExtra("requestBody", requestJson);
    });
    SentrySdk.CaptureException(ex);
    throw;
}

─── FRONTEND: SENTRY NEXT.JS ───────────────────────────────

1. Cài package:
npm install @sentry/nextjs

2. Chạy wizard tự cấu hình:
npx @sentry/wizard@latest -i nextjs

3. Thêm vào .env.production.local:
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN@sentry.io/YOUR_PROJECT_ID

4. Cập nhật sentry.client.config.js (tự tạo bởi wizard):
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.01,  // 1% sessions được record
  replaysOnErrorSampleRate: 1.0,   // 100% sessions có lỗi được record
});

─── THIẾT LẬP SENTRY ALERTS ─────────────────────────────────

Trong Sentry Dashboard → Alerts → Create Alert Rule:

Alert 1: "Error spike"
  → Condition: Error count > 10 per hour
  → Action: Email admin@hunistore.com

Alert 2: "Payment error"
  → Condition: Error message contains "order" or "payment"
  → Action: Email + Slack (nếu có)

Alert 3: "Response time cao"
  → Condition: p95 response time > 2000ms
  → Action: Email admin

─── KIỂM TRA ────────────────────────────────────────────────

// Tạo lỗi test trong development:
[HttpGet("test-error")]
public IResult TestError()
{
    throw new Exception("Test Sentry integration");
}

GET /api/test-error → Kiểm tra Sentry dashboard có nhận được lỗi không
✅ Lỗi xuất hiện trong Sentry trong vòng 30 giây
✅ Email notification được gửi
✅ Stack trace đầy đủ, có user context
```

---

## ✅ PROMPT 10.2 — Uptime Monitoring & Alerting

```
Bạn là DevOps engineer. Hãy cài đặt uptime monitoring để nhận cảnh báo
ngay khi server down.

─── UPTIMEROBOT (MIỄN PHÍ) ─────────────────────────────────

1. Tạo tài khoản: https://uptimerobot.com
2. Add New Monitor → HTTP(s)

Monitor 1 — Backend Health:
  URL: https://[railway-url].up.railway.app/health
  Type: HTTP(s)
  Check interval: 5 phút
  Alert khi: Status code != 200

Monitor 2 — Frontend:
  URL: https://[vercel-url].vercel.app
  Type: HTTP(s)
  Check interval: 5 phút

Monitor 3 — API Products (đảm bảo DB còn sống):
  URL: https://[railway-url].up.railway.app/api/products
  Type: HTTP(s)
  Keyword: "success":true   ← phải có trong response
  Check interval: 15 phút

3. Thiết lập Alert Contacts:
  Settings → Alert Contacts → Add:
  - Email: admin@hunistore.com
  - Telegram Bot (tùy chọn — nhận ngay lập tức)

─── THIẾT LẬP STATUS PAGE ──────────────────────────────────

UptimeRobot tự tạo status page miễn phí:
https://stats.uptimerobot.com/YOUR_KEY

Hiển thị: Uptime 30 ngày, response time, incidents

─── RAILWAY BUILT-IN MONITORING ────────────────────────────

Railway Dashboard tự có:
  Metrics tab: CPU, Memory, Network, Disk usage
  Logs tab: Real-time logs stream
  Deploy tab: Deploy history

Xem logs real-time:
railway logs --tail  (cài Railway CLI trước)

─── VERCEL ANALYTICS ───────────────────────────────────────

Vercel Dashboard → Analytics:
  Core Web Vitals: LCP, CLS, FID
  Real User Monitoring
  Số lượng requests mỗi ngày

Thêm Vercel Speed Insights:
npm install @vercel/speed-insights
// Thêm vào app/layout.js:
import { SpeedInsights } from '@vercel/speed-insights/next';
<SpeedInsights />

─── KIỂM TRA ────────────────────────────────────────────────

✅ UptimeRobot ping mỗi 5 phút
✅ Nhận email test khi tắt Railway (pause project)
✅ Status page hiển thị đúng uptime %
✅ Railway metrics không có memory leak (RAM tăng dần)
```

---

## ✅ PROMPT 10.3 — Backup & Khôi Phục Dữ Liệu

```
Bạn là DevOps engineer. Hãy thiết lập backup database tự động
và quy trình khôi phục khi có sự cố.

─── SUPABASE TỰ BACKUP ─────────────────────────────────────

Supabase (free tier):
  → Backup hàng ngày, giữ 1 ngày
  → Không thể restore (upgrade lên Pro để có)

Supabase Pro ($25/tháng):
  → Point-in-time recovery
  → Backup 7 ngày
  → One-click restore

─── BACKUP THỦ CÔNG (CHO FREE TIER) ───────────────────────

1. Tạo script backup trong backend:

// API/Controllers/Admin/AdminBackupController.cs
[HttpPost("backup")]
[Authorize(Roles = "ADMIN")]
public async Task<IResult> CreateBackup()
{
    var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
    var filename = $"huni_backup_{timestamp}.json";

    var backup = new {
        timestamp = DateTime.UtcNow,
        version = "1.0",
        data = new {
            customers = await db.Customers.AsNoTracking().ToListAsync(),
            orders = await db.Orders.AsNoTracking().Include(o => o.Items).ToListAsync(),
            quotes = await db.Quotes.AsNoTracking().ToListAsync(),
            products = await db.Products.AsNoTracking().ToListAsync(),
            users = await db.Users.AsNoTracking()
                .Select(u => new { u.Id, u.Email, u.FullName, u.Role, u.CreatedAt })
                .ToListAsync(),  // KHÔNG backup passwordHash
            vouchers = await db.Vouchers.AsNoTracking().ToListAsync(),
        }
    };

    var json = JsonSerializer.Serialize(backup, new JsonSerializerOptions {
        WriteIndented = true
    });

    return Results.File(
        Encoding.UTF8.GetBytes(json),
        "application/json",
        filename
    );
}

2. Lịch backup tự động (Cron Job trong Railway):
POST /api/admin/backup mỗi ngày lúc 2AM
→ Lưu file vào Supabase Storage hoặc Google Drive

─── SCRIPT BACKUP TỪ PGADMIN 4 ────────────────────────────

pgAdmin 4 → Right-click Database "postgres" → Backup:

Format: Custom (nhỏ hơn Plain)
Filename: C:\Backups\huni_backup_20261002.backup
Compression: 5
Encoding: UTF8

Restore:
pgAdmin 4 → Right-click Database → Restore
→ Chọn file backup

─── QUY TRÌNH KHÔI PHỤC KHI SỰ CỐ ────────────────────────

CASE 1: Backend crash (Railway auto-restart):
→ Railway tự restart (max 10 lần)
→ Kiểm tra logs: railway logs --tail
→ Nếu crash liên tục: kiểm tra DB connection string

CASE 2: Database bị xóa nhầm:
→ Supabase Dashboard → Backups → Restore (cần Pro)
→ Hoặc dùng file backup từ pgAdmin
→ Chạy lại: dotnet ef database update

CASE 3: Migration sai gây lỗi DB:
→ dotnet ef migrations list  (xem danh sách)
→ dotnet ef database update [TenMigrationTruoc]  (rollback)
→ dotnet ef migrations remove  (xóa migration lỗi)
→ Sửa code → dotnet ef migrations add [TenMoi]
→ dotnet ef database update

CASE 4: Deploy lỗi làm sập production:
→ Railway → Deployments → chọn bản deploy cũ → Rollback
→ Vercel → Deployments → Promote to Production (bản cũ)

─── KIỂM TRA ────────────────────────────────────────────────

✅ POST /api/admin/backup → download được file JSON
✅ pgAdmin 4 backup thành công
✅ Restore test từ backup hoạt động
✅ Quy trình rollback Railway hoạt động
```

---

## ✅ PROMPT 10.4 — Bảo Trì Định Kỳ (Maintenance Checklist)

```
Bạn là DevOps engineer. Hãy tạo quy trình bảo trì định kỳ
cho HUNI production system.

─── HÀNG NGÀY (5 phút) ─────────────────────────────────────

□ Kiểm tra UptimeRobot: uptime % có bình thường không?
□ Kiểm tra Sentry: có error mới không?
□ Kiểm tra Railway metrics: RAM, CPU có bình thường không?
□ Kiểm tra đơn hàng mới trong admin panel

─── HÀNG TUẦN (15 phút) ────────────────────────────────────

□ Xem Sentry trends: lỗi nào phổ biến nhất tuần qua?
□ Xem Vercel Analytics: trang nào slow nhất?
□ Backup thủ công database qua pgAdmin 4
□ Kiểm tra Railway logs: có warning nào lạ không?
□ Test thủ công 5 chức năng chính: đặt hàng, đăng nhập, sản phẩm, chat, tracking

─── HÀNG THÁNG (30 phút) ───────────────────────────────────

□ Quét vulnerability NuGet packages:
  dotnet list package --vulnerable --include-transitive
  → Update nếu có lỗ hổng

□ Quét vulnerability npm packages:
  npm audit
  npm audit fix

□ Kiểm tra certificates SSL còn hạn bao lâu
□ Đổi Supabase DB password (nếu muốn tăng bảo mật)
□ Xem báo cáo: doanh thu, đơn hàng, khách hàng mới
□ Review và xóa logs cũ nếu đầy disk

─── HÀNG QUÝ (1-2 tiếng) ──────────────────────────────────

□ Update .NET 9 → patch version mới nhất
  dotnet --version  → xem version hiện tại
  → Cập nhật Dockerfile, rebuild và redeploy

□ Update Next.js → version mới nhất
  npm outdated
  npm update next react react-dom

□ Review toàn bộ API performance:
  → Endpoint nào > 500ms? Cần tối ưu không?

□ Review database indexes:
  pgAdmin 4 → Tools → Query Tool:
  SELECT schemaname, tablename, indexname, idx_scan
  FROM pg_stat_user_indexes ORDER BY idx_scan;
  → Index nào không được dùng? Xóa bớt?

□ Dọn dẹp data:
  → Xóa quotes cũ > 1 năm status CLOSED
  → Xóa sessions hết hạn

─── SCRIPT HEALTH CHECK TỰ ĐỘNG ────────────────────────────

Tạo file scripts/health-check.ps1 (Windows):

$urls = @(
    "https://[railway-url].up.railway.app/health",
    "https://[railway-url].up.railway.app/api/products",
    "https://[vercel-url].vercel.app"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url → OK ($($response.StatusCode))"
        } else {
            Write-Host "⚠️ $url → $($response.StatusCode)"
        }
    } catch {
        Write-Host "❌ $url → FAILED: $($_.Exception.Message)"
        # Gửi email cảnh báo (tùy chọn)
    }
}

# Chạy: .\scripts\health-check.ps1
```

---

## ✅ PROMPT 10.5 — Dashboard Admin Theo Dõi Hệ Thống

```
Bạn là senior .NET developer. Hãy thêm endpoint theo dõi hệ thống
cho Admin trong HuniBackend.

─── SYSTEM STATUS ENDPOINT ─────────────────────────────────

// API/Controllers/Admin/AdminSystemController.cs

[Authorize(Roles = "ADMIN")]
[HttpGet("system/status")]
public async Task<IResult> GetSystemStatus()
{
    var process = System.Diagnostics.Process.GetCurrentProcess();
    var uptime = DateTime.UtcNow - process.StartTime.ToUniversalTime();

    // DB stats
    var dbStats = await Task.WhenAll(
        db.Customers.CountAsync(),
        db.Orders.CountAsync(),
        db.Orders.SumAsync(o => (long?)o.Total) ?? 0,
        db.Products.CountAsync(),
        db.Vouchers.CountAsync(v => v.Active)
    );

    // Đơn hàng 30 ngày qua
    var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
    var recentOrders = await db.Orders
        .Where(o => o.CreatedAt >= thirtyDaysAgo)
        .GroupBy(o => o.Status)
        .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
        .ToListAsync();

    return ApiOk(new {
        server = new {
            uptime = uptime.ToString(@"dd\.hh\:mm\:ss"),
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            memoryUsageMB = Math.Round(process.WorkingSet64 / 1024.0 / 1024.0, 1),
            timestamp = DateTime.UtcNow
        },
        database = new {
            totalCustomers = dbStats[0],
            totalOrders = dbStats[1],
            totalRevenue = dbStats[2],
            totalProducts = dbStats[3],
            activeVouchers = dbStats[4],
            status = "connected"
        },
        orders30Days = recentOrders
    });
}

[HttpGet("system/logs")]
[Authorize(Roles = "ADMIN")]
public IResult GetRecentLogs([FromQuery] int lines = 100)
{
    var logDir = "logs";
    if (!Directory.Exists(logDir))
        return ApiNotFound("Không có log file");

    var logFile = Directory.GetFiles(logDir, "huni-*.log")
        .OrderByDescending(f => f)
        .FirstOrDefault();

    if (logFile == null)
        return ApiNotFound("Chưa có log nào");

    var recentLines = System.IO.File.ReadLines(logFile)
        .TakeLast(Math.Min(lines, 500))
        .ToList();

    return ApiOk(new {
        file = Path.GetFileName(logFile),
        lines = recentLines.Count,
        content = recentLines
    });
}

─── KIỂM TRA ─────────────────────────────────────────────────

GET /api/admin/system/status (ADMIN token)
→ {
     "server": { "uptime": "00.02:30:15", "memoryUsageMB": 87.3 },
     "database": { "totalOrders": 42, "totalRevenue": 15000000 },
     "orders30Days": [...]
   }

GET /api/admin/system/logs?lines=50
→ 50 dòng log gần nhất
```

---

## 📅 Lịch Vận Hành Tóm Tắt

| Tần suất | Công việc | Thời gian |
|----------|----------|-----------|
| **Hàng ngày** | Kiểm tra UptimeRobot + Sentry + đơn hàng | 5 phút |
| **Hàng tuần** | Xem trends lỗi + backup DB + test chức năng | 15 phút |
| **Hàng tháng** | Quét vulnerability + đổi password + review metrics | 30 phút |
| **Hàng quý** | Update .NET + Next.js + review performance | 1-2 tiếng |

---

## 📊 Tóm Tắt Phase 10

```
Prompt 10.1 → Sentry (bắt lỗi real-time FE + BE)
Prompt 10.2 → UptimeRobot (cảnh báo server down)
Prompt 10.3 → Backup + Quy trình khôi phục
Prompt 10.4 → Maintenance checklist định kỳ
Prompt 10.5 → Admin endpoint theo dõi hệ thống

Sau Phase 10:
  ✅ Lỗi được bắt real-time qua Sentry
  ✅ Cảnh báo khi server down trong < 5 phút
  ✅ Backup dữ liệu hàng tuần
  ✅ Quy trình rollback rõ ràng
  ✅ Dashboard admin theo dõi sức khỏe hệ thống
  → HỆ THỐNG SẴN SÀNG VẬN HÀNH THỰC TẾ! 🎉
```

---

## 🗺️ Toàn Bộ Lộ Trình HUNI

```
BACKEND (C# .NET 9):
  ✅ Phase P0-P10  → Build toàn bộ API (12-17 ngày)
  ✅ Phase 7       → Kiểm thử (2-3 ngày)
  ✅ Phase 8       → Chuẩn bị production (1-2 ngày)
  ✅ Phase 9       → Deploy Railway + Vercel (1 ngày)
  ✅ Phase 10      → Monitoring + vận hành (ongoing)

FRONTEND (Next.js):
  ✅ Prompt 8      → Xóa API routes, thêm apiClient
  ✅ Deploy Vercel

TỔNG THỜI GIAN: 16-23 ngày để hoàn thành
```

---

*📊 HUNI Phase 10 — Monitoring & Vận Hành*
*Sentry + UptimeRobot + Backup + Maintenance*
*Ngày tạo: 02/10/2026*
