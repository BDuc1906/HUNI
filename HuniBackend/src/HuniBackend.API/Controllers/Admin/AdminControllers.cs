using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/dashboard")]
public class AdminDashboardController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalOrders = await db.Orders.CountAsync();
        var pendingOrders = await db.Orders.CountAsync(o => o.Status == OrderStatus.PENDING);
        var totalRevenue = await db.Orders.Where(o => o.Status == OrderStatus.COMPLETED).SumAsync(o => o.Total);
        var totalCustomers = await db.Customers.CountAsync();
        var newQuotes = await db.Quotes.CountAsync(q => q.Status == QuoteStatus.NEW);

        return ApiOk(new
        {
            totalOrders,
            pendingOrders,
            totalRevenue,
            totalCustomers,
            newQuotes
        });
    }
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/orders")]
public class AdminOrdersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var query = db.Orders.Include(o => o.Customer).Include(o => o.Items).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var st))
        {
            query = query.Where(o => o.Status == st);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower().Trim();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(s) || o.Customer.FullName.ToLower().Contains(s) || o.Customer.Phone.Contains(s));
        }

        var total = await query.CountAsync();
        var orders = await query.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();

        return ApiOk(new { orders, total, page, limit, totalPages = (int)Math.Ceiling((double)total / limit) });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return ApiNotFound("Không tìm thấy đơn hàng.");

        if (Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
        {
            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return ApiOk(order, "Đã cập nhật trạng thái đơn hàng.");
        }

        return ApiBadRequest("Trạng thái không hợp lệ.");
    }

    public record UpdateStatusRequest(string Status);
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/quotes")]
public class AdminQuotesController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetQuotes(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? status = null)
    {
        var query = db.Quotes.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<QuoteStatus>(status, true, out var st))
        {
            query = query.Where(q => q.Status == st);
        }

        var total = await query.CountAsync();
        var quotes = await query.OrderByDescending(q => q.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return ApiOk(new { quotes, total, page, limit, totalPages = (int)Math.Ceiling((double)total / limit) });
    }
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/customers")]
public class AdminCustomersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var total = await db.Customers.CountAsync();
        var customers = await db.Customers.AsNoTracking().OrderByDescending(c => c.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return ApiOk(new { customers, total, page, limit, totalPages = (int)Math.Ceiling((double)total / limit) });
    }
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/vouchers")]
public class AdminVouchersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetVouchers()
    {
        var vouchers = await db.Vouchers.AsNoTracking().OrderByDescending(v => v.CreatedAt).ToListAsync();
        return ApiOk(new { vouchers, total = vouchers.Count });
    }

    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromBody] Voucher voucher)
    {
        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync();
        return ApiCreated(voucher, "Đã tạo mã giảm giá mới.");
    }
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/reviews")]
public class AdminReviewsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? status = null)
    {
        var query = db.Reviews.Include(r => r.Product).AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ReviewStatus>(status, true, out var st))
        {
            query = query.Where(r => r.Status == st);
        }

        var total = await query.CountAsync();
        var reviews = await query.OrderByDescending(r => r.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return ApiOk(new { reviews, total, page, limit, totalPages = (int)Math.Ceiling((double)total / limit) });
    }

    public record ReplyReviewRequest(string? Status, string? AdminReply);

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateReview(string id, [FromBody] ReplyReviewRequest request)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == id);
        if (review == null) return ApiNotFound("Không tìm thấy đánh giá.");

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ReviewStatus>(request.Status, true, out var st))
        {
            review.Status = st;
        }

        if (request.AdminReply != null)
        {
            review.AdminReply = request.AdminReply;
            review.RepliedAt = DateTime.UtcNow;
        }

        review.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ApiOk(review, "Đã cập nhật đánh giá.");
    }
}

[Authorize(Roles = "ADMIN")]
[Route("api/admin/returns")]
public class AdminReturnsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReturns([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? status = null)
    {
        var query = db.ReturnRequests.Include(r => r.Product).AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ReturnStatus>(status, true, out var st))
        {
            query = query.Where(r => r.Status == st);
        }

        var total = await query.CountAsync();
        var returns = await query.OrderByDescending(r => r.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return ApiOk(new { returns, total, page, limit, totalPages = (int)Math.Ceiling((double)total / limit) });
    }
}
