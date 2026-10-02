# 🧪 HUNI Backend — Phase 7: Kiểm Thử Toàn Diện

> **Điều kiện:** Hoàn thành Prompt 0–10 trước khi thực hiện Phase 7
> **Mục tiêu:** Đảm bảo toàn bộ hệ thống hoạt động đúng trước khi deploy

---

## ✅ PROMPT 7.1 — Cài Đặt & Cấu Hình Test Project

```
Bạn là senior .NET test engineer. Hãy thiết lập project kiểm thử cho HuniBackend.

─── TẠO TEST PROJECTS ───────────────────────────────────────

# Tạo 2 project test:
dotnet new xunit -n HuniBackend.UnitTests    -o tests/HuniBackend.UnitTests
dotnet new xunit -n HuniBackend.IntegTests   -o tests/HuniBackend.IntegTests

# Thêm vào solution
dotnet sln add tests/HuniBackend.UnitTests/HuniBackend.UnitTests.csproj
dotnet sln add tests/HuniBackend.IntegTests/HuniBackend.IntegTests.csproj

─── NUGET PACKAGES ──────────────────────────────────────────

# UnitTests project:
dotnet add tests/HuniBackend.UnitTests package xunit
dotnet add tests/HuniBackend.UnitTests package Moq
dotnet add tests/HuniBackend.UnitTests package FluentAssertions
dotnet add tests/HuniBackend.UnitTests package Microsoft.EntityFrameworkCore.InMemory
dotnet add tests/HuniBackend.UnitTests package AutoFixture

# IntegTests project:
dotnet add tests/HuniBackend.IntegTests package Microsoft.AspNetCore.Mvc.Testing
dotnet add tests/HuniBackend.IntegTests package FluentAssertions
dotnet add tests/HuniBackend.IntegTests package Bogus

# Project references
dotnet add tests/HuniBackend.UnitTests reference src/HuniBackend.Application/HuniBackend.Application.csproj
dotnet add tests/HuniBackend.UnitTests reference src/HuniBackend.Infrastructure/HuniBackend.Infrastructure.csproj
dotnet add tests/HuniBackend.IntegTests reference src/HuniBackend.API/HuniBackend.API.csproj

─── CẤU TRÚC THƯ MỤC ────────────────────────────────────────

tests/
├── HuniBackend.UnitTests/
│   ├── Services/
│   │   ├── PricingServiceTests.cs
│   │   ├── VoucherServiceTests.cs
│   │   ├── AuthServiceTests.cs
│   │   ├── OrderServiceTests.cs
│   │   └── ReviewServiceTests.cs
│   ├── Helpers/
│   │   ├── InputSanitizerTests.cs
│   │   └── LoginAttemptTrackerTests.cs
│   └── Validators/
│       ├── RegisterValidatorTests.cs
│       ├── CreateOrderValidatorTests.cs
│       └── CreateQuoteValidatorTests.cs
│
└── HuniBackend.IntegTests/
    ├── WebAppFactory.cs
    ├── Auth/
    │   └── AuthControllerTests.cs
    ├── Orders/
    │   └── OrdersControllerTests.cs
    ├── Products/
    │   └── ProductsControllerTests.cs
    └── Admin/
        └── AdminDashboardTests.cs

─── BASE TEST SETUP ─────────────────────────────────────────

// tests/HuniBackend.UnitTests/TestBase.cs
public abstract class TestBase
{
    protected AppDbContext CreateInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    protected Mock<T> MockOf<T>() where T : class => new Mock<T>();
}

// tests/HuniBackend.IntegTests/WebAppFactory.cs
public class HuniWebAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services => {
            // Thay thế DB thật bằng InMemory
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(opt =>
                opt.UseInMemoryDatabase("TestDb"));

            // Seed data cần thiết
            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            SeedTestData(db);
        });
    }

    private static void SeedTestData(AppDbContext db)
    {
        // Admin user
        db.Users.Add(new User {
            Id = "admin-test-001",
            Email = "admin@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            FullName = "Test Admin",
            Role = UserRole.ADMIN
        });

        // Customer user
        db.Users.Add(new User {
            Id = "customer-test-001",
            Email = "customer@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"),
            FullName = "Test Customer",
            Role = UserRole.CUSTOMER
        });

        // 1 sản phẩm mẫu
        db.Products.Add(new Product {
            Id = "prod-test-001",
            Slug = "ao-polo-test",
            Sku = "POLO-TEST-001",
            Title = "Áo Polo Test",
            Price = 150000,
            Category = "polo",
            Published = true
        });

        db.SaveChanges();
    }
}

Sau khi tạo xong:
dotnet build → không lỗi
dotnet test → tất cả pass (0 tests hiện tại, cần thêm test cases)
```

