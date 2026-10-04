using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using HuniBackend.Application.DTOs.Reviews;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace HuniBackend.IntegTests.Reviews;

public class ReviewsControllerTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public ReviewsControllerTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GET_Reviews_WithoutProductId_Returns400()
    {
        var response = await _client.GetAsync("/api/reviews");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GET_Reviews_WithProductId_Unauthenticated_Returns200_WithCanReviewFalse()
    {
        var response = await _client.GetAsync("/api/reviews?productId=prod-test-001");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        doc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        doc.RootElement.GetProperty("canReview").GetBoolean().Should().BeFalse();
        doc.RootElement.GetProperty("isAuthenticated").GetBoolean().Should().BeFalse();
        doc.RootElement.GetProperty("reviews").ValueKind.Should().Be(JsonValueKind.Array);
        doc.RootElement.GetProperty("data").GetProperty("reviews").ValueKind.Should().Be(JsonValueKind.Array);
    }

    [Fact]
    public async Task POST_Reviews_WithoutAuth_Returns401()
    {
        var request = new CreateReviewRequest(
            ProductId: "prod-test-001",
            Rating: 5,
            Content: "Sản phẩm chất lượng rất tốt!"
        );

        var response = await _client.PostAsJsonAsync("/api/reviews", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task POST_Reviews_WithAdminToken_Returns201()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/reviews");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var uniqueProductId = $"prod-admin-{Guid.NewGuid():N}";
        request.Content = JsonContent.Create(new CreateReviewRequest(
            ProductId: uniqueProductId,
            Rating: 5,
            Content: "Áo may rất đẹp và chuẩn form"
        ));

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        doc.RootElement.GetProperty("message").GetString().Should().Be("Gửi đánh giá thành công");
        doc.RootElement.GetProperty("review").GetProperty("rating").GetInt16().Should().Be(5);
        doc.RootElement.GetProperty("data").GetProperty("review").GetProperty("rating").GetInt16().Should().Be(5);
    }

    [Fact]
    public async Task POST_Reviews_DuplicateReview_Returns400_WithAlreadyReviewedMessage()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        var uniqueProductId = $"prod-dup-{Guid.NewGuid():N}";

        // Lần 1: Thành công
        using var req1 = new HttpRequestMessage(HttpMethod.Post, "/api/reviews");
        req1.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        req1.Content = JsonContent.Create(new CreateReviewRequest(
            ProductId: uniqueProductId,
            Rating: 5,
            Content: "Đánh giá lần đầu thành công"
        ));
        var res1 = await _client.SendAsync(req1);
        res1.StatusCode.Should().Be(HttpStatusCode.Created);

        // Lần 2: Cùng productId và user -> 400
        using var req2 = new HttpRequestMessage(HttpMethod.Post, "/api/reviews");
        req2.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        req2.Content = JsonContent.Create(new CreateReviewRequest(
            ProductId: uniqueProductId,
            Rating: 4,
            Content: "Đánh giá lần hai phải bị từ chối"
        ));
        var res2 = await _client.SendAsync(req2);

        res2.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var json2 = await res2.Content.ReadAsStringAsync();
        json2.Should().Contain("Bạn đã gửi đánh giá cho sản phẩm này rồi.");
    }

    [Fact]
    public async Task POST_Reviews_CustomerNotOrdered_Returns403()
    {
        var uniqueProductId = $"prod-unpurchased-{Guid.NewGuid():N}";

        // Đảm bảo có ít nhất 1 đơn hàng trong DB để trigger kiểm tra đã mua hàng
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            if (!db.Orders.Any())
            {
                var cust = new Customer
                {
                    FullName = "Other Customer",
                    Phone = "0999888777",
                    Email = "other@test.com"
                };
                db.Customers.Add(cust);
                db.Orders.Add(new Order
                {
                    OrderNumber = "HN-OTHER-001",
                    Customer = cust,
                    Status = OrderStatus.CONFIRMED,
                    PaymentMethod = "vietqr",
                    Subtotal = 500000,
                    Total = 500000,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
                await db.SaveChangesAsync();
            }
        }

        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/reviews");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Content = JsonContent.Create(new CreateReviewRequest(
            ProductId: uniqueProductId,
            Rating: 5,
            Content: "Khách chưa từng mua sản phẩm này"
        ));

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
