using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using HuniBackend.Application.DTOs.Quotes;
using Xunit;

namespace HuniBackend.IntegTests;

public class QuotesTrackingChatTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;

    public QuotesTrackingChatTests(HuniWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostQuote_QuantityBelow10_Returns400_WithMinQuantityMessage()
    {
        var request = new CreateQuoteRequest(
            FullName: "Nguyễn Văn Test",
            Phone: "0912345678",
            Email: "test@example.com",
            Company: "Công ty ABC",
            Category: "polo",
            Quantity: 5, // < 10
            EstimatedPrice: 1000000,
            Notes: "Cần mẫu gấp"
        );

        var response = await _client.PostAsJsonAsync("/api/quotes", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("Số lượng tối thiểu 10");
    }

    [Fact]
    public async Task PostQuote_ValidRequest_Returns201_WithQuoteId()
    {
        var request = new CreateQuoteRequest(
            FullName: "Trần Thị Mai",
            Phone: "0987654321",
            Email: "mai.tran@huni.vn",
            Company: "HUNI Garment",
            Category: "shirt",
            Quantity: 30,
            EstimatedPrice: 5000000,
            Notes: "In logo ngực trái và tay áo"
        );

        var response = await _client.PostAsJsonAsync("/api/quotes", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        doc.RootElement.GetProperty("quoteId").GetString().Should().NotBeNullOrWhiteSpace();
        doc.RootElement.GetProperty("message").GetString().Should().Be("Yêu cầu báo giá đã được tiếp nhận");
    }

    [Fact]
    public async Task GetTracking_WithoutCode_Returns400_WithMissingCodeError()
    {
        var response = await _client.GetAsync("/api/tracking");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("Thiếu mã đơn hàng");
    }

    [Fact]
    public async Task GetTracking_WithNonExistentCode_Returns200_WithOrderNull()
    {
        var response = await _client.GetAsync("/api/tracking?code=HN-261002-0001");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("success").GetBoolean().Should().BeTrue();
        doc.RootElement.GetProperty("order").ValueKind.Should().Be(JsonValueKind.Null);
    }

    [Fact]
    public async Task PostChat_WithMessages_Returns200_WithReply()
    {
        var request = new
        {
            messages = new[]
            {
                new { role = "user", text = "Xin chào, tôi muốn hỏi giá áo polo số lượng 50 chiếc" }
            }
        };

        var response = await _client.PostAsJsonAsync("/api/chat", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.TryGetProperty("reply", out var replyProp).Should().BeTrue();
        replyProp.GetString().Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task PostChat_WhenAiUnavailableOrEmpty_AlwaysReturns200_Not500()
    {
        var request = new
        {
            messages = Array.Empty<object>()
        };

        var response = await _client.PostAsJsonAsync("/api/chat", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.TryGetProperty("reply", out var replyProp).Should().BeTrue();
        replyProp.GetString().Should().NotBeNullOrWhiteSpace();
    }
}
