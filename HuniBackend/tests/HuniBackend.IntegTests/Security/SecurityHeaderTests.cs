using System.Net.Http.Headers;
using FluentAssertions;
using Xunit;

namespace HuniBackend.IntegTests.Security;

public class SecurityHeaderTests : IClassFixture<HuniWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly HuniWebAppFactory _factory;

    public SecurityHeaderTests(HuniWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Response_HasXContentTypeOptionsHeader()
    {
        var response = await _client.GetAsync("/health");
        response.Headers.TryGetValues("X-Content-Type-Options", out var values).Should().BeTrue();
        values!.First().Should().Be("nosniff");
    }

    [Fact]
    public async Task Response_HasXFrameOptionsHeader()
    {
        var response = await _client.GetAsync("/health");
        response.Headers.TryGetValues("X-Frame-Options", out var values).Should().BeTrue();
        values!.First().Should().Be("DENY");
    }

    [Fact]
    public async Task Response_HasStrictTransportSecurityHeader()
    {
        var response = await _client.GetAsync("/health");
        response.Headers.TryGetValues("Strict-Transport-Security", out var values).Should().BeTrue();
        values!.First().Should().Contain("max-age=");
    }

    [Fact]
    public async Task Response_DoesNotExposeServerHeader()
    {
        var response = await _client.GetAsync("/health");
        response.Headers.Contains("Server").Should().BeFalse();
    }

    [Fact]
    public async Task Response_DoesNotExposePasswordHash()
    {
        var token = await _factory.GetTokenAsync("customer@test.com", "Customer123!");
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        body.Should().NotContain("passwordHash");
        body.Should().NotContain("PasswordHash");
    }
}
