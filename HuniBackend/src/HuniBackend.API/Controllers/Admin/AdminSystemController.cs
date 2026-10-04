using System.Diagnostics;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin")]
public class AdminSystemController(IAppDbContext db) : BaseApiController
{
    [HttpGet("system/status")]
    public async Task<IActionResult> GetSystemStatus()
    {
        var process = Process.GetCurrentProcess();
        var uptime = DateTime.UtcNow - process.StartTime.ToUniversalTime();

        var totalCustomers = await db.Customers.AsNoTracking().CountAsync();
        var totalOrders = await db.Orders.AsNoTracking().CountAsync();
        var totalRevenue = await db.Orders.AsNoTracking()
            .Where(o => o.Status != OrderStatus.CANCELLED)
            .SumAsync(o => (long?)o.Total) ?? 0;
        var totalProducts = await db.Products.AsNoTracking().CountAsync();
        var activeVouchers = await db.Vouchers.AsNoTracking().CountAsync(v => v.Active);

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var recentOrders = await db.Orders
            .AsNoTracking()
            .Where(o => o.CreatedAt >= thirtyDaysAgo)
            .GroupBy(o => o.Status)
            .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
            .ToListAsync();

        return ApiOk(new
        {
            server = new
            {
                uptime = uptime.ToString(@"dd\.hh\:mm\:ss"),
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                memoryUsageMB = Math.Round(process.WorkingSet64 / 1024.0 / 1024.0, 1),
                timestamp = DateTime.UtcNow
            },
            database = new
            {
                totalCustomers,
                totalOrders,
                totalRevenue,
                totalProducts,
                activeVouchers,
                status = "connected"
            },
            orders30Days = recentOrders
        });
    }

    [HttpGet("system/logs")]
    public IActionResult GetRecentLogs([FromQuery] int lines = 100)
    {
        var logDir = "logs";
        if (!Directory.Exists(logDir))
        {
            return ApiNotFound("Không có log directory");
        }

        var logFile = Directory.GetFiles(logDir, "huni-*.log")
            .OrderByDescending(f => f)
            .FirstOrDefault();

        if (logFile == null)
        {
            return ApiNotFound("Chưa có log file nào");
        }

        var recentLines = System.IO.File.ReadLines(logFile)
            .TakeLast(Math.Min(lines, 500))
            .ToList();

        return ApiOk(new
        {
            file = Path.GetFileName(logFile),
            lines = recentLines.Count,
            content = recentLines
        });
    }
}