---

## ✅ PROMPT 7.2 — Unit Test: PricingService & VoucherService

```
Bạn là senior .NET test engineer. Hãy viết unit tests cho
PricingService và VoucherService trong HuniBackend.UnitTests.

─── PRICING SERVICE TESTS ───────────────────────────────────

// tests/HuniBackend.UnitTests/Services/PricingServiceTests.cs

public class PricingServiceTests : TestBase
{
    private readonly PricingService _sut = new();

    // Tạo product với wholesale tiers mẫu:
    // 5-99: 150.000đ | 100-499: 130.000đ | 500+: 110.000đ
    private Product CreateProductWithTiers() => new() {
        Price = 150000,
        WholesaleTiers = JsonSerializer.Serialize(new[] {
            new { min = 5,   max = 99,  price = 150000, label = "Lẻ" },
            new { min = 100, max = 499, price = 130000, label = "Sỉ" },
            new { min = 500, max = (int?)null, price = 110000, label = "Đại lý" }
        })
    };

    // TEST CASES BẮT BUỘC:

    [Fact] // Số lượng đúng tier đầu tiên (5-99)
    void CalculateTierPrice_Quantity50_Returns150000()

    [Fact] // Số lượng đúng tier giữa (100-499)
    void CalculateTierPrice_Quantity100_Returns130000()

    [Fact] // Số lượng đúng tier cao nhất (500+)
    void CalculateTierPrice_Quantity500_Returns110000()

    [Fact] // Số lượng ranh giới (99 → 100)
    void CalculateTierPrice_Quantity99_Returns150000()
    void CalculateTierPrice_Quantity100_Returns130000() // distinct test

    [Fact] // Không có tiers → dùng giá mặc định
    void CalculateTierPrice_NoTiers_ReturnsBasePrice()

    [Fact] // customLogo = true → thêm 15.000đ/chiếc
    void CalculateTierPrice_WithLogo_AddsLogoFee()

    [Fact] // customLogo = null → không thêm logo fee
    void CalculateTierPrice_NoLogo_NoLogoFee()

    [Theory] // Số lượng âm hoặc 0 → throw ArgumentException
    [InlineData(0)]
    [InlineData(-1)]
    void CalculateTierPrice_InvalidQuantity_ThrowsException(int qty)

─── VOUCHER SERVICE TESTS ───────────────────────────────────

// tests/HuniBackend.UnitTests/Services/VoucherServiceTests.cs

public class VoucherServiceTests : TestBase
{
    // TEST CASES BẮT BUỘC:

    [Fact] // Voucher hợp lệ percentage
    async Task ValidateVoucher_ValidPercentage_ReturnsDiscount()
    // Voucher: discount=10, type=percentage, minOrder=500000
    // Subtotal: 1.000.000 → discount = 100.000đ

    [Fact] // Voucher hợp lệ fixed amount
    async Task ValidateVoucher_ValidFixed_ReturnsFixedDiscount()
    // Voucher: discount=50000, type=fixed, minOrder=200000
    // Subtotal: 300.000 → discount = 50.000đ

    [Fact] // Percentage với maxDiscount trần
    async Task ValidateVoucher_PercentageWithMaxDiscount_CapsAtMax()
    // Voucher: discount=20%, maxDiscount=100000
    // Subtotal: 2.000.000 → 20% = 400.000 → bị cap lại 100.000đ

    [Fact] // Subtotal < minOrder → throw exception
    async Task ValidateVoucher_BelowMinOrder_Throws()

    [Fact] // Voucher expired → throw exception
    async Task ValidateVoucher_Expired_Throws()

    [Fact] // Voucher inactive → throw exception
    async Task ValidateVoucher_Inactive_Throws()

    [Fact] // Đã dùng hết (usedCount >= usageLimit) → throw exception
    async Task ValidateVoucher_ExceededUsageLimit_Throws()

    [Fact] // Code không tồn tại → throw exception
    async Task ValidateVoucher_InvalidCode_Throws()

    [Fact] // usedCount tăng sau khi validate thành công
    async Task ValidateVoucher_Success_IncrementsUsedCount()

Chạy test:
dotnet test tests/HuniBackend.UnitTests --filter "PricingServiceTests|VoucherServiceTests"
Tất cả tests phải PASS ✅
```

