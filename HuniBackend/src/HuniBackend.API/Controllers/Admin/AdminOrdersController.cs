using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/orders")]
public class AdminOrdersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            if (Enum.TryParse<OrderStatus>(status, true, out var st))
            {
                query = query.Where(o => o.Status == st);
            }
            else
            {
                return ApiBadRequest("Trạng thái đơn hàng không hợp lệ.");
            }
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(s) ||
                                     o.Customer.FullName.ToLower().Contains(s) ||
                                     o.Customer.Phone.Contains(s) ||
                                     (o.Customer.Email != null && o.Customer.Email.ToLower().Contains(s)) ||
                                     (o.Customer.Company != null && o.Customer.Company.ToLower().Contains(s)));
        }

        if (dateFrom.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query = query.Where(o => o.CreatedAt <= dateTo.Value);
        }

        var total = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .Select(o => new
            {
                id = o.Id,
                orderNumber = o.OrderNumber,
                status = o.Status.ToString(),
                paymentMethod = o.PaymentMethod,
                subtotal = o.Subtotal,
                discount = o.Discount,
                total = o.Total,
                notes = o.Notes,
                vatInfo = o.VatInfo,
                createdAt = o.CreatedAt,
                updatedAt = o.UpdatedAt,
                customer = new
                {
                    id = o.Customer.Id,
                    fullName = o.Customer.FullName,
                    phone = o.Customer.Phone,
                    email = o.Customer.Email,
                    company = o.Customer.Company,
                    address = o.Customer.Address
                },
                items = o.Items.Select(i => new
                {
                    id = i.Id,
                    productId = i.ProductId,
                    productName = i.ProductName,
                    quantity = i.Quantity,
                    unitPrice = i.UnitPrice,
                    color = i.Color,
                    size = i.Size,
                    customLogo = i.CustomLogo,
                    subtotal = i.Subtotal
                })
            })
            .ToListAsync();

        var pendingCount = await db.Orders.CountAsync(o => o.Status == OrderStatus.PENDING);
        var producingCount = await db.Orders.CountAsync(o => o.Status == OrderStatus.PRODUCING);
        var completedCount = await db.Orders.CountAsync(o => o.Status == OrderStatus.COMPLETED);
        var totalRevenue = await db.Orders.Where(o => o.Status != OrderStatus.CANCELLED).SumAsync(o => (long)o.Total);

        return ApiOk(new
        {
            orders,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit),
            summary = new
            {
                pending = pendingCount,
                producing = producingCount,
                completed = completedCount,
                totalRevenue
            }
        });
    }

    public record AdminUpdateOrderRequest(string? Status, string? Notes);

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateOrder(string id, [FromBody] AdminUpdateOrderRequest request)
    {
        var order = await db.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id || o.OrderNumber.ToLower() == id.ToLower());

        if (order == null)
        {
            return ApiNotFound("Không tìm thấy đơn hàng");
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
            {
                order.Status = newStatus;
            }
            else
            {
                return ApiBadRequest("Trạng thái đơn hàng không hợp lệ.");
            }
        }

        if (request.Notes != null)
        {
            if (request.Notes.Length > 500)
            {
                return ApiBadRequest("Ghi chú tối đa 500 ký tự.");
            }
            order.Notes = request.Notes;
        }

        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(order, "Cập nhật trạng thái đơn hàng thành công");
    }
}
