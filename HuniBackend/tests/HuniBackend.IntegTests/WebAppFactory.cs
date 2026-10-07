using System.Net.Http.Json;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HuniBackend.IntegTests;

public class HuniWebAppFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = "TestDb_" + Guid.NewGuid();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("TestingDbName", _dbName);

        builder.ConfigureServices(services =>
        {
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
            SeedTestData(db);
        });
    }

    private static void SeedTestData(AppDbContext db)
    {
        if (db.Users.Find("admin-test-001") == null && !db.Users.Any(u => u.Email == "admin@test.com"))
        {
            db.Users.Add(new User
            {
                Id = "admin-test-001",
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FullName = "Test Admin",
                Role = UserRole.ADMIN,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.Users.Find("customer-test-001") == null && !db.Users.Any(u => u.Email == "customer@test.com"))
        {
            db.Users.Add(new User
            {
                Id = "customer-test-001",
                Email = "customer@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"),
                FullName = "Test Customer",
                Role = UserRole.CUSTOMER,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.Products.Find("prod-test-001") == null && !db.Products.Any(p => p.Id == "prod-test-001"))
        {
            db.Products.Add(new Product
            {
                Id = "prod-test-001",
                Slug = "ao-polo-test",
                Sku = "POLO-TEST-001",
                Title = "Áo Polo Test",
                Price = 150000,
                Category = "polo",
                Published = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.Reviews.Find("rev-001") == null)
        {
            db.Reviews.Add(new Review
            {
                Id = "rev-001",
                ProductId = "prod-test-001",
                UserId = "customer-test-001",
                CustomerName = "Nguyễn Văn Hưng",
                CustomerPhone = "0912345678",
                CustomerEmail = "hung@test.com",
                Rating = 5,
                Content = "Sản phẩm rất đẹp và chất lượng!",
                Status = ReviewStatus.PENDING,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.Reviews.Find("rev-005") == null)
        {
            db.Reviews.Add(new Review
            {
                Id = "rev-005",
                ProductId = "prod-test-001",
                UserId = "customer-test-001",
                CustomerName = "Trần Thị B",
                Rating = 4,
                Content = "Giao hàng đúng hẹn",
                Status = ReviewStatus.APPROVED,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.ReturnRequests.Find("RT-261001-001") == null)
        {
            db.ReturnRequests.Add(new ReturnRequest
            {
                Id = "RT-261001-001",
                OrderNumber = "ORD-TEST-001",
                CustomerName = "Nguyễn Văn A",
                CustomerPhone = "0901234567",
                CustomerEmail = "a@test.com",
                ProductId = "prod-test-001",
                ProductTitle = "Áo Polo Test",
                Quantity = 2,
                Type = ReturnType.REFUND,
                Reason = "Sai kích thước",
                Details = "Cần hoàn tiền cho đơn hàng",
                RefundAmount = 0,
                Status = ReturnStatus.PENDING,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        if (db.ReturnRequests.Find("RT-260928-005") == null)
        {
            db.ReturnRequests.Add(new ReturnRequest
            {
                Id = "RT-260928-005",
                OrderNumber = "ORD-TEST-002",
                CustomerName = "Trần Văn C",
                CustomerPhone = "0987654321",
                CustomerEmail = "c@test.com",
                ProductId = "prod-test-001",
                ProductTitle = "Áo Polo Test",
                Quantity = 1,
                Type = ReturnType.EXCHANGE,
                Reason = "Đổi màu khác",
                Details = "Cần đổi sang màu đen",
                RefundAmount = 0,
                Status = ReturnStatus.PENDING,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        db.SaveChanges();
    }

    public async Task<string> GetTokenAsync(string email, string password)
    {
        var client = CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        response.EnsureSuccessStatusCode();

        if (response.Headers.TryGetValues("Set-Cookie", out var cookies))
        {
            var cookie = cookies.FirstOrDefault(c => c.StartsWith("huni_token="));
            if (cookie != null)
            {
                var tokenPart = cookie.Split(';')[0];
                return tokenPart["huni_token=".Length..];
            }
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty("token", out var tokenProp))
        {
            return tokenProp.GetString() ?? string.Empty;
        }

        throw new InvalidOperationException("No token found in response or cookies");
    }
}
