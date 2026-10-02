using HuniBackend.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Common;

public static class OrderNumberGenerator
{
    public static async Task<string> GenerateOrderNumberAsync(IAppDbContext db)
    {
        var dateStr = DateTime.UtcNow.ToString("yyMMdd");
        var today = DateTime.UtcNow.Date;
        var count = await db.Orders.CountAsync(o => o.CreatedAt >= today) + 1;
        return $"HN-{dateStr}-{count:D4}";
    }
}
