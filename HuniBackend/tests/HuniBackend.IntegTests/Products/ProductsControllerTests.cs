using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using HuniBackend.Application.DTOs.Products;
using HuniBackend.Domain.Entities;
using Xunit;

namespace HuniBackend.IntegTests.Products;

public class ProductsControllerTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public ProductsControllerTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GET_Products_ReturnsListWithPagination()
    {
        var response = await _client.GetAsync("/api/products");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"products\":");
        json.Should().Contain("\"total\":");
    }

    [Fact]
    public async Task GET_Products_WithCategoryFilter_ReturnsFiltered()
    {
        var response = await _client.GetAsync("/api/products?category=polo");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("polo");
    }

    [Fact]
    public async Task GET_ProductById_ValidSlug_Returns200()
    {
        var response = await _client.GetAsync("/api/products/ao-polo-test");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("ao-polo-test");
    }

    [Fact]
    public async Task GET_ProductById_AoPoloHdc_Returns200()
    {
        var response = await _client.GetAsync("/api/products/ao-polo-hdc");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("ao-polo-hdc");
    }

    [Fact]
    public async Task GET_ProductById_InvalidId_Returns404()
    {
        var response = await _client.GetAsync("/api/products/khong-ton-tai-12345");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task POST_Products_WithoutAuth_Returns401()
    {
        var newProduct = new CreateProductRequest(
            Slug: "polo-unauth-test",
            Sku: "SKU-UNAUTH",
            Title: "Unauth Product",
            Description: "Desc with enough length",
            Category: "polo",
            Price: 200000,
            Images: ["/img.jpg"]
        );

        var response = await _client.PostAsJsonAsync("/api/products", newProduct);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task POST_Products_WithCustomerToken_Returns403()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/products");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Content = JsonContent.Create(new CreateProductRequest(
            Slug: "polo-cust-test",
            Sku: "SKU-CUST",
            Title: "Cust Product",
            Description: "Desc with enough length",
            Category: "polo",
            Price: 200000,
            Images: ["/img.jpg"]
        ));

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task POST_Products_WithAdminToken_Returns201()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/products");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomSuffix = Guid.NewGuid().ToString("N")[..6];
        request.Content = JsonContent.Create(new CreateProductRequest(
            Slug: $"polo-admin-test-{randomSuffix}",
            Sku: $"SKU-ADMIN-{randomSuffix}",
            Title: "Admin Created Polo",
            Description: "A brand new polo product created by admin",
            Category: "polo",
            Price: 250000,
            Images: ["/images/test.jpg"]
        ));

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task POST_Products_DuplicateSlug_Returns409()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/products");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(new CreateProductRequest(
            Slug: "ao-polo-test", // Trùng slug của prod-test-001
            Sku: $"SKU-DUP-{Guid.NewGuid():N}",
            Title: "Duplicate Slug Product",
            Description: "A duplicate slug product testing 409",
            Category: "polo",
            Price: 200000,
            Images: ["/images/test.jpg"]
        ));

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task PUT_Products_WithAdminToken_Returns200()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Put, "/api/products/prod-test-001");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(new UpdateProductRequest(
            Title: "Áo Polo Test Đã Cập Nhật",
            Price: 199000
        ));

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task DELETE_Products_WithAdminToken_Returns200()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");

        // Tạo trước 1 sản phẩm để xóa
        var randomSuffix = Guid.NewGuid().ToString("N")[..6];
        using var createReq = new HttpRequestMessage(HttpMethod.Post, "/api/products");
        createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        createReq.Content = JsonContent.Create(new CreateProductRequest(
            Slug: $"to-delete-{randomSuffix}",
            Sku: $"DEL-{randomSuffix}",
            Title: "Product To Delete",
            Description: "This product will be deleted",
            Category: "polo",
            Price: 100000,
            Images: ["/images/del.jpg"]
        ));
        var createRes = await _client.SendAsync(createReq);
        createRes.StatusCode.Should().Be(HttpStatusCode.Created);

        // Xóa sản phẩm vừa tạo
        using var deleteReq = new HttpRequestMessage(HttpMethod.Delete, $"/api/products/to-delete-{randomSuffix}");
        deleteReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var deleteRes = await _client.SendAsync(deleteReq);

        deleteRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
