using FluentValidation;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Services;

public class AuthService(
    IAppDbContext db,
    IJwtService jwtService,
    ILoginAttemptTracker loginAttemptTracker,
    IValidator<RegisterRequest> registerValidator,
    IValidator<LoginRequest> loginValidator) : IAuthService
{
    public async Task<(bool Success, string? Error, RegisterUserDto? User, List<ValidationError>? ValidationErrors)> RegisterAsync(RegisterRequest request)
    {
        var validationResult = await registerValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))
                .ToList();
            return (false, "Dữ liệu không hợp lệ.", null, errors);
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existing = await db.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existing)
        {
            return (false, "Email này đã được đăng ký", null, null);
        }

        var normalizedPhone = PhoneNormalizer.NormalizePhone(request.Phone);
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 10);

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Phone = normalizedPhone,
            PasswordHash = passwordHash,
            Role = UserRole.CUSTOMER,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var userDto = new RegisterUserDto(user.Id, user.Email, user.FullName);
        return (true, null, userDto, null);
    }

    public async Task<(bool Success, string? Error, AuthResponse? Response, List<ValidationError>? ValidationErrors)> LoginAsync(
        LoginRequest request, string? clientIp = null)
    {
        var attemptKey = string.IsNullOrWhiteSpace(clientIp)
            ? request.Email.Trim().ToLowerInvariant()
            : $"{clientIp}:{request.Email.Trim().ToLowerInvariant()}";

        if (loginAttemptTracker.IsLockedOut(attemptKey))
        {
            return (false, "Tài khoản tạm thời bị khóa do nhiều lần đăng nhập không thành công. Vui lòng thử lại sau 15 phút.", null, null);
        }

        var validationResult = await loginValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))
                .ToList();
            return (false, "Dữ liệu không hợp lệ.", null, errors);
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            loginAttemptTracker.RecordFailedAttempt(attemptKey);
            return (false, "Email hoặc mật khẩu không đúng", null, null);
        }

        loginAttemptTracker.ResetAttempts(attemptKey);
        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var (token, expiresAt) = jwtService.GenerateToken(user);
        var userDto = new AuthUserDto(
            user.Id,
            user.Email,
            user.FullName,
            user.Role.ToString(),
            user.Avatar
        );

        return (true, null, new AuthResponse(token, expiresAt, userDto), null);
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
    }
}
