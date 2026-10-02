using FluentAssertions;
using HuniBackend.Application.DTOs.Quotes;
using HuniBackend.Application.Validators;
using Xunit;

namespace HuniBackend.UnitTests.Validators;

public class CreateQuoteValidatorTests
{
    private readonly CreateQuoteValidator _sut = new();

    private CreateQuoteRequest CreateValidRequest() => new(
        FullName: "Le Van C",
        Phone: "0909123456",
        Email: "levanc@company.vn",
        Company: "Tech Corp",
        Category: "polo",
        Quantity: 20,
        EstimatedPrice: 5000000,
        Notes: "May in logo ngực trái"
    );

    [Fact]
    public void Validate_ValidRequest_Passes()
    {
        var req = CreateValidRequest();
        var result = _sut.Validate(req);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_QuantityBelow10_Fails()
    {
        var req = CreateValidRequest() with { Quantity = 5 };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Quantity));
    }

    [Fact]
    public void Validate_InvalidCategory_Fails()
    {
        var req = CreateValidRequest() with { Category = "invalid_category" };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Category));
    }

    [Fact]
    public void Validate_InvalidPhone_Fails()
    {
        var req = CreateValidRequest() with { Phone = "123" };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
    }
}
