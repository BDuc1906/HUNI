using FluentAssertions;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Application.Interfaces;
using HuniBackend.Application.Services;
using HuniBackend.Application.Validators;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace HuniBackend.UnitTests.Services;

public class AuthServiceTests : TestBase
{
    private readonly Mock<IJwtService> _jwtServiceMock = new();
    private readonly ILoginAttemptTracker _loginTracker = new LoginAttemptTracker();
    private readonly RegisterValidator _registerValidator = new();
    private readonly LoginValidator _loginValidator = new();

    public AuthServiceTests()
    {
        _jwtServiceMock
            .Setup(j => j.GenerateToken(It.IsAny<User>()))
            .Returns(("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy.token", DateTime.UtcNow.AddDays(7)));
    }

    [Fact]
    public async Task RegisterAsync_NewUser_CreatesUserWithHashedPassword()
    {
        using var db = CreateInMemoryDb();
        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new RegisterRequest(
            FullName: "Test User",
            Email: "newuser@huni.vn",
            Phone: "0912345678",
            Password: "Password123!"
        );

        var (success, error, userDto, validationErrors) = await sut.RegisterAsync(req);

        success.Should().BeTrue();
        error.Should().BeNull();
        userDto.Should().NotBeNull();
        userDto!.Email.Should().Be("newuser@huni.vn");

        var userInDb = await db.Users.FirstOrDefaultAsync(u => u.Email == "newuser@huni.vn");
        userInDb.Should().NotBeNull();
        userInDb!.PasswordHash.Should().NotBe("Password123!");
        BCrypt.Net.BCrypt.Verify("Password123!", userInDb.PasswordHash).Should().BeTrue();
        userInDb.Role.Should().Be(UserRole.CUSTOMER);
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ReturnsConflict()
    {
        using var db = CreateInMemoryDb();
        db.Users.Add(new User
        {
            FullName = "Existing User",
            Email = "duplicate@huni.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"),
            Role = UserRole.CUSTOMER
        });
        await db.SaveChangesAsync();

        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new RegisterRequest(
            FullName: "Another User",
            Email: "duplicate@huni.vn",
            Phone: "0987654321",
            Password: "Password456!"
        );

        var (success, error, _, _) = await sut.RegisterAsync(req);

        success.Should().BeFalse();
        error.Should().Contain("Email này đã được đăng ký");
    }

    [Fact]
    public async Task LoginAsync_CorrectCredentials_ReturnsToken()
    {
        using var db = CreateInMemoryDb();
        db.Users.Add(new User
        {
            FullName = "Login User",
            Email = "login@huni.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!"),
            Role = UserRole.CUSTOMER
        });
        await db.SaveChangesAsync();

        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new LoginRequest("login@huni.vn", "CorrectPassword123!");
        var (success, error, res, _) = await sut.LoginAsync(req);

        success.Should().BeTrue();
        error.Should().BeNull();
        res.Should().NotBeNull();
        res!.Token.Should().StartWith("eyJ");
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ReturnsUnauthorized()
    {
        using var db = CreateInMemoryDb();
        db.Users.Add(new User
        {
            FullName = "Login User",
            Email = "wrongpass@huni.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!"),
            Role = UserRole.CUSTOMER
        });
        await db.SaveChangesAsync();

        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new LoginRequest("wrongpass@huni.vn", "IncorrectPass!");
        var (success, error, res, _) = await sut.LoginAsync(req);

        success.Should().BeFalse();
        error.Should().Be("Email hoặc mật khẩu không đúng");
        res.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ReturnsUnauthorized()
    {
        using var db = CreateInMemoryDb();
        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new LoginRequest("nonexistent@huni.vn", "SomePassword!");
        var (success, error, res, _) = await sut.LoginAsync(req);

        success.Should().BeFalse();
        error.Should().Be("Email hoặc mật khẩu không đúng");
        res.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_UpdatesLastLoginAt()
    {
        using var db = CreateInMemoryDb();
        var user = new User
        {
            FullName = "Login User",
            Email = "lastlogin@huni.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            Role = UserRole.CUSTOMER,
            LastLoginAt = null
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var sut = new AuthService(db, _jwtServiceMock.Object, _loginTracker, _registerValidator, _loginValidator);

        var req = new LoginRequest("lastlogin@huni.vn", "Password123!");
        var (success, _, _, _) = await sut.LoginAsync(req);

        success.Should().BeTrue();
        var updatedUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "lastlogin@huni.vn");
        updatedUser!.LastLoginAt.Should().NotBeNull();
    }
}