---

## ✅ PROMPT 7.3 — Unit Test: Auth, Order & Security

```
Bạn là senior .NET test engineer. Hãy viết unit tests cho
AuthService, OrderService, InputSanitizer và LoginAttemptTracker.

─── AUTH SERVICE TESTS ──────────────────────────────────────

// tests/HuniBackend.UnitTests/Services/AuthServiceTests.cs

TEST CASES:

[Fact] RegisterAsync_NewUser_CreatesUserWithHashedPassword()
→ Đăng ký thành công
→ Kiểm tra user.PasswordHash != "123456" (phải là hash)
→ Kiểm tra BCrypt.Verify("123456", user.PasswordHash) == true
→ Kiểm tra user.Role == UserRole.CUSTOMER

[Fact] RegisterAsync_DuplicateEmail_ThrowsConflictException()
→ Tạo user với email "test@huni.vn"
→ Tạo lại với cùng email → phải throw ConflictException / trả 409

[Fact] LoginAsync_CorrectCredentials_ReturnsToken()
→ Đăng nhập đúng → trả token không rỗng
→ Token phải bắt đầu bằng "eyJ" (JWT format)

[Fact] LoginAsync_WrongPassword_ThrowsUnauthorizedException()
→ Đăng nhập sai password → throw UnauthorizedException

[Fact] LoginAsync_UserNotFound_ThrowsUnauthorizedException()
→ Email không tồn tại → throw UnauthorizedException (không được tiết lộ "email không tồn tại")

[Fact] LoginAsync_UpdatesLastLoginAt()
→ Sau đăng nhập thành công → user.LastLoginAt != null

─── ORDER SERVICE TESTS ─────────────────────────────────────

// tests/HuniBackend.UnitTests/Services/OrderServiceTests.cs

TEST CASES:

[Fact] CreateOrder_ValidRequest_Returns201WithOrderNumber()
→ Tạo đơn hợp lệ → status 201
→ orderNumber format: "HN-" + date + "-" + 4 số

[Fact] CreateOrder_PriceMismatchOver1Percent_Returns400()
→ Gửi items[0].unitPrice = 99000 nhưng DB price = 150000
→ Phải trả 400 "Giá sản phẩm không hợp lệ"

[Fact] CreateOrder_PriceMismatchUnder1Percent_Accepts()
→ Gửi items[0].unitPrice = 149999 (DB = 150000) → chênh 0.0007% < 1%
→ Phải chấp nhận (tạo thành công)

[Fact] CreateOrder_WithValidVoucher_AppliesDiscount()
→ Voucher SUMMER10 (10% off, min 500k)
→ Subtotal 1.000.000 → discount = 100.000 → total = 900.000

[Fact] CreateOrder_QuantityBelowMinimum_Returns400()
→ quantity = 3 (< 5) → 400

[Fact] CreateOrder_NewPhone_CreatesNewCustomer()
→ SĐT mới → db.Customers tăng thêm 1

[Fact] CreateOrder_ExistingPhone_ReusesCustomer()
→ SĐT đã tồn tại → db.Customers không tăng

─── INPUT SANITIZER TESTS ───────────────────────────────────

// tests/HuniBackend.UnitTests/Helpers/InputSanitizerTests.cs

[Theory]
[InlineData("<script>alert('xss')</script>Hello", "Hello")]
[InlineData("<b>Bold</b> text", "Bold text")]
[InlineData("Normal text", "Normal text")]
[InlineData(null, "")]
void StripHtml_RemovesAllTags(string input, string expected)

[Theory]
[InlineData("<script>alert(1)</script>", true)]
[InlineData("javascript:void(0)", true)]
[InlineData("Normal notes", false)]
void ContainsMaliciousContent_DetectsCorrectly(string input, bool expected)

─── LOGIN ATTEMPT TRACKER TESTS ─────────────────────────────

// tests/HuniBackend.UnitTests/Helpers/LoginAttemptTrackerTests.cs

[Fact] IsLockedOut_FreshEmail_ReturnsFalse()
[Fact] RecordFailedAttempt_4Times_NotLockedOut()
[Fact] RecordFailedAttempt_5Times_LocksAccount()
[Fact] IsLockedOut_After5Fails_ReturnsTrue()
[Fact] RecordSuccess_ClearsAttempts()
[Fact] IsLockedOut_AfterLockExpires_ReturnsFalse()
→ Dùng fake time hoặc set LOCK_MINUTES = 0 để test expiry

─── VALIDATOR TESTS ─────────────────────────────────────────

// tests/HuniBackend.UnitTests/Validators/RegisterValidatorTests.cs

[Fact] Validate_ValidRequest_PassesValidation()
[Fact] Validate_EmptyFullName_Fails()
[Fact] Validate_InvalidEmail_Fails()
[Fact] Validate_ShortPhone_Fails()    // 9 số
[Fact] Validate_LongPhone_Fails()     // 12 số
[Fact] Validate_ShortPassword_Fails() // < 6 ký tự
[Fact] Validate_ValidPhone_NormalizedBeforeCheck() // "098 765 4321" → "0987654321"

Chạy test:
dotnet test tests/HuniBackend.UnitTests
Tất cả tests phải PASS ✅
Số lượng test tối thiểu: 30 tests
```

