using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HuniBackend.Infrastructure.Services;

public class JwtService(IConfiguration config) : IJwtService
{
    public (string Token, DateTime ExpiresAt) GenerateToken(User user)
    {
        var jwtSection = config.GetSection("Jwt");
        var secretKey = jwtSection["SecretKey"] ?? "huni-backend-super-secret-key-256bit-minimum-here!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var claims = new[]
        {
            new Claim("id", user.Id),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("email", user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim("name", user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim("avatar", user.Avatar ?? "")
        };

        var expiresInDays = int.TryParse(jwtSection["ExpiresInDays"], out var d) ? d : 30;
        var expiresAt = DateTime.UtcNow.AddDays(expiresInDays);

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"] ?? "HuniBackend",
            audience: jwtSection["Audience"] ?? "HuniClient",
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return (tokenString, expiresAt);
    }
}
