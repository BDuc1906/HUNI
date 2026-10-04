using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Application.DTOs.Vouchers;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace HuniBackend.IntegTests.Admin;

public class AdminControllersTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public AdminControllersTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<string> GetAdminTokenAsync()
    {
        return await _factory.GetTokenAsync("admin@test.com", "Admin123!");
    }

    [Fact]
    public async Task Admin_Orders_Flow_List_And_Patch()
    {
        var token = await GetAdminTokenAsync();

        // Seed an order first
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var customer = new Customer
            {
                FullName = "Admin Test Customer",
                Phone = $"098{Random.Shared.Next(1000000, 9999999)}",
                Email = "admintest@example.com"
            };
            db.Customers.Add(customer);

            var order = new Order
            {
                OrderNumber = $"HN-TEST-{Random.Shared.Next(1000, 9999)}",
                CustomerId = customer.Id,
                Customer = customer,
                Status = OrderStatus.PENDING,
                PaymentMethod = "vietqr",
                Subtotal = 500000,
                Total = 500000
            };
            db.Orders.Add(order);
            await db.SaveChangesAsync();
        }

        // 1. GET /api/admin/orders
        using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/orders?page=1&limit=10");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getRes = await _client.SendAsync(getReq);

        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var getJson = await getRes.Content.ReadAsStringAsync();
        using var getDoc = JsonDocument.Parse(getJson);
        getDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        getDoc.RootElement.GetProperty("data").GetProperty("orders").ValueKind.Should().Be(JsonValueKind.Array);
        getDoc.RootElement.GetProperty("data").GetProperty("summary").GetProperty("pending").GetInt32().Should().BeGreaterThanOrEqualTo(1);

        // 1b. GET /api/admin/orders?search=HN
        using var searchReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/orders?search=HN");
        searchReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var searchRes = await _client.SendAsync(searchReq);
        searchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var searchJson = await searchRes.Content.ReadAsStringAsync();
        using var searchDoc = JsonDocument.Parse(searchJson);
        searchDoc.RootElement.GetProperty("data").GetProperty("orders").GetArrayLength().Should().BeGreaterThan(0);

        // 2. PATCH /api/admin/orders/{id}
        var firstOrder = getDoc.RootElement.GetProperty("data").GetProperty("orders")[0];
        var orderNumber = firstOrder.GetProperty("orderNumber").GetString()!;

        using var patchReq = new HttpRequestMessage(HttpMethod.Patch, $"/api/admin/orders/{orderNumber}");
        patchReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        patchReq.Content = JsonContent.Create(new
        {
            status = "CONFIRMED",
            notes = "Đã xác nhận thanh toán qua admin"
        });

        var patchRes = await _client.SendAsync(patchReq);
        patchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var patchJson = await patchRes.Content.ReadAsStringAsync();
        using var patchDoc = JsonDocument.Parse(patchJson);
        patchDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        patchDoc.RootElement.GetProperty("data").GetProperty("status").GetString().Should().Be("CONFIRMED");
    }

    [Fact]
    public async Task Admin_Quotes_Flow_List_And_Patch()
    {
        var token = await GetAdminTokenAsync();

        string quoteId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var quote = new Quote
            {
                FullName = "Công Ty Test Báo Giá",
                Phone = $"097{Random.Shared.Next(1000000, 9999999)}",
                Category = "polo",
                Quantity = 50,
                Status = QuoteStatus.NEW
            };
            db.Quotes.Add(quote);
            await db.SaveChangesAsync();
            quoteId = quote.Id;
        }

        // GET /api/admin/quotes
        using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/quotes?category=polo");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getRes = await _client.SendAsync(getReq);
        getRes.StatusCode.Should().Be(HttpStatusCode.OK);

        // PATCH /api/admin/quotes/{id}
        using var patchReq = new HttpRequestMessage(HttpMethod.Patch, $"/api/admin/quotes/{quoteId}");
        patchReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        patchReq.Content = JsonContent.Create(new
        {
            status = "QUOTED",
            estimatedPrice = 185000,
            notes = "Đã báo giá qua Zalo"
        });

        var patchRes = await _client.SendAsync(patchReq);
        patchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var patchJson = await patchRes.Content.ReadAsStringAsync();
        using var patchDoc = JsonDocument.Parse(patchJson);
        patchDoc.RootElement.GetProperty("data").GetProperty("status").GetString().Should().Be("QUOTED");
        patchDoc.RootElement.GetProperty("data").GetProperty("estimatedPrice").GetInt32().Should().Be(185000);
    }

    [Fact]
    public async Task Admin_Customers_List_Returns200_WithCounts()
    {
        var token = await GetAdminTokenAsync();

        using var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/customers");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await _client.SendAsync(req);
        res.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        doc.RootElement.GetProperty("data").GetProperty("customers").ValueKind.Should().Be(JsonValueKind.Array);
    }

    [Fact]
    public async Task Admin_Vouchers_Flow_Create_Duplicate409_List_Delete()
    {
        var token = await GetAdminTokenAsync();
        var uniqueCode = $"TEST{Random.Shared.Next(10000, 99999)}";

        // 1. Create voucher -> 201
        using var createReq = new HttpRequestMessage(HttpMethod.Post, "/api/admin/vouchers");
        createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        createReq.Content = JsonContent.Create(new CreateVoucherRequest(
            Code: uniqueCode,
            Type: "percentage",
            Discount: 15,
            MinOrder: 500000,
            UsageLimit: 50
        ));

        var createRes = await _client.SendAsync(createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);

        // 2. Duplicate voucher code -> 409 Conflict
        using var dupReq = new HttpRequestMessage(HttpMethod.Post, "/api/admin/vouchers");
        dupReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        dupReq.Content = JsonContent.Create(new CreateVoucherRequest(
            Code: uniqueCode.ToLower(), // should be case-insensitive uppercase
            Type: "percentage",
            Discount: 10
        ));

        var dupRes = await _client.SendAsync(dupReq);
        dupRes.StatusCode.Should().Be(HttpStatusCode.Conflict);

        // 3. GET /api/admin/vouchers -> 200
        using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/vouchers");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getRes = await _client.SendAsync(getReq);
        getRes.StatusCode.Should().Be(HttpStatusCode.OK);

        // 4. DELETE /api/admin/vouchers/{code} -> 200
        using var delReq = new HttpRequestMessage(HttpMethod.Delete, $"/api/admin/vouchers/{uniqueCode}");
        delReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var delRes = await _client.SendAsync(delReq);
        delRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Admin_Reviews_Flow_List_PatchReply_Delete()
    {
        var token = await GetAdminTokenAsync();

        // 1. GET /api/admin/reviews -> list + stats
        using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/reviews?page=1&limit=10");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getRes = await _client.SendAsync(getReq);

        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var getJson = await getRes.Content.ReadAsStringAsync();
        using var getDoc = JsonDocument.Parse(getJson);
        getDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        getDoc.RootElement.GetProperty("data").GetProperty("reviews").ValueKind.Should().Be(JsonValueKind.Array);
        getDoc.RootElement.GetProperty("data").GetProperty("stats").GetProperty("totalReviews").GetInt32().Should().BeGreaterThan(0);

        // 2. PATCH /api/admin/reviews with adminReply -> repliedAt is set
        using var patchReq = new HttpRequestMessage(HttpMethod.Patch, "/api/admin/reviews");
        patchReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        patchReq.Content = JsonContent.Create(new
        {
            id = "rev-001",
            status = "APPROVED",
            adminReply = "Cảm ơn anh Hưng đã phản hồi tốt về HUNI!"
        });

        var patchRes = await _client.SendAsync(patchReq);
        patchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var patchJson = await patchRes.Content.ReadAsStringAsync();
        using var patchDoc = JsonDocument.Parse(patchJson);
        patchDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        patchDoc.RootElement.GetProperty("data").GetProperty("repliedAt").GetString().Should().NotBeNullOrEmpty();
        patchDoc.RootElement.GetProperty("data").GetProperty("adminReply").GetString().Should().Be("Cảm ơn anh Hưng đã phản hồi tốt về HUNI!");

        // 3. DELETE /api/admin/reviews -> deletes
        using var delReq = new HttpRequestMessage(HttpMethod.Delete, "/api/admin/reviews");
        delReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        delReq.Content = JsonContent.Create(new
        {
            ids = new[] { "rev-005" }
        });

        var delRes = await _client.SendAsync(delReq);
        delRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var delJson = await delRes.Content.ReadAsStringAsync();
        using var delDoc = JsonDocument.Parse(delJson);
        delDoc.RootElement.GetProperty("deletedCount").GetInt32().Should().BeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task Admin_Returns_Flow_List_Patch_Delete()
    {
        var token = await GetAdminTokenAsync();

        // 1. GET /api/admin/returns -> list + stats
        using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/admin/returns?page=1&limit=10");
        getReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getRes = await _client.SendAsync(getReq);

        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var getJson = await getRes.Content.ReadAsStringAsync();
        using var getDoc = JsonDocument.Parse(getJson);
        getDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        getDoc.RootElement.GetProperty("data").GetProperty("returns").ValueKind.Should().Be(JsonValueKind.Array);
        getDoc.RootElement.GetProperty("data").GetProperty("stats").GetProperty("totalRequests").GetInt32().Should().BeGreaterThan(0);

        // 2. PATCH /api/admin/returns body {id, status: "REFUNDED", refundAmount: 500000}
        using var patchReq = new HttpRequestMessage(HttpMethod.Patch, "/api/admin/returns");
        patchReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        patchReq.Content = JsonContent.Create(new
        {
            id = "RT-261001-001",
            status = "REFUNDED",
            adminNotes = "Đã duyệt hoàn tiền thành công",
            refundAmount = 500000
        });

        var patchRes = await _client.SendAsync(patchReq);
        patchRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var patchJson = await patchRes.Content.ReadAsStringAsync();
        using var patchDoc = JsonDocument.Parse(patchJson);
        patchDoc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        patchDoc.RootElement.GetProperty("data").GetProperty("status").GetString().Should().Be("REFUNDED");
        patchDoc.RootElement.GetProperty("data").GetProperty("refundAmount").GetInt32().Should().Be(500000);

        // 3. DELETE /api/admin/returns -> deletes
        using var delReq = new HttpRequestMessage(HttpMethod.Delete, "/api/admin/returns");
        delReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        delReq.Content = JsonContent.Create(new
        {
            ids = new[] { "RT-260928-005" }
        });

        var delRes = await _client.SendAsync(delReq);
        delRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var delJson = await delRes.Content.ReadAsStringAsync();
        using var delDoc = JsonDocument.Parse(delJson);
        delDoc.RootElement.GetProperty("deletedCount").GetInt32().Should().BeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task SeedProduction_WithInvalidSecret_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/api/admin/seed-production", new
        {
            secret = "wrong-secret",
            adminEmail = "admin@huni.vn",
            adminPassword = "Admin123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task SeedProduction_WhenAdminAlreadyExists_ReturnsConflict()
    {
        // Ensure at least one admin exists
        await GetAdminTokenAsync();

        var response = await _client.PostAsJsonAsync("/api/admin/seed-production", new
        {
            secret = "huni-seed-2026-change-this",
            adminEmail = "admin@huni.vn",
            adminPassword = "Admin123!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
