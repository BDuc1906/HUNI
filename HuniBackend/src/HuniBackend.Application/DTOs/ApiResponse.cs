namespace HuniBackend.Application.DTOs;

public record ApiResponse<T>(
    bool Success,
    string? Message = null,
    T? Data = default,
    string? Error = null,
    List<ValidationError>? Details = null
);

public record ValidationError(string Field, string Message);
