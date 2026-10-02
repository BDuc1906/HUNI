namespace HuniBackend.Application.DTOs.Auth;

public record RegisterRequest(
    string FullName,
    string Email,
    string? Phone,
    string Password
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthUserDto(
    string Id,
    string Email,
    string Name,
    string Role,
    string? Avatar
);

public record RegisterUserDto(
    string Id,
    string Email,
    string FullName
);

public record AuthResponse(
    string Token,
    DateTime ExpiresAt,
    AuthUserDto User
);
