using BCrypt.Net;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[ApiController]
[Route("api/admin")]
public class AdminSeedController(AppDbContext db, IConfiguration config) : ControllerBase
{
    [HttpPost("seed-production")]
    public async Task<IActionResult> SeedProduction([FromBody] SeedRequest req)
    {
        // Kiểm tra secret key để tránh ai cũng gọi được
        var seedSecret = config["SeedSecret"] ?? "huni-seed-2026";
        if (req.Secret != seedSecret)
            return Unauthorized(new { success = false, error = "Invalid seed secret" });

        // Chỉ chạy khi chưa có admin
        var adminExists = await db.Users.AnyAsync(u => u.Role == UserRole.ADMIN);
        if (adminExists)
            return Conflict(new { success = false, error = "Admin already exists" });

        var admin = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = req.AdminEmail ?? "admin@huni.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.AdminPassword ?? "Admin123!"),
            FullName = "HUNI Administrator",
            Role = UserRole.ADMIN,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Admin created successfully. Delete or disable this endpoint now!",
            admin = new { admin.Email, admin.FullName, admin.Role }
        });
    }
}

public record SeedRequest(string Secret, string? AdminEmail, string? AdminPassword);
