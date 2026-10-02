using HuniBackend.Domain.Common;
using HuniBackend.Domain.Enums;

namespace HuniBackend.Domain.Entities;

public class User
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Email { get; set; } = string.Empty;       // unique
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public UserRole Role { get; set; } = UserRole.CUSTOMER;
    public DateTime? LastLoginAt { get; set; }
    public List<Review> Reviews { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
