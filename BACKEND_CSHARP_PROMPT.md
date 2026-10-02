# 🏗️ HUNI — KIẾN TRÚC TÁCH BIỆT FE / BE

## Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                     NGƯỜI DÙNG (Browser)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND — Next.js 15 (PORT 3000)                  │
│                                                                 │
│  ✅ Chỉ làm:   Giao diện UI · Routing · SSR/CSR                 │
│  ✅ Gọi:       C# Backend qua HTTP API                          │
│  ❌ KHÔNG:     Kết nối DB trực tiếp                             │
│  ❌ KHÔNG:     Prisma · Database URL · Business logic           │
│  ❌ XÓA:       src/app/api/** (toàn bộ API routes)              │
│  ❌ XÓA:       src/server/** (db.js, validators, vouchers...)   │
│  ❌ XÓA:       prisma/ folder                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP REST API (JSON)
                            │ Authorization: Bearer <JWT>
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│             BACKEND — C# .NET 9 Web API (PORT 5000)             │
│                                                                 │
│  ✅ Quản lý:  Toàn bộ business logic                            │
│  ✅ Quản lý:  Authentication & Authorization (JWT)              │
│  ✅ Quản lý:  Validation · Price guard · Voucher                │
│  ✅ Quản lý:  Email · Chat AI · Rate limiting                   │
│  ✅ Kết nối:  PostgreSQL (EF Core) — chủ sở hữu duy nhất       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│          DATABASE — PostgreSQL trên Supabase (DB TRỐNG)         │
│                                                                 │
│  Chỉ C# Backend được phép truy cập                              │
│  EF Core Migrations sẽ tạo toàn bộ bảng từ đầu                 │
│  Frontend KHÔNG có DATABASE_URL                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Hướng Dẫn Kết Nối Supabase (DB Trống → C# Tạo Bảng)

> ⚠️ **KHÔNG gửi password, connection string vào chat.**
> Chỉ điền vào file local trên máy bạn — không commit lên git.

### Bước 1 — Lấy Connection String từ Supabase Dashboard

```
1. Vào https://supabase.com/dashboard → chọn Project của bạn
2. Click Settings (⚙️) ở sidebar trái → Database
3. Kéo xuống mục "Connection string"
4. Chọn tab "URI" hoặc tự ghép theo format sau:

   Host=db.XXXXXXXXXXXX.supabase.co
   Port=5432
   Database=postgres
   Username=postgres.XXXXXXXXXXXX
   Password=<mật khẩu bạn đặt khi tạo project>
   SSL Mode=Require
   Trust Server Certificate=true
```

### Bước 2 — Tạo file cấu hình local (KHÔNG commit lên git)

Tạo file `HuniBackend/src/HuniBackend.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.XXXXXX.supabase.co;Port=5432;Database=postgres;Username=postgres.XXXXXX;Password=MAT_KHAU_DB;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "SecretKey": "chuoi-bi-mat-toi-thieu-32-ky-tu-thay-ngay-day!"
  },
  "Gemini": {
    "ApiKey": "AIzaSy_KEY_CUA_BAN"
  },
  "Email": {
    "Password": "gmail-app-password"
  }
}
```

### Bước 3 — Thêm vào `.gitignore` (bắt buộc)

```gitignore
# HuniBackend/.gitignore
appsettings.Development.json
appsettings.Production.json
.env
*.user
bin/
obj/
```

### Bước 4 — Chạy EF Migrations (C# tạo bảng lên Supabase)

```bash
# Cài EF CLI (một lần duy nhất)
dotnet tool install --global dotnet-ef

# Từ thư mục gốc HuniBackend/:
dotnet ef migrations add InitialCreate \
  --project src/HuniBackend.Infrastructure \
  --startup-project src/HuniBackend.API \
  --output-dir Data/Migrations

# Áp dụng lên Supabase
dotnet ef database update \
  --project src/HuniBackend.Infrastructure \
  --startup-project src/HuniBackend.API
```

### Bước 5 — Kiểm Tra Trong pgAdmin 4

```
Sau khi migration thành công, mở pgAdmin 4:
  Servers → Supabase Connection → Databases → postgres
  → Schemas → public → Tables

Sẽ thấy các bảng do C# tạo:
  ✅ customers
  ✅ orders
  ✅ order_items
  ✅ quotes
  ✅ products
  ✅ users
  ✅ reviews
  ✅ vouchers
  ✅ __ef_migrations_history   ← EF Core tự tạo để track versions
```

### Bước 6 — Chạy & Kiểm Tra Backend

```bash
cd src/HuniBackend.API
dotnet run

# Swagger UI
http://localhost:5000/swagger

# Health check
GET http://localhost:5000/health
# → { "status": "healthy", "timestamp": "2026-10-01T..." }
```

---

## ⚠️ Quy Tắc Bảo Mật Credentials

| ✅ NÊN | ❌ KHÔNG |
|--------|---------|
| Lưu trong `appsettings.Development.json` local | Gửi password vào chat / email |
| Thêm file đó vào `.gitignore` | Commit credentials lên GitHub |
| Dùng biến môi trường khi deploy | Hardcode password trong source code |
| Đổi Supabase DB password định kỳ | Dùng password yếu ngắn |

---

## Thay Đổi So Với Prompt Cũ

| | Prompt Cũ (Hybrid) | **Prompt Mới (Tách Biệt)** |
|--|--|--|
| DB | Dùng chung Prisma + EF Core | **Chỉ C# EF Core** |
| Next.js API Routes | Giữ hoặc Proxy | **Xóa toàn bộ** |
| Prisma | Vẫn còn | **Xóa khỏi FE** |
| Auth | NextAuth giữ | **C# JWT hoàn toàn** |
| Env DATABASE_URL | Frontend có | **Chỉ Backend có** |

---

# 🚀 BACKEND C# .NET 9 — PROMPT XÂY DỰNG ĐẦY ĐỦ
## (Kiến trúc tách biệt — BE quản lý toàn bộ CSDL)

> **Đọc trước:** `API_CONTRACT.md` v3.0 — Hợp đồng API đầy đủ
> **Database:** PostgreSQL (Supabase) — **C# Backend là chủ sở hữu duy nhất**
> **Frontend:** Chỉ gọi API qua HTTP, không có quyền kết nối DB

---

## Prompt 0 — Solution, Cấu Trúc & Khởi Tạo

```
Bạn là senior .NET architect. Hãy khởi tạo solution backend C# .NET 9 cho HUNI.

## THÔNG TIN
- Solution name: HuniBackend
- .NET version: 9.0
- Database: PostgreSQL trên Supabase
- Pattern: Clean Architecture (4 lớp)
- Frontend sẽ kết nối qua HTTP REST — KHÔNG có quyền truy cập DB trực tiếp

## CẤU TRÚC SOLUTION

HuniBackend/
├── HuniBackend.sln
└── src/
    ├── HuniBackend.API/                 ← Web API (Presentation)
    │   ├── Controllers/
    │   │   ├── AuthController.cs
    │   │   ├── OrdersController.cs
    │   │   ├── QuotesController.cs
    │   │   ├── TrackingController.cs
    │   │   ├── ChatController.cs
    │   │   ├── ProductsController.cs
    │   │   ├── ReviewsController.cs
    │   │   └── Admin/
    │   │       ├── AdminDashboardController.cs
    │   │       ├── AdminOrdersController.cs
    │   │       ├── AdminQuotesController.cs
    │   │       ├── AdminCustomersController.cs
    │   │       ├── AdminVouchersController.cs
    │   │       ├── AdminReviewsController.cs
    │   │       └── AdminReturnsController.cs
    │   ├── Middleware/
    │   │   ├── GlobalExceptionMiddleware.cs
    │   │   └── OrderRateLimitMiddleware.cs
    │   ├── Extensions/
    │   │   ├── ServiceCollectionExtensions.cs
    │   │   └── ApiResponseExtensions.cs
    │   ├── Program.cs
    │   ├── appsettings.json
    │   └── appsettings.Development.json
    │
    ├── HuniBackend.Application/         ← Business Logic
    │   ├── DTOs/
    │   │   ├── Auth/
    │   │   ├── Orders/
    │   │   ├── Quotes/
    │   │   ├── Products/
    │   │   ├── Reviews/
    │   │   └── Admin/
    │   ├── Interfaces/
    │   │   ├── IOrderService.cs
    │   │   ├── IProductService.cs
    │   │   ├── IMailService.cs
    │   │   ├── IChatService.cs
    │   │   └── IVoucherService.cs
    │   ├── Services/
    │   │   ├── OrderService.cs
    │   │   ├── ProductService.cs
    │   │   ├── VoucherService.cs
    │   │   ├── PricingService.cs
    │   │   └── AuthService.cs
    │   └── Validators/                  ← FluentValidation
    │       ├── RegisterValidator.cs
    │       ├── CreateOrderValidator.cs
    │       ├── CreateQuoteValidator.cs
    │       ├── ProductCreateValidator.cs
    │       └── VoucherCreateValidator.cs
    │
    ├── HuniBackend.Domain/              ← Entities & Enums
    │   ├── Entities/
    │   │   ├── Customer.cs
    │   │   ├── Order.cs
    │   │   ├── OrderItem.cs
    │   │   ├── Quote.cs
    │   │   ├── Product.cs
    │   │   ├── User.cs
    │   │   ├── Review.cs
    │   │   └── Voucher.cs
    │   └── Enums/
    │       ├── OrderStatus.cs
    │       ├── QuoteStatus.cs
    │       └── UserRole.cs
    │
    └── HuniBackend.Infrastructure/      ← Data Access
        ├── Data/
        │   ├── AppDbContext.cs
        │   ├── Configurations/
        │   │   ├── CustomerConfiguration.cs
        │   │   ├── OrderConfiguration.cs
        │   │   ├── ProductConfiguration.cs
        │   │   └── ...
        │   ├── Migrations/              ← EF Core Migrations (Backend tự quản lý)
        │   └── Seeds/
        │       └── ProductSeeder.cs    ← Seed sản phẩm từ JSON
        ├── Repositories/
        └── Services/
            ├── MailService.cs          ← MailKit SMTP
            └── GeminiChatService.cs   ← Google Gemini API

## NUGET PACKAGES

### HuniBackend.API:
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.*
dotnet add package Swashbuckle.AspNetCore
dotnet add package Serilog.AspNetCore

### HuniBackend.Infrastructure:
dotnet add package Microsoft.EntityFrameworkCore --version 9.*
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 9.*
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.*
dotnet add package BCrypt.Net-Next
dotnet add package MailKit

### HuniBackend.Application:
dotnet add package FluentValidation.AspNetCore
dotnet add package AutoMapper

## appsettings.json

{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.xxxx.supabase.co;Port=5432;Database=postgres;Username=postgres.xxxx;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "SecretKey": "huni-backend-super-secret-key-256bit-minimum-here!",
    "Issuer": "HuniBackend",
    "Audience": "HuniClient",
    "ExpiresInDays": 30
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://hunistore.com"
    ]
  },
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY",
    "ModelId": "gemini-2.5-flash",
    "FallbackModels": ["gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"]
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "FromEmail": "noreply@hunistore.com",
    "Password": "YOUR_APP_PASSWORD",
    "AdminEmail": "admin@hunistore.com"
  },
  "RateLimit": {
    "OrdersPerHour": 5
  },
  "Logging": {
    "LogLevel": { "Default": "Information", "Microsoft.EntityFrameworkCore": "Warning" }
  }
}

## Program.cs ĐẦY ĐỦ

var builder = WebApplication.CreateBuilder(args);

// ─── Services ───────────────────────────────────────────────────
// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS — cho phép Next.js frontend gọi
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;
builder.Services.AddCors(opt =>
    opt.AddPolicy("NextJsPolicy", p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials()));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        var jwt = builder.Configuration.GetSection("Jwt");
        opt.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["SecretKey"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new() { Title = "HUNI API", Version = "v1" });
    // Thêm JWT auth vào Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Name = "Authorization", Type = SecuritySchemeType.Http,
        Scheme = "Bearer", BearerFormat = "JWT"
    });
});

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddSingleton<IChatService, GeminiChatService>();

// Lowercase routes
builder.Services.AddRouting(opt => { opt.LowercaseUrls = true; });

// ─── Pipeline ───────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors("NextJsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check
app.MapGet("/health", () => Results.Ok(new {
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "HuniBackend"
}));

// Auto migrate khi startup (development)
if (app.Environment.IsDevelopment()) {
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Áp dụng migrations
}

app.Run();

## API RESPONSE FORMAT (bắt buộc theo API_CONTRACT.md)

// ApiResponse.cs — dùng cho tất cả response
public record ApiResponse<T>(
    bool Success,
    string? Message = null,
    T? Data = null,
    string? Error = null,
    List<ValidationError>? Details = null
) where T : class;

public record ValidationError(string Field, string Message);

// Static helpers trong controller
protected IActionResult ApiOk<T>(T data, string? message = null)
    => Ok(new ApiResponse<T>(true, message, data));

protected IActionResult ApiCreated<T>(T data, string message)
    => StatusCode(201, new ApiResponse<T>(true, message, data));

protected IActionResult ApiBadRequest(string error, List<ValidationError>? details = null)
    => BadRequest(new ApiResponse<object>(false, Error: error, Details: details));

protected IActionResult ApiUnauthorized(string error = "Vui lòng đăng nhập để truy cập tài nguyên này.")
    => Unauthorized(new ApiResponse<object>(false, Error: error));

protected IActionResult ApiForbidden(string error = "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền.")
    => StatusCode(403, new ApiResponse<object>(false, Error: error));

protected IActionResult ApiNotFound(string error)
    => NotFound(new ApiResponse<object>(false, Error: error));

protected IActionResult ApiConflict(string error)
    => Conflict(new ApiResponse<object>(false, Error: error));
```

---

## Prompt 1 — Database: EF Core + Migrations

```
Bạn là senior .NET developer. Hãy thiết lập EF Core 9 với PostgreSQL.
Backend C# là CHỦ SỞ HỮU DUY NHẤT của database — dùng EF Core Migrations
để tạo và quản lý schema. KHÔNG dùng Prisma.

## ENTITIES

### Customer.cs
public class Customer
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;       // unique
    public string? Email { get; set; }
    public string? Company { get; set; }
    public string? Address { get; set; }
    public string? TaxCode { get; set; }
    public string? Notes { get; set; }
    public List<Order> Orders { get; set; } = [];
    public List<Quote> Quotes { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

### Order.cs
public class Order
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string OrderNumber { get; set; } = string.Empty;  // HN-YYMMDD-XXXX, unique
    public string CustomerId { get; set; } = string.Empty;
    public Customer Customer { get; set; } = null!;
    public OrderStatus Status { get; set; } = OrderStatus.PENDING;
    public string PaymentMethod { get; set; } = string.Empty; // vietqr|deposit30|freesample
    public int Subtotal { get; set; }
    public int Discount { get; set; }
    public int Total { get; set; }
    public string? Notes { get; set; }
    public string? VatInfo { get; set; }   // JSON string {taxCode, companyName, companyAddress, email}
    public List<OrderItem> Items { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

### OrderItem.cs
public class OrderItem
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; } = null!;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int UnitPrice { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? CustomLogo { get; set; }  // JSON string
    public int Subtotal { get; set; }
}

### Quote.cs
public class Quote
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Company { get; set; }
    public string Category { get; set; } = string.Empty;   // polo|shirt|suit|golf|school|accessories
    public int Quantity { get; set; }
    public int? EstimatedPrice { get; set; }
    public string? Notes { get; set; }
    public QuoteStatus Status { get; set; } = QuoteStatus.NEW;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

### Product.cs
public class Product
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Slug { get; set; } = string.Empty;       // unique
    public string Sku { get; set; } = string.Empty;        // unique
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Material { get; set; }
    public int Price { get; set; }
    public int? OriginalPrice { get; set; }
    public string[] Images { get; set; } = [];
    public string[] Features { get; set; } = [];
    public string? Colors { get; set; }           // JSON: [{name, code}]
    public string[] Sizes { get; set; } = [];
    public string? WholesaleTiers { get; set; }   // JSON: [{min, max, price, label}]
    public bool Published { get; set; } = true;
    public bool Featured { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

### User.cs
public class User
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Email { get; set; } = string.Empty;       // unique
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public UserRole Role { get; set; } = UserRole.CUSTOMER;
    public DateTime? LastLoginAt { get; set; }
    public List<Review> Reviews { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

### Review.cs
public class Review
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string ProductId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public short Rating { get; set; }   // 1-5
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

### Voucher.cs
public class Voucher
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Code { get; set; } = string.Empty;       // unique, uppercase
    public int Discount { get; set; }
    public string Type { get; set; } = string.Empty;       // percentage | fixed
    public int MinOrder { get; set; } = 0;
    public int? MaxDiscount { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; } = 0;
    public bool Active { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

## ENUMS
public enum OrderStatus { PENDING, QUOTED, CONFIRMED, PRODUCING, SHIPPED, COMPLETED, CANCELLED }
public enum QuoteStatus { NEW, CONTACTED, QUOTED, CONVERTED, CLOSED }
public enum UserRole { CUSTOMER, ADMIN }

## AppDbContext.cs

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Voucher> Vouchers => Set<Voucher>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Tự động lowercase tên bảng và cột (snake_case)
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(ToSnakeCase(entity.GetTableName()!));
            foreach (var prop in entity.GetProperties())
                prop.SetColumnName(ToSnakeCase(prop.GetColumnName()));
        }

        // OrderItem → cascade delete khi Order bị xóa
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Review → unique(productId, userId)
        modelBuilder.Entity<Review>()
            .HasIndex(r => new { r.ProductId, r.UserId }).IsUnique();

        // Customer.Phone unique
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Phone).IsUnique();

        // Product Slug + Sku unique
        modelBuilder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.Sku).IsUnique();

        // User.Email unique
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // Voucher.Code unique
        modelBuilder.Entity<Voucher>().HasIndex(v => v.Code).IsUnique();

        // PostgreSQL array columns
        modelBuilder.Entity<Product>()
            .Property(p => p.Images).HasColumnType("text[]");
        modelBuilder.Entity<Product>()
            .Property(p => p.Features).HasColumnType("text[]");
        modelBuilder.Entity<Product>()
            .Property(p => p.Sizes).HasColumnType("text[]");

        // OrderStatus / QuoteStatus / UserRole → store as string
        modelBuilder.Entity<Order>()
            .Property(o => o.Status).HasConversion<string>();
        modelBuilder.Entity<Quote>()
            .Property(q => q.Status).HasConversion<string>();
        modelBuilder.Entity<User>()
            .Property(u => u.Role).HasConversion<string>();

        // Review.Rating → smallint
        modelBuilder.Entity<Review>()
            .Property(r => r.Rating).HasColumnType("smallint");

        // Quote.CustomerId optional FK
        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Customer)
            .WithMany(c => c.Quotes)
            .HasForeignKey(q => q.CustomerId)
            .IsRequired(false);
    }

    // Helper snake_case
    private static string ToSnakeCase(string name) =>
        Regex.Replace(name, "([a-z0-9])([A-Z])", "$1_$2").ToLower();
}

## CUID GENERATOR

public static class CuidGenerator
{
    private static readonly Random _random = new();

    public static string NewCuid()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = _random.NextInt64(0, 0xFFFFFFF).ToString("x7");
        return $"c{timestamp:x}{random}";
    }
}

## ORDER NUMBER GENERATOR

public static async Task<string> GenerateOrderNumberAsync(AppDbContext db)
{
    var dateStr = DateTime.Now.ToString("yyMMdd");
    var today = DateTime.UtcNow.Date;
    var count = await db.Orders.CountAsync(o => o.CreatedAt >= today) + 1;
    return $"HN-{dateStr}-{count:D4}";
}

## EF CORE MIGRATIONS

# Lệnh tạo migration đầu tiên (chạy trong terminal):
cd src/HuniBackend.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../HuniBackend.API
dotnet ef database update --startup-project ../HuniBackend.API

## SEED DỮ LIỆU BAN ĐẦU (tùy chọn)

// Infrastructure/Data/Seeds/ProductSeeder.cs
// Export products.js từ Next.js → products-seed.json
// Đọc file và insert vào DB khi migration
public static class ProductSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Products.AnyAsync()) return;  // Đã có → bỏ qua

        var json = await File.ReadAllTextAsync("Data/Seeds/products-seed.json");
        var products = JsonSerializer.Deserialize<List<Product>>(json)!;
        await db.Products.AddRangeAsync(products);
        await db.SaveChangesAsync();
    }
}
```

---

## Prompt 2 — Auth & JWT (C# tự quản lý, không dùng NextAuth)

```
Bạn là senior .NET security developer. Hãy xây dựng Auth hoàn chỉnh bằng C#.
Frontend Next.js sẽ gọi API login của C# và lưu JWT token để gọi các API khác.
KHÔNG dùng NextAuth — C# Backend quản lý toàn bộ xác thực.

## POST /api/auth/register *(public)*

Request: { fullName, email, phone, password }
Logic:
  1. FluentValidation: fullName min 2 · email valid · phone 10-11 số · password min 6
  2. NormalizePhone()
  3. Check email unique → 409 "Email này đã được đăng ký"
  4. BCrypt.HashPassword(password, workFactor: 10)
  5. db.Users.Add(new User { Role = CUSTOMER })
  6. Return 201 { success: true, message: "Đăng ký thành công", user: { id, email, fullName } }

## POST /api/auth/login *(public)*

Request: { email, password }
Logic:
  1. Validate
  2. Tìm user theo email
  3. BCrypt.Verify → 401 "Email hoặc mật khẩu không đúng" nếu sai
  4. Cập nhật user.LastLoginAt = DateTime.UtcNow
  5. GenerateJwtToken(user) → JWT có claims: id, email, name, role, avatar
  6. Return 200 { success: true, token, expiresAt, user: { id, email, name, role, avatar } }

## POST /api/auth/me 🔒 (Lấy thông tin user hiện tại)

Logic: Đọc userId từ JWT claims → query DB → return user info (không có passwordHash)

## JWT Token Structure (Claims):
{
  "id": "cma...",
  "email": "user@example.com",
  "name": "Nguyễn Văn A",
  "role": "CUSTOMER",       // hoặc "ADMIN"
  "avatar": null,
  "iat": ...,
  "exp": ...
}

## JwtService.cs:
public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim("id", user.Id),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim("role", user.Role.ToString()),
        new Claim("avatar", user.Avatar ?? ""),
    };
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]!));
    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:ExpiresInDays"]!)),
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
}

## ClaimsPrincipalExtensions.cs:
public static string GetUserId(this ClaimsPrincipal user)
    => user.FindFirst("id")?.Value ?? "";
public static string GetRole(this ClaimsPrincipal user)
    => user.FindFirst("role")?.Value ?? "CUSTOMER";
public static bool IsAdmin(this ClaimsPrincipal user)
    => user.GetRole() == "ADMIN";

## Cách dùng trong Controller:
[Authorize]                       // 🔒 Đăng nhập
[Authorize(Roles = "ADMIN")]      // 🔒 Chỉ ADMIN

## Phone Normalization (dùng khắp nơi):
public static string NormalizePhone(string phone)
    => Regex.Replace(phone ?? "", @"[\s.\-\(\)+]", "");
// Validate: Regex.IsMatch(normalized, @"^[0-9]{10,11}$")
```

---

## Prompt 3 — Orders API (nghiệp vụ chính)

```
[Giữ nguyên logic từ file BACKEND_CSHARP_PROMPT.md cũ — Prompt 3]
Tất cả giống nhau, chỉ thay:
- Không import static Products từ file JS nữa
- Tìm sản phẩm từ DB: db.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId || p.Slug == item.ProductId)
- Fallback: nếu DB chưa có product → load từ Infrastructure/Data/Seeds/products-seed.json (static file C#)
```

---

## Prompt 4 — Quotes, Tracking, Chat

```
[Giống Prompt 4 trong file cũ — không thay đổi]
```

---

## Prompt 5 → 7 — Products, Reviews, Admin APIs

```
[Giống Prompts 5, 6, 7 trong file cũ]
Chỉ thay đổi: Products đọc từ DB, không cần static fallback từ JS file
```

---

## Prompt 8 — Frontend Next.js: Xóa API Routes, Chỉ Dùng UI

```
Bạn là senior Next.js developer. Hãy refactor frontend HUNI để trở thành
PURE UI LAYER — xóa toàn bộ API routes và DB access, chỉ gọi C# backend.

## NHỮNG GÌ CẦN XÓA KHỎI FRONTEND

### XÓA HOÀN TOÀN (không cần nữa):
  src/app/api/             ← TOÀN BỘ folder (18 route files)
  src/server/              ← db.js, validators.js, vouchers.js, mailer.js, auth/
  prisma/                  ← schema.prisma, migrations/
  .env → DATABASE_URL      ← Xóa biến này
  .env → DIRECT_URL        ← Xóa biến này

### GIỮ LẠI:
  src/app/               ← Pages (layout, page.jsx...)
  src/features/          ← UI Components
  src/shared/            ← Hooks, providers, data tĩnh UI
  next.config.js, tailwind.config.js, v.v.

## .env.local MỚI (frontend chỉ cần):
  NEXT_PUBLIC_API_URL=http://localhost:5000
  NEXTAUTH_SECRET=...  # Nếu còn dùng NextAuth session (tùy chọn)

## API CLIENT (src/shared/lib/apiClient.js)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('huni_token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  });

  return res.json();
}

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path, body) => request('DELETE', path, body),
};

## AUTH FLOW MỚI (không dùng NextAuth)

// src/shared/providers/AuthProvider.jsx
// State: { user, token, loading }
// login(email, password) → POST /api/auth/login → lưu token vào localStorage
// logout() → xóa token khỏi localStorage
// register(data) → POST /api/auth/register

const login = async (email, password) => {
  const res = await apiClient.post('/api/auth/login', { email, password });
  if (res.success) {
    localStorage.setItem('huni_token', res.token);
    setUser(res.user);
    setToken(res.token);
  }
  return res;
};

## THAY THẾ CÁC FETCH CALLS

TRƯỚC (gọi Next.js route):
  await fetch('/api/orders', { method: 'POST', body: JSON.stringify(data) })

SAU (gọi C# backend):
  await apiClient.post('/api/orders', data)

---

Các file cần update:
  src/features/checkout/components/CheckoutModal.jsx
    → POST /api/orders → apiClient.post('/api/orders', data)

  src/features/quote/components/QuickQuoteSection.jsx
    → POST /api/quotes → apiClient.post('/api/quotes', data)

  src/features/tracking/components/OrderTrackingModal.jsx
    → GET /api/tracking → apiClient.get(`/api/tracking?code=${code}`)

  src/features/catalog/components/ProductCatalog.jsx
    → GET /api/products → apiClient.get('/api/products?...')

  src/features/catalog/components/ReviewSection.jsx
    → GET /api/reviews → apiClient.get(`/api/reviews?productId=${id}`)
    → POST /api/reviews → apiClient.post('/api/reviews', data)

  src/features/chatbot/components/ChatWidget.jsx
    → POST /api/chat → apiClient.post('/api/chat', { messages })

## ADMIN PAGES (src/app/admin/)

Admin pages gọi trực tiếp C# backend với token ADMIN:
  GET /api/admin/dashboard → apiClient.get('/api/admin/dashboard')
  GET /api/admin/orders    → apiClient.get('/api/admin/orders?...')
  PATCH /api/admin/orders/[id] → apiClient.patch('/api/admin/orders/' + id, body)
  ... tất cả admin endpoints
```

---

## Prompt 9 — Docker Compose: Chạy Cả 2 Cùng Nhau

```
Bạn là DevOps engineer. Hãy tạo Docker Compose để chạy Frontend + Backend cùng nhau.

## docker-compose.yml (đặt ở thư mục cha chứa cả 2 project)

version: '3.9'

services:
  # C# .NET 9 Backend
  backend:
    build:
      context: ./HuniBackend
      dockerfile: Dockerfile
    container_name: huni-backend
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=${DATABASE_URL}
      - Jwt__SecretKey=${JWT_SECRET_KEY}
      - Gemini__ApiKey=${GEMINI_API_KEY}
      - Email__Password=${EMAIL_PASSWORD}
      - Cors__AllowedOrigins__0=http://localhost:3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s

  # Next.js Frontend
  frontend:
    build:
      context: ./HUNI
      dockerfile: Dockerfile
    container_name: huni-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped

## Dockerfile cho C# Backend (HuniBackend/Dockerfile):

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
RUN dotnet build "src/HuniBackend.API/HuniBackend.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src/HuniBackend.API/HuniBackend.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HuniBackend.API.dll"]

## .env (đặt cùng thư mục docker-compose.yml):

DATABASE_URL=Host=db.xxx.supabase.co;Port=5432;Database=postgres;...
JWT_SECRET_KEY=huni-super-secret-256bit-key-production!
GEMINI_API_KEY=AIza...
EMAIL_PASSWORD=gmail-app-password
```

---

## Prompt 10 — Bảo Mật Toàn Diện (Security Hardening)

```
Bạn là senior .NET security engineer. Hãy implement toàn bộ các biện pháp bảo mật
cho HuniBackend C# .NET 9. Áp dụng từng mục theo thứ tự ưu tiên dưới đây.

## PHÂN LOẠI & TRẠNG THÁI

┌─────────────────────────────────────────────────────────────────┐
│  ✅ ĐÃ CÓ trong các Prompt trước — CHỈ kiểm tra lại            │
│  🔴 PHẢI LÀM trong Prompt này — Chưa có                         │
│  🟡 FE cần làm — Không phải việc của Backend                    │
└─────────────────────────────────────────────────────────────────┘

| Yêu cầu bảo mật              | Trạng thái | Prompt |
|------------------------------|-----------|--------|
| Ẩn API key                   | 🔴 LÀM    | P10-A  |
| Xóa git secrets              | 🔴 LÀM    | P10-A  |
| Bảo mật database             | 🔴 LÀM    | P10-B  |
| Row-Level Security (RLS)     | 🔴 LÀM    | P10-B  |
| Mã hóa dữ liệu               | 🔴 LÀM    | P10-C  |
| Xác thực server / check input| ✅ Có     | Prompt 2-7 (FluentValidation) |
| Khóa quyền truy cập record   | 🔴 LÀM    | P10-D  |
| Chặn sửa field               | 🔴 LÀM    | P10-D  |
| Bảo mật cookie               | 🔴 LÀM    | P10-E  |
| Băm password                 | ✅ Có     | Prompt 2 (BCrypt rounds=10) |
| Giới hạn đăng nhập           | 🔴 LÀM    | P10-E  |
| Chặn bot                     | 🔴 LÀM    | P10-E  |
| Tham số hóa query            | ✅ Có     | EF Core tự parameterize |
| Escape nội dung              | 🔴 LÀM    | P10-F  |
| Giới hạn file upload         | 🔴 LÀM    | P10-F  |
| Giảm dữ liệu trả về          | 🔴 LÀM    | P10-G  |
| Security headers             | 🔴 LÀM    | P10-H  |
| Bắt buộc HTTPS               | 🔴 LÀM    | P10-H  |
| Quét dependencies            | 🔴 LÀM    | P10-I  |

---

## P10-A — Ẩn API Key & Xóa Git Secrets

### 1. Không bao giờ hardcode credentials trong code

```csharp
// ❌ SAI — TUYỆT ĐỐI KHÔNG LÀM
var apiKey = "AIzaSyABC123...";
var connStr = "Host=db.supabase.co;Password=mypassword";

// ✅ ĐÚNG — Đọc từ environment / appsettings
var apiKey = _configuration["Gemini:ApiKey"];
var connStr = _configuration.GetConnectionString("DefaultConnection");
```

### 2. Cấu hình Secret Manager (.NET)

```bash
# Chạy 1 lần để init secrets local (dev only)
dotnet user-secrets init --project src/HuniBackend.API

# Lưu từng secret
dotnet user-secrets set "Jwt:SecretKey" "your-secret-key" --project src/HuniBackend.API
dotnet user-secrets set "Gemini:ApiKey" "AIza..." --project src/HuniBackend.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=..." --project src/HuniBackend.API

# Secrets được lưu ngoài project folder → không vào git
```

### 3. .gitignore bắt buộc

```gitignore
# HuniBackend/.gitignore
appsettings.Development.json
appsettings.Production.json
appsettings.Staging.json
.env
*.env.*
secrets.json
**/*.pfx
**/*.p12
.user-secrets/

# IDE
.vs/
.vscode/settings.json
*.user
*.suo

# Build
bin/
obj/
publish/
```

### 4. Quét secrets đã lỡ commit (git-secrets check)

```bash
# Kiểm tra lịch sử git có lộ secret không
git log --all --full-history -- "*.json" | grep -i "password\|secret\|apikey"

# Nếu phát hiện → dùng BFG Repo Cleaner để xóa khỏi history
# Sau đó bắt buộc đổi tất cả credentials đã lộ
```

---

## P10-B — Bảo Mật Database & Row-Level Security

### 1. Connection Pool giới hạn

```csharp
// Program.cs — Giới hạn connection pool để tránh DB exhaustion
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOpt => {
            npgsqlOpt.CommandTimeout(30);           // Timeout 30s
        }
    )
    .EnableSensitiveDataLogging(false)              // KHÔNG log SQL params
    .EnableDetailedErrors(builder.Environment.IsDevelopment())
);
```

### 2. Tạo DB User riêng cho backend (ít quyền nhất)

```sql
-- Chạy trong pgAdmin 4 / Supabase SQL Editor
-- Tạo user riêng cho backend, chỉ có quyền cần thiết

CREATE USER huni_app WITH PASSWORD 'strong-random-password-here';

-- Chỉ cấp quyền SELECT, INSERT, UPDATE, DELETE — KHÔNG cấp DROP, CREATE
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO huni_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO huni_app;

-- Không cấp quyền xóa bảng
REVOKE DROP ON ALL TABLES IN SCHEMA public FROM huni_app;
```

### 3. Row-Level Security (RLS) trên Supabase

```sql
-- Bật RLS cho bảng users (chỉ ADMIN mới thấy tất cả user)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ thấy record của chính mình
CREATE POLICY "users_self_only"
  ON users FOR SELECT
  USING (id = current_setting('app.user_id', true));

-- Policy: ADMIN thấy tất cả
CREATE POLICY "users_admin_all"
  ON users FOR ALL
  USING (current_setting('app.user_role', true) = 'ADMIN');

-- Bật RLS cho orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Set session variable khi C# backend kết nối
-- Thêm vào AppDbContext.SaveChangesAsync() hoặc interceptor:
await db.Database.ExecuteSqlRawAsync(
    "SET app.user_id = {0}; SET app.user_role = {1};",
    userId, userRole
);
```

### 4. Chống SQL Injection bổ sung (dù EF Core đã safe)

```csharp
// EF Core tự parameterize — NHƯNG nếu có raw SQL thì phải dùng FormattableString
// ❌ SAI
var sql = $"SELECT * FROM users WHERE email = '{email}'";
await db.Database.ExecuteSqlRawAsync(sql);

// ✅ ĐÚNG — FormattableString tự escape
await db.Database.ExecuteSqlInterpolatedAsync(
    $"SELECT * FROM users WHERE email = {email}"
);

// Hoặc dùng parameterized:
await db.Database.ExecuteSqlRawAsync(
    "SELECT * FROM users WHERE email = @email",
    new NpgsqlParameter("email", email)
);
```

---

## P10-C — Mã Hóa Dữ Liệu

### 1. Mã hóa field nhạy cảm trước khi lưu DB

```csharp
// Infrastructure/Services/EncryptionService.cs
public class EncryptionService
{
    private readonly byte[] _key;  // 32 bytes (256-bit) từ config

    public EncryptionService(IConfiguration config)
    {
        _key = Encoding.UTF8.GetBytes(config["Encryption:Key"]!.PadRight(32)[..32]);
    }

    // AES-256-GCM encryption
    public string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor();
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        // Format: IV(16 bytes) + CipherText
        var result = new byte[aes.IV.Length + cipherBytes.Length];
        aes.IV.CopyTo(result, 0);
        cipherBytes.CopyTo(result, aes.IV.Length);

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string cipherText)
    {
        var fullCipher = Convert.FromBase64String(cipherText);
        var iv = fullCipher[..16];
        var cipher = fullCipher[16..];

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();
        var plainBytes = decryptor.TransformFinalBlock(cipher, 0, cipher.Length);
        return Encoding.UTF8.GetString(plainBytes);
    }
}
```

Áp dụng cho các field nhạy cảm:
- `Customer.TaxCode` — mã số thuế
- `Order.VatInfo` — thông tin hóa đơn
- `Voucher` bankInfo nếu có

### 2. HTTPS bắt buộc — TLS cho mọi kết nối

```csharp
// Program.cs
app.UseHsts();               // Strict-Transport-Security header
app.UseHttpsRedirection();   // HTTP → tự redirect HTTPS

// appsettings.Production.json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://0.0.0.0:443",
        "Certificate": {
          "Path": "/certs/huni.pfx",
          "Password": "cert-password"
        }
      }
    }
  }
}
```

---

## P10-D — Khóa Quyền Truy Cập Record & Chặn Sửa Field

### 1. Resource-based Authorization (chỉ chủ record mới được sửa)

```csharp
// Ví dụ: User chỉ được xem đơn hàng của chính mình
[Authorize]
[HttpGet("{id}")]
public async Task<IResult> GetOrder(string id)
{
    var order = await db.Orders
        .Include(o => o.Customer)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null) return ApiNotFound("Không tìm thấy đơn hàng");

    // 🔐 Chỉ ADMIN hoặc chủ đơn hàng mới được xem
    var userId = User.GetUserId();
    var userRole = User.GetRole();
    var user = await db.Users.FindAsync(userId);

    bool isOwner = order.Customer.Email == user?.Email ||
                   order.Customer.Phone == user?.Phone;

    if (userRole != "ADMIN" && !isOwner)
        return ApiForbidden("Bạn không có quyền xem đơn hàng này");

    return ApiOk(order);
}
```

### 2. Chặn sửa field read-only từ client

```csharp
// ❌ KHÔNG BAO GIỜ bind thẳng từ client vào entity:
// var order = JsonSerializer.Deserialize<Order>(body);  // NGUY HIỂM

// ✅ Dùng DTO riêng — chỉ nhận field được phép thay đổi
public record UpdateOrderRequest(
    // Client CHỈ được gửi những field này:
    string? Notes
    // ❌ KHÔNG có: Status, Total, Discount, CustomerId
    // Status chỉ ADMIN mới sửa qua /api/admin/orders/{id}
);

// ✅ Chặn client tự sửa giá — server tính lại
// Đã implement trong Prompt 3 (Price Guard)
// Server KHÔNG tin bất kỳ giá trị tiền tệ nào từ client
```

### 3. Khóa field sau khi đã xử lý

```csharp
// Đơn hàng COMPLETED hoặc CANCELLED → không cho sửa nữa
if (order.Status is OrderStatus.COMPLETED or OrderStatus.CANCELLED)
    return ApiBadRequest("Đơn hàng đã hoàn thành/huỷ, không thể chỉnh sửa");

// Review đã gửi → không cho sửa (chỉ ADMIN mới được)
// Voucher đã hết hạn → không cho activate lại từ client
```

---

## P10-E — Bảo Mật Cookie, Giới Hạn Đăng Nhập & Chặn Bot

### 1. Cookie bảo mật (nếu dùng cookie thay localStorage)

```csharp
// Program.cs — Nếu trả JWT về qua cookie
builder.Services.ConfigureApplicationCookie(options => {
    options.Cookie.HttpOnly = true;          // JS không đọc được
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;  // Chỉ HTTPS
    options.Cookie.SameSite = SameSiteMode.Strict;  // Chặn CSRF
    options.Cookie.Name = "__Secure-HuniAuth";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
});

// Hoặc trả JWT trong cookie thay vì body:
[HttpPost("login")]
public IActionResult Login(LoginRequest request)
{
    var token = GenerateJwtToken(user);
    Response.Cookies.Append("huni_token", token, new CookieOptions {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(30)
    });
    return ApiOk(new { user });  // Không trả token trong body
}
```

### 2. Giới hạn đăng nhập — Chặn brute force

```csharp
// Infrastructure/Services/LoginAttemptTracker.cs
// In-memory tracker (production: dùng Redis)
public class LoginAttemptTracker
{
    // Key: email, Value: (attempts, lockUntil)
    private static readonly ConcurrentDictionary<string, (int Attempts, DateTime? LockUntil)>
        _attempts = new();

    private const int MAX_ATTEMPTS = 5;
    private const int LOCK_MINUTES = 15;

    public bool IsLockedOut(string email)
    {
        if (_attempts.TryGetValue(email.ToLower(), out var entry))
        {
            if (entry.LockUntil.HasValue && entry.LockUntil > DateTime.UtcNow)
                return true;
        }
        return false;
    }

    public void RecordFailedAttempt(string email)
    {
        var key = email.ToLower();
        _attempts.AddOrUpdate(key,
            (1, null),
            (_, old) => {
                var attempts = old.Attempts + 1;
                DateTime? lockUntil = attempts >= MAX_ATTEMPTS
                    ? DateTime.UtcNow.AddMinutes(LOCK_MINUTES)
                    : null;
                return (attempts, lockUntil);
            });
    }

    public void RecordSuccess(string email)
    {
        _attempts.TryRemove(email.ToLower(), out _);
    }

    public (int Remaining, DateTime? LockUntil) GetStatus(string email)
    {
        if (_attempts.TryGetValue(email.ToLower(), out var entry))
            return (Math.Max(0, MAX_ATTEMPTS - entry.Attempts), entry.LockUntil);
        return (MAX_ATTEMPTS, null);
    }
}

// Trong AuthController.Login():
if (_loginTracker.IsLockedOut(request.Email))
    return StatusCode(429, new { success = false,
        error = "Tài khoản bị khóa tạm thời do đăng nhập sai nhiều lần. Thử lại sau 15 phút." });

if (!BCrypt.Verify(request.Password, user.PasswordHash))
{
    _loginTracker.RecordFailedAttempt(request.Email);
    var status = _loginTracker.GetStatus(request.Email);
    return ApiUnauthorized(
        $"Email hoặc mật khẩu không đúng. Còn {status.Remaining} lần thử.");
}

_loginTracker.RecordSuccess(request.Email);
```

### 3. Chặn Bot — Rate Limit toàn cục

```csharp
// NuGet: AspNetCoreRateLimit
// Program.cs
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(opt => {
    opt.EnableEndpointRateLimiting = true;
    opt.StackBlockedRequests = false;
    opt.GeneralRules = [
        // Toàn bộ API: 200 request/phút/IP
        new RateLimitRule { Endpoint = "*", Limit = 200, Period = "1m" },
        // Auth endpoints: nghiêm ngặt hơn
        new RateLimitRule { Endpoint = "post:/api/auth/*", Limit = 10, Period = "5m" },
        // Register: 3 lần/giờ/IP
        new RateLimitRule { Endpoint = "post:/api/auth/register", Limit = 3, Period = "1h" },
        // Orders: 5 lần/giờ/IP (đã có middleware riêng)
        new RateLimitRule { Endpoint = "post:/api/orders", Limit = 5, Period = "1h" },
    ];
});
builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddInMemoryRateLimiting();

// Pipeline (trước UseAuthentication)
app.UseIpRateLimiting();
```

---

## P10-F — Escape Nội Dung & Giới Hạn File Upload

### 1. Sanitize/Escape input text trước khi lưu DB

```csharp
// NuGet: HtmlSanitizer
// Áp dụng cho các field free-text: notes, content, description

public static class InputSanitizer
{
    private static readonly HtmlSanitizer _sanitizer = new();

    static InputSanitizer()
    {
        // Chỉ cho phép text thuần — xóa tất cả HTML tags
        _sanitizer.AllowedTags.Clear();
        _sanitizer.AllowedAttributes.Clear();
    }

    /// Strip tất cả HTML, giữ lại text thuần
    public static string StripHtml(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        return _sanitizer.Sanitize(input).Trim();
    }

    /// Kiểm tra không có script injection
    public static bool ContainsMaliciousContent(string? input)
    {
        if (string.IsNullOrEmpty(input)) return false;
        return input.Contains("<script", StringComparison.OrdinalIgnoreCase) ||
               input.Contains("javascript:", StringComparison.OrdinalIgnoreCase) ||
               input.Contains("onerror=", StringComparison.OrdinalIgnoreCase) ||
               input.Contains("onload=", StringComparison.OrdinalIgnoreCase);
    }
}

// Áp dụng trong OrderService, QuoteService, ReviewService:
order.Notes = InputSanitizer.StripHtml(request.Notes);
review.Content = InputSanitizer.StripHtml(request.Content);
quote.Notes = InputSanitizer.StripHtml(request.Notes);
```

### 2. Giới hạn file upload (nếu sau này có upload logo/ảnh)

```csharp
// Program.cs — Giới hạn request body size
builder.WebHost.ConfigureKestrel(opt => {
    opt.Limits.MaxRequestBodySize = 5 * 1024 * 1024;  // 5MB max
});

// Controller upload file
[HttpPost("upload")]
[RequestSizeLimit(5_000_000)]   // 5MB
[Authorize]
public async Task<IResult> UploadLogo(IFormFile file)
{
    // 1. Kiểm tra extension
    var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
    var ext = Path.GetExtension(file.FileName).ToLower();
    if (!allowedExts.Contains(ext))
        return ApiBadRequest("Chỉ cho phép file ảnh: JPG, PNG, WebP, SVG");

    // 2. Kiểm tra MIME type thực (không tin extension)
    var allowedMimes = new[] { "image/jpeg", "image/png", "image/webp", "image/svg+xml" };
    if (!allowedMimes.Contains(file.ContentType.ToLower()))
        return ApiBadRequest("File không hợp lệ");

    // 3. Kiểm tra file size
    if (file.Length > 5 * 1024 * 1024)
        return ApiBadRequest("File quá lớn (tối đa 5MB)");

    // 4. Đọc magic bytes để verify thật sự là ảnh
    using var stream = file.OpenReadStream();
    var header = new byte[4];
    await stream.ReadAsync(header.AsMemory(0, 4));

    bool isImage = IsValidImageHeader(header);
    if (!isImage)
        return ApiBadRequest("File không phải định dạng ảnh hợp lệ");

    // 5. Lưu với tên ngẫu nhiên (không dùng tên gốc từ client)
    var safeName = $"{Guid.NewGuid()}{ext}";
    // Upload lên Supabase Storage hoặc CDN...
}

private static bool IsValidImageHeader(byte[] header) =>
    (header[0] == 0xFF && header[1] == 0xD8) ||  // JPEG
    (header[0] == 0x89 && header[1] == 0x50) ||  // PNG
    (header[0] == 0x52 && header[1] == 0x49);    // WebP (RIFF)
```

---

## P10-G — Giảm Dữ Liệu Trả Về Từ API (Data Minimization)

```csharp
// ❌ KHÔNG trả về toàn bộ entity (lộ passwordHash, v.v.)
return Ok(user);   // Lộ passwordHash!

// ✅ Dùng DTO select đúng field cần thiết
public record UserDto(string Id, string Email, string FullName, string? Avatar, string Role);

// Trong query — select trực tiếp tại DB (không load thừa)
var user = await db.Users
    .Where(u => u.Id == userId)
    .Select(u => new UserDto(u.Id, u.Email, u.FullName, u.Avatar, u.Role.ToString()))
    .FirstOrDefaultAsync();

// DTO cho Order list (không trả toàn bộ items nếu chỉ cần summary)
public record OrderSummaryDto(
    string Id, string OrderNumber, OrderStatus Status,
    int Total, DateTime CreatedAt,
    string CustomerName, string CustomerPhone
);

// Không bao giờ trả về:
// - PasswordHash
// - Internal IDs khi không cần
// - Toàn bộ relations khi chỉ cần 1-2 field
// - Timestamps nội bộ (UpdatedAt) nếu client không dùng

// Pagination bắt buộc — không trả về tất cả records
// Tối đa: limit = min(requestedLimit, 100)
var limit = Math.Min(Math.Max(1, request.Limit), 100);
```

---

## P10-H — Security Headers & Bắt Buộc HTTPS

### 1. Security Headers Middleware

```csharp
// API/Middleware/SecurityHeadersMiddleware.cs
public class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Chặn MIME type sniffing
        headers["X-Content-Type-Options"] = "nosniff";

        // Chặn iframe embedding (clickjacking)
        headers["X-Frame-Options"] = "DENY";

        // XSS protection (cũ nhưng vẫn hữu ích)
        headers["X-XSS-Protection"] = "1; mode=block";

        // Referrer policy
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Permissions policy — tắt các feature không dùng
        headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";

        // Content Security Policy
        headers["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' https://api.gemini.google.com;";

        // HSTS — bắt buộc HTTPS trong 1 năm
        headers["Strict-Transport-Security"] =
            "max-age=31536000; includeSubDomains; preload";

        // Ẩn thông tin server
        headers.Remove("Server");
        headers.Remove("X-Powered-By");

        await next(context);
    }
}

// Program.cs — Thêm trước app.MapControllers()
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseHsts();
app.UseHttpsRedirection();
```

### 2. Tắt thông tin nhạy cảm trong response

```csharp
// Program.cs — Ẩn thông tin version .NET
builder.WebHost.ConfigureKestrel(opt => {
    opt.AddServerHeader = false;  // Không gửi header "Server: Kestrel"
});

// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      // Không log SQL queries trong production (có thể chứa data nhạy cảm)
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  }
}
```

---

## P10-I — Quét Dependencies & Audit

### 1. Quét lỗ hổng bảo mật trong NuGet packages

```bash
# Chạy định kỳ (hoặc trong CI/CD pipeline)
dotnet list package --vulnerable --include-transitive

# Audit toàn bộ solution
dotnet audit

# Nếu phát hiện lỗ hổng → cập nhật package:
dotnet add package [PackageName] --version [SafeVersion]
```

### 2. Thêm vào CI/CD (GitHub Actions)

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET 9
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Restore packages
        run: dotnet restore HuniBackend/HuniBackend.sln

      - name: Check for vulnerable packages
        run: dotnet list HuniBackend/HuniBackend.sln package --vulnerable --include-transitive
        # Job sẽ fail nếu có vulnerability critical

      - name: Build check
        run: dotnet build HuniBackend/HuniBackend.sln --no-restore -warnaserror
```

### 3. Cấu hình NuGet để chặn package không an toàn

```xml
<!-- HuniBackend/nuget.config -->
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
  <config>
    <!-- Chỉ cho phép package có chữ ký -->
    <add key="signatureValidationMode" value="require" />
  </config>
</configuration>
```

---

## Checklist Bảo Mật Hoàn Chỉnh

Sau khi implement xong Prompt 10, kiểm tra từng mục:

```
SECRETS & CREDENTIALS:
  ✅ Không có hardcoded credentials trong source code
  ✅ .gitignore đã có appsettings.Development.json và .env
  ✅ .NET User Secrets được dùng cho local dev

DATABASE:
  ✅ DB user riêng với quyền tối thiểu (không có DROP/CREATE)
  ✅ Connection string chỉ trong appsettings / env var
  ✅ EF Core không log SQL params trong production
  ✅ Row-Level Security bật trên Supabase

MÃ HÓA:
  ✅ HTTPS bắt buộc (HSTS enabled)
  ✅ Sensitive fields (taxCode, bankInfo) được encrypt
  ✅ Password hash BCrypt rounds=10

AUTH & PHÂN QUYỀN:
  ✅ JWT token hết hạn 30 ngày
  ✅ JWT secret ≥ 32 ký tự
  ✅ Resource-based auth (chủ record mới được sửa)
  ✅ Field read-only được khóa (status, total, customerId)
  ✅ Brute force: khóa sau 5 lần sai trong 15 phút

RATE LIMITING:
  ✅ Toàn bộ API: 200 req/phút/IP
  ✅ Auth endpoints: 10 req/5 phút/IP
  ✅ Register: 3 lần/giờ/IP
  ✅ Orders: 5 lần/giờ/IP

INPUT VALIDATION:
  ✅ FluentValidation cho tất cả DTO
  ✅ HTML stripped từ free-text fields
  ✅ Script injection detection
  ✅ File upload: kiểm tra ext + MIME + magic bytes + size

OUTPUT:
  ✅ DTO riêng — không trả entity trực tiếp
  ✅ Không trả passwordHash
  ✅ Pagination bắt buộc (max 100)

HEADERS:
  ✅ X-Content-Type-Options: nosniff
  ✅ X-Frame-Options: DENY
  ✅ Strict-Transport-Security (HSTS)
  ✅ Content-Security-Policy
  ✅ Server header bị ẩn

DEPENDENCIES:
  ✅ dotnet list package --vulnerable chạy sạch
  ✅ CI/CD pipeline có security scan
```
```

---

## Thứ Tự Thực Hiện

```
PHASE 1 — Backend Foundation (2-3 ngày)
  → Prompt 0: Solution + Program.cs + Response format
  → Prompt 1: Entities + EF Core + Migration (tạo DB từ đầu)
  → Prompt 2: Auth (Register + Login + JWT)
  ✅ Test: POST /api/auth/register + POST /api/auth/login qua Swagger

PHASE 2 — Core Business APIs (3-4 ngày)
  → Prompt 3: Orders (nghiệp vụ phức tạp nhất)
  → Prompt 4: Quotes + Tracking + Chat
  → Prompt 5: Products (CRUD + seed data)
  ✅ Test: Toàn bộ public endpoints qua Swagger

PHASE 3 — Advanced APIs (2-3 ngày)
  → Prompt 6: Reviews
  → Prompt 7: Tất cả Admin APIs
  ✅ Test: Login ADMIN → gọi admin endpoints với JWT

PHASE 4 — Frontend Migration (2-3 ngày)
  → Prompt 8: Refactor Next.js → xóa API routes, thêm apiClient
  ✅ Test: Frontend gọi C# backend end-to-end

PHASE 5 — Deployment (1-2 ngày)
  → Prompt 9: Docker Compose
  ✅ Test: docker-compose up → cả 2 chạy cùng nhau

PHASE 6 — Security Hardening (1-2 ngày) ← MỚI
  → Prompt 10: Toàn bộ bảo mật
  ✅ Test: Security headers check · Brute force test · Vulnerability scan

TỔNG: 12-17 ngày
```

---

## Checklist Kiến Trúc

```
BACKEND (C# .NET 9):
  ✅ Sở hữu toàn bộ PostgreSQL database
  ✅ EF Core Migrations tạo và quản lý schema
  ✅ JWT Authentication tự cấp
  ✅ Business logic: price guard, voucher, rate limit
  ✅ Email service (MailKit)
  ✅ Gemini AI Chat
  ✅ CORS cho phép Frontend gọi vào
  ✅ Swagger UI tại /swagger
  ✅ Security hardening đầy đủ (Prompt 10)

FRONTEND (Next.js):
  ✅ Chỉ là UI Layer — giao diện + routing
  ✅ Gọi C# backend qua apiClient
  ✅ Lưu JWT token (HttpOnly cookie ưu tiên)
  ✅ KHÔNG có DATABASE_URL
  ✅ KHÔNG có prisma/
  ✅ KHÔNG có src/server/
  ✅ KHÔNG có src/app/api/
```

---

*📄 Backend C# Prompt v3.0 — Kiến Trúc Tách Biệt + Security Hardening*
*Database: C# Backend là chủ sở hữu duy nhất của PostgreSQL*
*Frontend: Pure UI Layer — không kết nối DB trực tiếp*
*Bảo mật: 20 biện pháp · Prompt 10 · Ngày cập nhật: 02/10/2026*
