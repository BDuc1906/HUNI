using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/dashboard")]
public class AdminDashboardController(IServiceScopeFactory scopeFactory) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetDashboardStats()
    {
        // Chạy SONG SONG (Task.WhenAll) 11 queries với scoped DbContext độc lập
        var tTotalOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking().CountAsync();
            }
            catch { return 0; }
        });

        var tTotalRevenue = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking()
                    .Where(o => o.Status != OrderStatus.CANCELLED)
                    .SumAsync(o => (long)o.Total);
            }
            catch { return 0L; }
        });

        var tTotalQuotes = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Quotes.AsNoTracking().CountAsync();
            }
            catch { return 0; }
        });

        var tTotalCustomers = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Customers.AsNoTracking().CountAsync();
            }
            catch { return 0; }
        });

        var tPendingOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking().CountAsync(o => o.Status == OrderStatus.PENDING);
            }
            catch { return 0; }
        });

        var tProducingOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking().CountAsync(o => o.Status == OrderStatus.PRODUCING);
            }
            catch { return 0; }
        });

        var tCompletedOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking().CountAsync(o => o.Status == OrderStatus.COMPLETED);
            }
            catch { return 0; }
        });

        var tCancelledOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Orders.AsNoTracking().CountAsync(o => o.Status == OrderStatus.CANCELLED);
            }
            catch { return 0; }
        });

        var tNewQuotes = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return await db.Quotes.AsNoTracking().CountAsync(q => q.Status == QuoteStatus.NEW);
            }
            catch { return 0; }
        });

        var tRecentOrders = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return (object)await db.Orders
                    .AsNoTracking()
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(5)
                    .Select(o => new
                    {
                        id = o.Id,
                        orderNumber = o.OrderNumber,
                        status = o.Status.ToString(),
                        total = o.Total,
                        createdAt = o.CreatedAt,
                        customer = new
                        {
                            fullName = o.Customer.FullName,
                            phone = o.Customer.Phone
                        },
                        items = o.Items.Select(i => new
                        {
                            productName = i.ProductName,
                            quantity = i.Quantity,
                            unitPrice = i.UnitPrice
                        })
                    })
                    .ToListAsync();
            }
            catch { return Array.Empty<object>(); }
        });

        var tRecentQuotes = Task.Run(async () =>
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return (object)await db.Quotes
                    .AsNoTracking()
                    .Include(q => q.Customer)
                    .OrderByDescending(q => q.CreatedAt)
                    .Take(5)
                    .Select(q => new
                    {
                        id = q.Id,
                        fullName = q.FullName,
                        company = q.Company,
                        category = q.Category,
                        quantity = q.Quantity,
                        status = q.Status.ToString(),
                        createdAt = q.CreatedAt
                    })
                    .ToListAsync();
            }
            catch { return Array.Empty<object>(); }
        });

        await Task.WhenAll(
            tTotalOrders, tTotalRevenue, tTotalQuotes, tTotalCustomers,
            tPendingOrders, tProducingOrders, tCompletedOrders, tCancelledOrders,
            tNewQuotes, tRecentOrders, tRecentQuotes
        );

        return ApiOk(new
        {
            stats = new
            {
                totalOrders = await tTotalOrders,
                totalRevenue = await tTotalRevenue,
                totalQuotes = await tTotalQuotes,
                totalCustomers = await tTotalCustomers
            },
            statusCounts = new
            {
                orders = new
                {
                    pending = await tPendingOrders,
                    producing = await tProducingOrders,
                    completed = await tCompletedOrders,
                    cancelled = await tCancelledOrders
                },
                quotes = new
                {
                    @new = await tNewQuotes
                }
            },
            recentOrders = await tRecentOrders,
            recentQuotes = await tRecentQuotes
        });
    }
}
