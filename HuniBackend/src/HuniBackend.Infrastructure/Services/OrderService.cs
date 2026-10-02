using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Services;

public class OrderService(AppDbContext db) : IOrderService
{
    public async Task<(bool Success, string? Error, Order? Order)> CreateOrderAsync(object request, string? clientIp = null)
    {
        // Phục vụ cấu trúc cơ bản
        return (false, "Not implemented yet", null);
    }

    public async Task<Order?> GetOrderByNumberAsync(string orderNumber, string? phone = null)
    {
        var query = db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Where(o => o.OrderNumber == orderNumber);

        if (!string.IsNullOrWhiteSpace(phone))
        {
            query = query.Where(o => o.Customer.Phone.Contains(phone.Trim()));
        }

        return await query.FirstOrDefaultAsync();
    }

    public async Task<List<Order>> GetOrdersAsync(int page = 1, int limit = 10, string? status = null, string? search = null)
    {
        var query = db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(s) || o.Customer.FullName.ToLower().Contains(s) || o.Customer.Phone.Contains(s));
        }

        return await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();
    }
}
