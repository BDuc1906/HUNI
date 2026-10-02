using System.Text.Json;
using FluentAssertions;
using HuniBackend.Application.Services;
using HuniBackend.Domain.Entities;
using Xunit;

namespace HuniBackend.UnitTests.Services;

public class PricingServiceTests : TestBase
{
    private readonly PricingService _sut = new();

    private Product CreateProductWithTiers() => new()
    {
        Id = "test-prod-tiers",
        Title = "Áo Polo Tiers",
        Price = 150000,
        WholesaleTiers = JsonSerializer.Serialize(new[]
        {
            new { min = 5, max = (int?)99, price = 150000, label = "Lẻ" },
            new { min = 100, max = (int?)499, price = 130000, label = "Sỉ" },
            new { min = 500, max = (int?)null, price = 110000, label = "Đại lý" }
        })
    };

    [Fact]
    public void CalculateTierPrice_Quantity50_Returns150000()
    {
        var product = CreateProductWithTiers();
        var price = _sut.CalculateTierPrice(product, 50);
        price.Should().Be(150000);
    }

    [Fact]
    public void CalculateTierPrice_Quantity100_Returns130000()
    {
        var product = CreateProductWithTiers();
        var price = _sut.CalculateTierPrice(product, 100);
        price.Should().Be(130000);
    }

    [Fact]
    public void CalculateTierPrice_Quantity500_Returns110000()
    {
        var product = CreateProductWithTiers();
        var price = _sut.CalculateTierPrice(product, 500);
        price.Should().Be(110000);
    }

    [Fact]
    public void CalculateTierPrice_Quantity99_Returns150000()
    {
        var product = CreateProductWithTiers();
        var price = _sut.CalculateTierPrice(product, 99);
        price.Should().Be(150000);
    }

    [Fact]
    public void CalculateTierPrice_Quantity100_Returns130000_Boundary()
    {
        var product = CreateProductWithTiers();
        var price = _sut.CalculateTierPrice(product, 100);
        price.Should().Be(130000);
    }

    [Fact]
    public void CalculateTierPrice_NoTiers_ReturnsBasePrice()
    {
        var product = new Product { Price = 250000, WholesaleTiers = null };
        var price = _sut.CalculateTierPrice(product, 100);
        price.Should().Be(250000);
    }

    [Fact]
    public void CalculateTierPrice_WithLogo_AddsLogoFee()
    {
        var product = CreateProductWithTiers();
        var unitPrice = _sut.CalculateUnitPrice(product, 50, hasCustomLogo: true);
        unitPrice.Should().Be(150000 + PricingService.LogoFeePerItem);
    }

    [Fact]
    public void CalculateTierPrice_NoLogo_NoLogoFee()
    {
        var product = CreateProductWithTiers();
        var unitPrice = _sut.CalculateUnitPrice(product, 50, hasCustomLogo: false);
        unitPrice.Should().Be(150000);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void CalculateTierPrice_InvalidQuantity_ThrowsException(int qty)
    {
        var product = CreateProductWithTiers();
        var act = () => _sut.CalculateTierPrice(product, qty);
        act.Should().Throw<ArgumentException>();
    }
}