---

## ✅ PROMPT 7.4 — Integration Test: API Endpoints

```
Bạn là senior .NET test engineer. Hãy viết integration tests
kiểm tra các API endpoints thật sự.

─── AUTH CONTROLLER TESTS ───────────────────────────────────

// tests/HuniBackend.IntegTests/Auth/AuthControllerTests.cs

public class AuthControllerTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    public AuthControllerTests(HuniWebAppFactory factory)
        => _client = factory.CreateClient();

    TEST CASES:

    [Fact] POST_Register_ValidData_Returns201()
    → POST /api/auth/register với data hợp lệ
    → Response: 201 + { success: true, user: { id, email, fullName } }
    → KHÔNG có trường "passwordHash" trong response

    [Fact] POST_Register_DuplicateEmail_Returns409()
    → Đăng ký cùng email 2 lần → lần 2 phải 409

    [Fact] POST_Register_InvalidPhone_Returns400()
    → phone = "123" (quá ngắn) → 400 + validation errors

    [Fact] POST_Login_ValidCredentials_Returns200WithToken()
    → POST /api/auth/login đúng → 200 + { token: "eyJ..." }

    [Fact] POST_Login_WrongPassword_Returns401()
    → Password sai → 401 + { success: false, error: "..." }

    [Fact] GET_Me_WithValidToken_Returns200()
    → Login → lấy token → GET /api/auth/me với Bearer token
    → 200 + user info (không có passwordHash)

    [Fact] GET_Me_WithoutToken_Returns401()
    → GET /api/auth/me không có Authorization header → 401

─── ORDERS CONTROLLER TESTS ─────────────────────────────────

// tests/HuniBackend.IntegTests/Orders/OrdersControllerTests.cs

    [Fact] POST_Orders_ValidRequest_Returns201WithOrderNumber()
    → Gửi đơn hàng đầy đủ → 201
    → orderNumber khớp regex: /^HN-\d{6}-\d{4}$/

    [Fact] POST_Orders_SmallQuantity_Returns400()
    → items[0].quantity = 2 → 400

    [Fact] POST_Orders_InvalidPaymentMethod_Returns400()
    → paymentMethod = "cash" → 400

    [Fact] POST_Orders_RateLimit_After5Requests_Returns429()
    → Gửi 6 đơn liên tiếp từ cùng client → lần 6 phải 429

    [Fact] GET_Orders_WithoutAuth_Returns401()
    → GET /api/orders (không có token) → 401

    [Fact] GET_Orders_CustomerWithoutMine_Returns403()
    → GET /api/orders (customer token, không có ?mine=true) → 403

    [Fact] GET_Orders_AdminToken_Returns200WithList()
    → GET /api/orders (admin token) → 200 + danh sách đơn

─── PRODUCTS CONTROLLER TESTS ───────────────────────────────

// tests/HuniBackend.IntegTests/Products/ProductsControllerTests.cs

    [Fact] GET_Products_ReturnsListWithPagination()
    → GET /api/products → 200 + { data: { products: [...], total, page } }

    [Fact] GET_Products_WithCategoryFilter_ReturnsFiltered()
    → GET /api/products?category=polo → chỉ có sản phẩm polo

    [Fact] GET_ProductById_ValidSlug_Returns200()
    → GET /api/products/ao-polo-test → 200 + product detail

    [Fact] GET_ProductById_InvalidId_Returns404()
    → GET /api/products/không-tồn-tại → 404

    [Fact] POST_Products_WithoutAuth_Returns401()
    → POST /api/products (không có token) → 401

    [Fact] POST_Products_WithCustomerToken_Returns403()
    → POST /api/products (customer token) → 403

    [Fact] POST_Products_WithAdminToken_Returns201()
    → POST /api/products (admin token) + valid body → 201

─── SECURITY HEADER TESTS ───────────────────────────────────

// tests/HuniBackend.IntegTests/Security/SecurityHeaderTests.cs

    [Fact] Response_HasXContentTypeOptionsHeader()
    [Fact] Response_HasXFrameOptionsHeader()
    [Fact] Response_HasStrictTransportSecurityHeader()
    [Fact] Response_DoesNotExposeServerHeader()
    [Fact] Response_DoesNotExposePasswordHash()
    → Gọi GET /api/auth/me → kiểm tra response body không có "passwordHash"

─── CHẠY TẤT CẢ TEST ────────────────────────────────────────

# Chạy tất cả
dotnet test

# Chạy riêng từng project
dotnet test tests/HuniBackend.UnitTests
dotnet test tests/HuniBackend.IntegTests

# Chạy với coverage report
dotnet test --collect:"XPlat Code Coverage"
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coverage-report" -reporttypes:Html
# Mở coverage-report/index.html

Mục tiêu:
  ✅ Tất cả tests PASS
  ✅ Code coverage ≥ 70% cho Application layer
  ✅ Không có test bị skip
```

