using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string? Error, RegisterUserDto? User, List<ValidationError>? ValidationErrors)> RegisterAsync(RegisterRequest request);
    Task<(bool Success, string? Error, AuthResponse? Response, List<ValidationError>? ValidationErrors)> LoginAsync(LoginRequest request, string? clientIp = null);
    Task<User?> GetUserByIdAsync(string userId);
}
