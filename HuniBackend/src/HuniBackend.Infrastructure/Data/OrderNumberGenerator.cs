using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Data;

public static class OrderNumberGenerator
{
    public static async Task<string> GenerateOrderNumberAsync(AppDbContext db)
    {
        var dateStr = DateTime.Now.ToString("yyMMdd");
        var today = DateTime.UtcNow.Date;
        var count = await db.Orders.CountAsync(o => o.CreatedAt >= today) + 1;
        return $"HN-{dateStr}-{count:D4}";
    }
}
