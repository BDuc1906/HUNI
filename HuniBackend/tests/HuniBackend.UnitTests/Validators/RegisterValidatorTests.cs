using FluentAssertions;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Application.Validators;
using Xunit;

namespace HuniBackend.UnitTests.Validators;

public class RegisterValidatorTests
{
    private readonly RegisterValidator _sut = new();

    private RegisterRequest CreateValidRequest() => new(
        FullName: "Nguyen Van A",
        Email: "nguyenvana@gmail.com",
        Phone: "0987654321",
        Password: "Password123!"
    );

    [Fact]
    public void Validate_ValidRequest_PassesValidation()
    {
        var req = CreateValidRequest();
        var result = _sut.Validate(req);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("A")]
    public void Validate_EmptyOrShortFullName_Fails(string name)
    {
        var req = CreateValidRequest() with { FullName = name };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.FullName));
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("@nodomain.com")]
    public void Validate_InvalidEmail_Fails(string email)
    {
        var req = CreateValidRequest() with { Email = email };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Email));
    }

    [Fact]
    public void Validate_ShortPhone_Fails()
    {
        var req = CreateValidRequest() with { Phone = "09876543" }; // 8 digits
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Phone));
    }

    [Fact]
    public void Validate_LongPhone_Fails()
    {
        var req = CreateValidRequest() with { Phone = "0987654321098" }; // 13 digits
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Phone));
    }

    [Theory]
    [InlineData("")]
    [InlineData("12345")]
    public void Validate_ShortPassword_Fails(string pwd)
    {
        var req = CreateValidRequest() with { Password = pwd };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(req.Password));
    }

    [Fact]
    public void Validate_ValidPhone_NormalizedBeforeCheck()
    {
        // "098 765 4321" contains spaces but is a valid 10-digit number
        var req = CreateValidRequest() with { Phone = "098 765 4321" };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeTrue();
    }
}
