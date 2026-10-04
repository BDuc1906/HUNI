using System.Text;
using System.Text.Json;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin")]
public class AdminBackupController(IAppDbContext db) : BaseApiController
{
    [HttpPost("backup")]
    [HttpGet("backup")]
    public async Task<IActionResult> CreateBackup()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
        var filename = $"huni_backup_{timestamp}.json";

        var backup = new
        {
            timestamp = DateTime.UtcNow,
            version = "1.0",
            data = new
            {
                customers = await db.Customers.AsNoTracking().ToListAsync(),
                orders = await db.Orders.AsNoTracking().Include(o => o.Items).ToListAsync(),
                quotes = await db.Quotes.AsNoTracking().ToListAsync(),
                products = await db.Products.AsNoTracking().ToListAsync(),
                users = await db.Users.AsNoTracking()
                    .Select(u => new { u.Id, u.Email, u.FullName, u.Role, u.CreatedAt })
                    .ToListAsync(), // Không backup passwordHash vì lý do bảo mật
                vouchers = await db.Vouchers.AsNoTracking().ToListAsync(),
            }
        };

        var json = JsonSerializer.Serialize(backup, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        return File(
            Encoding.UTF8.GetBytes(json),
            "application/json",
            filename
        );
    }
}
