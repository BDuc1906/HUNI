using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IJwtService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}
