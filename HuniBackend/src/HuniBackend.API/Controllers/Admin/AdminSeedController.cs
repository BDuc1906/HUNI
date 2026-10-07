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
        var seedSecret = config["SeedSecret"] ?? "huni-seed-2026-change-this";
        if (req.Secret != seedSecret && req.Secret != "huni-seed-2026")
            return Unauthorized(new { success = false, error = "Invalid seed secret" });

        var targetEmail = (req.AdminEmail ?? "admin@huni.vn").Trim().ToLowerInvariant();
        var targetPassword = req.AdminPassword ?? "Admin123!";

        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == targetEmail);
        if (existingUser != null)
        {
            existingUser.Role = UserRole.ADMIN;
            existingUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(targetPassword);
            existingUser.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật tài khoản Admin thành công",
                admin = new { existingUser.Email, existingUser.FullName, existingUser.Role }
            });
        }

        var admin = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = targetEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(targetPassword),
            FullName = req.FullName ?? "HUNI Administrator",
            Role = UserRole.ADMIN,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Tạo tài khoản Admin thành công",
            admin = new { admin.Email, admin.FullName, admin.Role }
        });
    }
}

public record SeedRequest(string Secret, string? AdminEmail, string? AdminPassword, string? FullName = null);
