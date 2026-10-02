using System.Text.Json;
using HuniBackend.Application.Common;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers;

[Route("api/tracking")]
public class TrackingController(IAppDbContext db) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> TrackOrder([FromQuery] string? code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return BadRequest(new
            {
                success = false,
                error = "Thiếu mã đơn hàng"
            });
        }

        var normalizedCode = code.Trim().ToUpperInvariant();

        // 1. Tìm theo OrderNumber
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber.ToUpper() == normalizedCode);

        // 2. Nếu không tìm thấy, tìm theo SĐT khách hàng
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

        if (order == null)
        {
            return Ok(new
            {
                success = true,
                order = (object?)null
            });
        }

        var mappedOrder = new
        {
            id = order.Id,
            orderNumber = order.OrderNumber,
            status = order.Status.ToString(),
            paymentMethod = order.PaymentMethod,
            subtotal = order.Subtotal,
            discount = order.Discount,
            total = order.Total,
            createdAt = order.CreatedAt,
            customer = new
            {
                fullName = order.Customer.FullName,
                phone = order.Customer.Phone
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

        return Ok(new
        {
            success = true,
            order = mappedOrder
        });
    }
}
