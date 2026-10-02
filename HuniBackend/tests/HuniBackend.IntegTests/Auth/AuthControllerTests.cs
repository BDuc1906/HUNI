using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using HuniBackend.Application.DTOs.Auth;
using Xunit;

namespace HuniBackend.IntegTests.Auth;

public class AuthControllerTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public AuthControllerTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task POST_Register_ValidData_Returns201()
    {
        var email = $"newreg_{Guid.NewGuid():N}@huni.vn";
        var req = new RegisterRequest("Test User", email, "0987654321", "ValidPassword123!");

        var response = await _client.PostAsJsonAsync("/api/auth/register", req);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"success\":true");
        json.Should().Contain(email);
        json.Should().NotContain("passwordHash");
    }

    [Fact]
    public async Task POST_Register_DuplicateEmail_Returns409()
    {
        var email = $"dup_{Guid.NewGuid():N}@huni.vn";
        var req = new RegisterRequest("Test User", email, "0987654321", "ValidPassword123!");

        var res1 = await _client.PostAsJsonAsync("/api/auth/register", req);
        res1.StatusCode.Should().Be(HttpStatusCode.Created);

        var res2 = await _client.PostAsJsonAsync("/api/auth/register", req);
        res2.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task POST_Register_InvalidPhone_Returns400()
    {
        var req = new RegisterRequest("Test User", "invalidphone@huni.vn", "123", "ValidPassword123!");

        var response = await _client.PostAsJsonAsync("/api/auth/register", req);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("details");
    }

    [Fact]
    public async Task POST_Login_ValidCredentials_Returns200WithToken()
    {
        var req = new LoginRequest("customer@test.com", "Customer123!");

        var response = await _client.PostAsJsonAsync("/api/auth/login", req);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("\"token\":\"eyJ");
    }

    [Fact]
    public async Task POST_Login_WrongPassword_Returns401()
    {
        var req = new LoginRequest("customer@test.com", "WrongPassword!");

        var response = await _client.PostAsJsonAsync("/api/auth/login", req);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GET_Me_WithValidToken_Returns200()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadAsStringAsync();
        json.Should().Contain("customer@test.com");
        json.Should().NotContain("passwordHash");
    }

    [Fact]
    public async Task GET_Me_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/api/auth/me");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
