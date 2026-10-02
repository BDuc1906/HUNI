using System.Security.Claims;

namespace HuniBackend.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
        => user.FindFirst("id")?.Value
           ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value
           ?? string.Empty;

    public static string GetRole(this ClaimsPrincipal user)
        => user.FindFirst("role")?.Value
           ?? user.FindFirst(ClaimTypes.Role)?.Value
           ?? "CUSTOMER";

    public static bool IsAdmin(this ClaimsPrincipal user)
        => user.GetRole().Equals("ADMIN", StringComparison.OrdinalIgnoreCase);
}
