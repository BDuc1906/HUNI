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

        db.SaveChanges();
    }

    public async Task<string> GetTokenAsync(string email, string password)
    {
        var client = CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("token").GetString() ?? string.Empty;
    }
}