---

## ✅ PROMPT 7.5 — Manual Test Checklist (Swagger + Postman)

```
Đây là checklist kiểm thử thủ công đầy đủ trước khi deploy.
Thực hiện trên Swagger UI (http://localhost:5000/swagger)
hoặc Postman.

─── CHUẨN BỊ ────────────────────────────────────────────────

1. Chạy backend: dotnet run --project src/HuniBackend.API
2. Mở Swagger: http://localhost:5000/swagger
3. Đăng nhập lấy ADMIN token:
   POST /api/auth/login { "email":"admin@huni.vn", "password":"..." }
   → Copy token → Click "Authorize" → Paste "Bearer {token}"

─── AUTH (5 test cases) ─────────────────────────────────────

□ POST /api/auth/register   → 201 ✅
□ POST /api/auth/register   email trùng → 409 ✅
□ POST /api/auth/login      đúng → 200 + token ✅
□ POST /api/auth/login      sai password → 401 ✅
□ GET  /api/auth/me         có token → 200 (không có passwordHash) ✅

─── ORDERS (6 test cases) ───────────────────────────────────

□ POST /api/orders   đủ thông tin → 201 + orderNumber ✅
□ POST /api/orders   quantity=2 → 400 ✅
□ POST /api/orders   paymentMethod="cash" → 400 ✅
□ POST /api/orders   6 lần liên tiếp → lần 6 nhận 429 ✅
□ GET  /api/orders   không có token → 401 ✅
□ GET  /api/orders   ADMIN token → 200 + list ✅

─── QUOTES (3 test cases) ───────────────────────────────────

□ POST /api/quotes   đủ thông tin → 201 ✅
□ POST /api/quotes   quantity=5 → 400 (min 10) ✅
□ POST /api/quotes   category="invalid" → 400 ✅

─── TRACKING (3 test cases) ─────────────────────────────────

□ GET /api/tracking?code=HN-261002-0001 → 200 (order hoặc null) ✅
□ GET /api/tracking?code=PHONE:0987654321 → 200 ✅
□ GET /api/tracking (không có code) → 400 ✅

─── CHAT (2 test cases) ─────────────────────────────────────

□ POST /api/chat   messages hợp lệ → 200 + { reply: "..." } ✅
□ POST /api/chat   (Gemini API key sai) → vẫn 200 (fallback message) ✅

─── PRODUCTS (5 test cases) ─────────────────────────────────

□ GET  /api/products          → 200 + list ✅
□ GET  /api/products?category=polo → filter đúng ✅
□ GET  /api/products/{slug}   → 200 + detail ✅
□ POST /api/products  (customer token) → 403 ✅
□ POST /api/products  (admin token)   → 201 ✅

─── REVIEWS (4 test cases) ──────────────────────────────────

□ GET  /api/reviews?productId=xxx → 200 + { canReview, reviews } ✅
□ GET  /api/reviews (thiếu productId) → 400 ✅
□ POST /api/reviews (không auth) → 401 ✅
□ POST /api/reviews (ADMIN, đã login) → 201 ✅

─── ADMIN (8 test cases) ────────────────────────────────────

□ GET  /api/admin/dashboard → stats + recentOrders ✅
□ GET  /api/admin/orders    → list với pagination ✅
□ PATCH /api/admin/orders/{id} → cập nhật status ✅
□ GET  /api/admin/quotes    → list ✅
□ GET  /api/admin/customers → list + orderCount ✅
□ POST /api/admin/vouchers  → 201 + voucher mới ✅
□ GET  /api/admin/reviews   → list + stats ✅
□ GET  /api/admin/returns   → list + stats ✅

─── SECURITY (5 test cases) ─────────────────────────────────

□ Response headers: X-Content-Type-Options: nosniff ✅
□ Response headers: X-Frame-Options: DENY ✅
□ Response KHÔNG có header "Server: Kestrel" ✅
□ Login sai 6 lần → bị khóa 15 phút ✅
□ dotnet list package --vulnerable → không có kết quả ✅

─── KẾT QUẢ ─────────────────────────────────────────────────

Tổng: 41 test cases thủ công
Đạt: tất cả ✅ → sẵn sàng deploy Phase 8!
```

---

## 📊 Tóm Tắt Phase 7

```
Prompt 7.1 → Cài đặt xUnit + Moq + WebApplicationFactory
Prompt 7.2 → Unit test: PricingService + VoucherService (15+ tests)
Prompt 7.3 → Unit test: AuthService + OrderService + Sanitizer (20+ tests)
Prompt 7.4 → Integration test: Endpoints + Security headers (20+ tests)
Prompt 7.5 → Manual test checklist (41 cases qua Swagger/Postman)

Tổng cộng: 55+ tests tự động + 41 manual checks
Mục tiêu coverage: ≥ 70% Application layer
```

---

*🧪 HUNI Phase 7 — Kiểm Thử Toàn Diện*
*Ngày tạo: 02/10/2026*
