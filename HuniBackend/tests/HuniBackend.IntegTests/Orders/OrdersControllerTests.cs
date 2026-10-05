using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using FluentAssertions;
using HuniBackend.Application.DTOs.Orders;
using Xunit;

namespace HuniBackend.IntegTests.Orders;

public class OrdersControllerTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public OrdersControllerTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private CreateOrderRequest CreateSampleOrder(int quantity = 10, string paymentMethod = "vietqr") => new(
        Customer: new CustomerInfo(
            FullName: "Do Thi E",
            Phone: "0901234567",
            Address: "789 Tran Phu, Ha Noi",
            Email: "dothie@gmail.com",
            Company: "HDC Viet"
        ),
        Items: new List<OrderItemRequest>
        {
            new(
                ProductId: "prod-test-001",
                ProductName: "Áo Polo Test",
                Quantity: quantity,
                UnitPrice: 150000,
                Color: "Xanh",
                Size: "M",
                CustomLogo: null
            )
        },
        PaymentMethod: paymentMethod,
        VoucherCode: null,
        Notes: "Giao ngay",
        VatInfo: null
    );

    [Fact]
    public async Task POST_Orders_ValidRequest_Returns201WithOrderNumber()
    {
        var req = CreateSampleOrder();
        var response = await _client.PostAsJsonAsync("/api/orders", req);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"orderNumber\":");

        using var doc = JsonDocument.Parse(json);
        var orderNumber = doc.RootElement.GetProperty("order").GetProperty("orderNumber").GetString();
        orderNumber.Should().MatchRegex(@"^HN-\d{6}-\d{4}$");
    }

    [Fact]
    public async Task POST_Orders_SmallQuantity_Returns400()
    {
        var req = CreateSampleOrder(quantity: 2); // Less than minimum 5
        var response = await _client.PostAsJsonAsync("/api/orders", req);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Orders_InvalidPaymentMethod_Returns400()
    {
        var req = CreateSampleOrder(paymentMethod: "cash"); // Only vietqr, deposit30, freesample allowed
        var response = await _client.PostAsJsonAsync("/api/orders", req);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task POST_Orders_RateLimit_After5Requests_Returns429()
    {
        // Gửi các request liên tiếp để kiểm tra rate limit
        HttpStatusCode lastStatus = HttpStatusCode.OK;
        for (int i = 0; i < 7; i++)
        {
            var req = CreateSampleOrder();
            var res = await _client.PostAsJsonAsync("/api/orders", req);
            lastStatus = res.StatusCode;
            if (res.StatusCode == HttpStatusCode.TooManyRequests)
            {
                break;
            }
        }

        lastStatus.Should().Be(HttpStatusCode.TooManyRequests);
    }

    [Fact]
    public async Task GET_Orders_WithoutAuth_Returns401()
    {
        var response = await _client.GetAsync("/api/orders");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Orders_CustomerWithoutMine_Returns403()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/orders");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GET_Orders_AdminToken_Returns200WithList()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/orders");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"success\":true");
        json.Should().Contain("\"orders\":");
    }

    [Fact]
    public async Task PATCH_Orders_SanitizesHtmlAndUpdatesNotes()
    {
        HuniBackend.API.Middleware.OrderRateLimitMiddleware.Reset();
        var req = CreateSampleOrder();
        var createRes = await _client.PostAsJsonAsync("/api/orders", req);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var createJson = await createRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(createJson);
        var orderNumber = doc.RootElement.GetProperty("order").GetProperty("orderNumber").GetString();

        var patchBody = new { Notes = "<script>alert('xss')</script>Giao gap trong tuan" };
        var patchRes = await _client.PatchAsJsonAsync($"/api/orders/{orderNumber}?phone={req.Customer.Phone}", patchBody);
        patchRes.StatusCode.Should().Be(HttpStatusCode.OK);

        var getRes = await _client.GetAsync($"/api/orders/{orderNumber}?phone={req.Customer.Phone}");
        getRes.StatusCode.Should().Be(HttpStatusCode.OK);
        var getJson = await getRes.Content.ReadAsStringAsync();
        getJson.Should().NotContain("<script>");
        getJson.Should().Contain("Giao gap trong tuan");
    }

    [Fact]
    public async Task GET_OrderByNumber_WrongPhone_Returns403()
    {
        HuniBackend.API.Middleware.OrderRateLimitMiddleware.Reset();
        var req = CreateSampleOrder();
        var createRes = await _client.PostAsJsonAsync("/api/orders", req);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);
        var createJson = await createRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(createJson);
        var orderNumber = doc.RootElement.GetProperty("order").GetProperty("orderNumber").GetString();

        var getRes = await _client.GetAsync($"/api/orders/{orderNumber}?phone=0999999999");
        getRes.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task PostOrder_WithSameIdempotencyKey_ShouldNotCreateDuplicate()
    {
        HuniBackend.API.Middleware.OrderRateLimitMiddleware.Reset();
        var client = _factory.CreateClient();

        var key = Guid.NewGuid().ToString();
        var orderPayload = CreateSampleOrder();

        var request1 = new HttpRequestMessage(HttpMethod.Post, "/api/orders");
        request1.Headers.Add("Idempotency-Key", key);
        request1.Content = JsonContent.Create(orderPayload);

        var request2 = new HttpRequestMessage(HttpMethod.Post, "/api/orders");
        request2.Headers.Add("Idempotency-Key", key); // cùng key!
        request2.Content = JsonContent.Create(orderPayload);

        var response1 = await client.SendAsync(request1);
        var response2 = await client.SendAsync(request2);

        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);
        Assert.Equal(HttpStatusCode.Created, response2.StatusCode); // trả 201 từ cache

        var json1 = await response1.Content.ReadFromJsonAsync<JsonElement>();
        var json2 = await response2.Content.ReadFromJsonAsync<JsonElement>();

        // Phải là cùng 1 order number
        Assert.Equal(
            json1.GetProperty("order").GetProperty("orderNumber").GetString(),
            json2.GetProperty("order").GetProperty("orderNumber").GetString()
        );

        // Header đánh dấu response được lấy từ cache
        Assert.True(response2.Headers.Contains("X-Idempotent-Replayed"));
    }
}
