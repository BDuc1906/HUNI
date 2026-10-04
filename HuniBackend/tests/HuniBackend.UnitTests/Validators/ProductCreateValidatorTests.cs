using FluentAssertions;
using HuniBackend.Application.DTOs.Products;
using HuniBackend.Application.Validators;
using Xunit;

namespace HuniBackend.UnitTests.Validators;

public class ProductCreateValidatorTests
{
    private readonly ProductCreateValidator _validator = new();

    private CreateProductRequest CreateValidRequest() => new(
        Slug: "ao-polo-doanh-nghiep",
        Sku: "HDC-POLO-001",
        Title: "Áo Polo Doanh Nghiệp HDC",
        Description: "Áo polo đồng phục doanh nghiệp chất lượng cao",
        Category: "polo",
        Price: 200000,
        Images: ["/images/polo-1.jpg"]
    );

    [Fact]
    public void Validate_ValidRequest_Passes()
    {
        var request = CreateValidRequest();
        var result = _validator.Validate(request);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("a")]
    public void Validate_SlugTooShort_Fails(string invalidSlug)
    {
        var request = CreateValidRequest() with { Slug = invalidSlug };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Slug));
    }

    [Theory]
    [InlineData("")]
    [InlineData("x")]
    public void Validate_SkuTooShort_Fails(string invalidSku)
    {
        var request = CreateValidRequest() with { Sku = invalidSku };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Sku));
    }

    [Theory]
    [InlineData("")]
    [InlineData("t")]
    public void Validate_TitleTooShort_Fails(string invalidTitle)
    {
        var request = CreateValidRequest() with { Title = invalidTitle };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Title));
    }

    [Theory]
    [InlineData("")]
    [InlineData("1234")]
    public void Validate_DescriptionTooShort_Fails(string invalidDesc)
    {
        var request = CreateValidRequest() with { Description = invalidDesc };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Description));
    }

    [Fact]
    public void Validate_CategoryEmpty_Fails()
    {
        var request = CreateValidRequest() with { Category = "" };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Category));
    }

    [Fact]
    public void Validate_PriceNegative_Fails()
    {
        var request = CreateValidRequest() with { Price = -1000 };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Price));
    }

    [Fact]
    public void Validate_ImagesEmpty_Fails()
    {
        var request = CreateValidRequest() with { Images = [] };
        var result = _validator.Validate(request);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(request.Images));
    }
}
