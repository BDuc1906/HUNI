using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
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
    public async Task GET_ProductById_InvalidId_Returns404()
    {
        var response = await _client.GetAsync("/api/products/khong-ton-tai-12345");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task POST_Products_WithoutAuth_Returns401()
    {
        var newProduct = new Product
        {
            Slug = "polo-unauth-test",
            Sku = "SKU-UNAUTH",
            Title = "Unauth Product",
            Description = "Desc with enough length",
            Category = "polo",
            Price = 200000,
            Images = ["/img.jpg"]
        };

        var response = await _client.PostAsJsonAsync("/api/products", newProduct);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task POST_Products_WithCustomerToken_Returns403()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/products");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Content = JsonContent.Create(new Product
        {
            Slug = "polo-cust-test",
            Sku = "SKU-CUST",
            Title = "Cust Product",
            Description = "Desc with enough length",
            Category = "polo",
            Price = 200000,
            Images = ["/img.jpg"]
        });

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
        request.Content = JsonContent.Create(new Product
        {
            Slug = $"polo-admin-test-{randomSuffix}",
            Sku = $"SKU-ADMIN-{randomSuffix}",
            Title = "Admin Created Polo",
            Description = "A brand new polo product created by admin",
            Category = "polo",
            Price = 250000,
            Images = ["/images/test.jpg"]
        });

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
