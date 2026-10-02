using System.Net;
using System.Net.Http.Headers;
using FluentAssertions;
using Xunit;

namespace HuniBackend.IntegTests.Admin;

public class AdminDashboardTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public AdminDashboardTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GET_Admin_Dashboard_WithAdminToken_Returns200()
    {
        var token = await _factory.GetTokenAsync("admin@test.com", "Admin123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/admin/dashboard");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"totalOrders\":");
        json.Should().Contain("\"totalRevenue\":");
    }

    [Fact]
    public async Task GET_Admin_Dashboard_WithoutAuth_Returns401()
    {
        var response = await _client.GetAsync("/api/admin/dashboard");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Admin_Dashboard_WithCustomerToken_Returns403()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/admin/dashboard");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
