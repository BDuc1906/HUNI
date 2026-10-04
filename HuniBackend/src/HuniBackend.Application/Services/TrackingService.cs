using System.Text.Json;
using HuniBackend.Application.Common;
using HuniBackend.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Services;

public class TrackingService(IAppDbContext db) : ITrackingService
{
    public async Task<object?> TrackOrderAsync(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        var normalizedCode = code.Trim().ToUpperInvariant();

        // 1. Tìm theo OrderNumber (toUpperCase)
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == normalizedCode);

        // 2. Nếu không có -> tìm theo phone (normalize) -> đơn gần nhất
        if (order == null)
        {
            var normalizedPhone = PhoneNormalizer.NormalizePhone(code);
            if (!string.IsNullOrEmpty(normalizedPhone))
            {
                order = await db.Orders
                    .AsNoTracking()
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Where(o => o.Customer.Phone.Contains(normalizedPhone))
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();
            }
        }

        // 3. Trả null nếu không tìm thấy (KHÔNG phải 404)
        if (order == null)
        {
            return null;
        }

        return new
        {
            id = order.Id,
            orderNumber = order.OrderNumber,
            status = order.Status.ToString(),
            paymentMethod = order.PaymentMethod,
            subtotal = order.Subtotal,
            discount = order.Discount,
            total = order.Total,
            notes = order.Notes,
            createdAt = order.CreatedAt,
            updatedAt = order.UpdatedAt,
            customer = new
            {
                id = order.Customer.Id,
                fullName = order.Customer.FullName,
                phone = order.Customer.Phone,
                email = order.Customer.Email,
                company = order.Customer.Company,
                address = order.Customer.Address
            },
            items = order.Items.Select(i =>
            {
                object? parsedLogo = null;
                if (!string.IsNullOrWhiteSpace(i.CustomLogo))
                {
                    try { parsedLogo = JsonSerializer.Deserialize<object>(i.CustomLogo); } catch { }
                }

                return new
                {
                    id = i.Id,
                    productId = i.ProductId,
                    productName = i.ProductName,
                    quantity = i.Quantity,
                    unitPrice = i.UnitPrice,
                    color = i.Color,
                    size = i.Size,
                    customLogo = parsedLogo,
                    subtotal = i.Subtotal
                };
            }).ToList()
        };
    }
}
