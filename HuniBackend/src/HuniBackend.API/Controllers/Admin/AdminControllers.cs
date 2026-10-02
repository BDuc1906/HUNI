using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

// ─── 16. Admin Dashboard ─────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/dashboard")]
public class AdminDashboardController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalOrders = await db.Orders.CountAsync();
        var pendingOrders = await db.Orders.CountAsync(o => o.Status == OrderStatus.PENDING);
        var producingOrders = await db.Orders.CountAsync(o => o.Status == OrderStatus.PRODUCING);
        var completedOrders = await db.Orders.CountAsync(o => o.Status == OrderStatus.COMPLETED);
        var cancelledOrders = await db.Orders.CountAsync(o => o.Status == OrderStatus.CANCELLED);

        var totalRevenue = await db.Orders
            .Where(o => o.Status != OrderStatus.CANCELLED)
            .SumAsync(o => (long)o.Total);

        var totalQuotes = await db.Quotes.CountAsync();
        var newQuotes = await db.Quotes.CountAsync(q => q.Status == QuoteStatus.NEW);
        var totalCustomers = await db.Customers.CountAsync();

        var recentOrders = await db.Orders
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

        var recentQuotes = await db.Quotes
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

        return ApiOk(new
        {
            stats = new
            {
                totalOrders,
                totalRevenue,
                totalQuotes,
                totalCustomers
            },
            statusCounts = new
            {
                orders = new
                {
                    pending = pendingOrders,
                    producing = producingOrders,
                    completed = completedOrders,
                    cancelled = cancelledOrders
                },
                quotes = new
                {
                    @new = newQuotes
                }
            },
            recentOrders,
            recentQuotes
        });
    }
}

// ─── 9. Admin Orders ─────────────────────────────────────────────────────────────────
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

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var st))
        {
            query = query.Where(o => o.Status == st);
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

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
        {
            order.Status = newStatus;
        }

        if (request.Notes != null)
        {
            order.Notes = request.Notes;
        }

        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(order, "Cập nhật trạng thái đơn hàng thành công");
    }
}

// ─── 10. Admin Quotes ────────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/quotes")]
public class AdminQuotesController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetQuotes(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Quotes.AsNoTracking().Include(q => q.Customer).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<QuoteStatus>(status, true, out var st))
        {
            query = query.Where(q => q.Status == st);
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(q => q.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(q => q.FullName.ToLower().Contains(s) ||
                                     q.Phone.Contains(s) ||
                                     (q.Email != null && q.Email.ToLower().Contains(s)) ||
                                     (q.Company != null && q.Company.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var quotes = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        return ApiOk(new
        {
            quotes,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit)
        });
    }

    public record AdminUpdateQuoteRequest(string? Status, int? EstimatedPrice, string? Notes);

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateQuote(string id, [FromBody] AdminUpdateQuoteRequest request)
    {
        var quote = await db.Quotes.Include(q => q.Customer).FirstOrDefaultAsync(q => q.Id == id);
        if (quote == null)
        {
            return ApiNotFound("Không tìm thấy yêu cầu báo giá");
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<QuoteStatus>(request.Status, true, out var st))
        {
            quote.Status = st;
        }

        if (request.EstimatedPrice.HasValue)
        {
            quote.EstimatedPrice = request.EstimatedPrice.Value;
        }

        if (request.Notes != null)
        {
            quote.Notes = request.Notes;
        }

        quote.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(quote, "Cập nhật trạng thái báo giá thành công");
    }
}

// ─── 12. Admin Customers ─────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/customers")]
public class AdminCustomersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetCustomers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Customers.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(c => c.FullName.ToLower().Contains(s) ||
                                     c.Phone.Contains(s) ||
                                     (c.Email != null && c.Email.ToLower().Contains(s)) ||
                                     (c.Company != null && c.Company.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var customers = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .Select(c => new
            {
                c.Id,
                c.FullName,
                c.Phone,
                c.Email,
                c.Company,
                c.Address,
                c.TaxCode,
                c.Notes,
                orderCount = c.Orders.Count,
                quoteCount = c.Quotes.Count,
                c.CreatedAt,
                c.UpdatedAt
            })
            .ToListAsync();

        return ApiOk(new
        {
            customers,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit)
        });
    }
}

// ─── 13. Admin Vouchers ──────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/vouchers")]
public class AdminVouchersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetVouchers()
    {
        var vouchers = await db.Vouchers.AsNoTracking().OrderByDescending(v => v.CreatedAt).ToListAsync();
        return ApiOk(new
        {
            vouchers,
            total = vouchers.Count
        });
    }

    public record CreateVoucherRequest(
        string Code,
        string Type,
        int Discount,
        int MinOrder = 0,
        int? MaxDiscount = null,
        int? UsageLimit = null,
        DateTime? ExpiresAt = null,
        bool Active = true
    );

    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code) || request.Code.Trim().Length < 2)
        {
            return ApiBadRequest("Mã voucher phải từ 2 ký tự trở lên.");
        }

        var codeUpper = request.Code.Trim().ToUpperInvariant();
        var exists = await db.Vouchers.AnyAsync(v => v.Code == codeUpper);
        if (exists)
        {
            return ApiConflict($"Mã voucher \"{codeUpper}\" đã tồn tại trên hệ thống.");
        }

        if (request.Discount < 1)
        {
            return ApiBadRequest("Mức giảm giá phải lớn hơn hoặc bằng 1.");
        }

        var voucher = new Voucher
        {
            Code = codeUpper,
            Type = request.Type?.ToLower() == "fixed" ? "fixed" : "percentage",
            Discount = request.Discount,
            MinOrder = Math.Max(0, request.MinOrder),
            MaxDiscount = request.MaxDiscount,
            UsageLimit = request.UsageLimit,
            ExpiresAt = request.ExpiresAt,
            Active = request.Active,
            UsedCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync();

        return ApiCreated(voucher, "Tạo voucher thành công");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVoucher(string id)
    {
        var voucher = await db.Vouchers.FirstOrDefaultAsync(v => v.Id == id || v.Code.ToUpper() == id.ToUpper());
        if (voucher == null) return ApiNotFound("Không tìm thấy voucher");

        db.Vouchers.Remove(voucher);
        await db.SaveChangesAsync();
        return ApiOk(new { id }, "Đã xoá voucher thành công");
    }
}

// ─── 14. Admin Reviews ───────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/reviews")]
public class AdminReviewsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReviews(
        [FromQuery] string? search,
        [FromQuery] string? rating,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Reviews.Include(r => r.Product).Include(r => r.User).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all" && Enum.TryParse<ReviewStatus>(status, true, out var st))
        {
            query = query.Where(r => r.Status == st);
        }

        if (!string.IsNullOrWhiteSpace(rating) && rating.ToLower() != "all" && short.TryParse(rating, out var rate))
        {
            query = query.Where(r => r.Rating == rate);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.CustomerName.ToLower().Contains(s) ||
                                     (r.CustomerEmail != null && r.CustomerEmail.ToLower().Contains(s)) ||
                                     (r.CustomerPhone != null && r.CustomerPhone.Contains(s)) ||
                                     r.Content.ToLower().Contains(s) ||
                                     (r.Product != null && r.Product.Title.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var reviewsList = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        var allReviewsCount = await db.Reviews.CountAsync();
        var pendingCount = await db.Reviews.CountAsync(r => r.Status == ReviewStatus.PENDING);
        var fiveStarCount = await db.Reviews.CountAsync(r => r.Rating == 5);
        var avgRatingVal = allReviewsCount > 0 ? (await db.Reviews.AverageAsync(r => (double)r.Rating)) : 5.0;

        var mapped = reviewsList.Select(r => new
        {
            id = r.Id,
            customerName = r.CustomerName,
            customerEmail = r.CustomerEmail,
            customerPhone = r.CustomerPhone,
            avatar = r.User?.Avatar,
            productId = r.ProductId,
            productTitle = r.Product?.Title ?? "",
            productSku = r.Product?.Sku ?? "",
            productImage = r.Product?.Images?.FirstOrDefault() ?? "",
            rating = r.Rating,
            content = r.Content,
            status = r.Status.ToString(),
            adminReply = r.AdminReply,
            repliedAt = r.RepliedAt,
            createdAt = r.CreatedAt
        });

        return ApiOk(new
        {
            reviews = mapped,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit),
            stats = new
            {
                totalReviews = allReviewsCount,
                avgRating = Math.Round(avgRatingVal, 1).ToString("0.0"),
                pendingCount,
                fiveStarPercent = allReviewsCount > 0 ? (int)Math.Round((double)fiveStarCount / allReviewsCount * 100) : 0
            }
        });
    }

    public record AdminUpdateReviewRequest(string? Id, string? Status, string? AdminReply);

    [HttpPatch]
    public async Task<IActionResult> UpdateReview([FromBody] AdminUpdateReviewRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ApiBadRequest("Thiếu ID đánh giá");
        }

        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == request.Id);
        if (review == null)
        {
            return ApiNotFound("Không tìm thấy đánh giá");
        }

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

        return ApiOk(review, "Cập nhật đánh giá thành công");
    }

    public record AdminDeleteReviewRequest(string? Id, List<string>? Ids);

    [HttpDelete]
    public async Task<IActionResult> DeleteReviews([FromBody] AdminDeleteReviewRequest request)
    {
        var targetIds = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.Id)) targetIds.Add(request.Id);
        if (request.Ids != null) targetIds.AddRange(request.Ids);

        if (targetIds.Count == 0)
        {
            return ApiBadRequest("Không có danh sách ID cần xoá");
        }

        var toDelete = await db.Reviews.Where(r => targetIds.Contains(r.Id)).ToListAsync();
        db.Reviews.RemoveRange(toDelete);
        await db.SaveChangesAsync();

        return ApiOk(new
        {
            deletedCount = toDelete.Count
        }, $"Đã xoá {toDelete.Count} đánh giá thành công");
    }
}

// ─── 15. Admin Returns ───────────────────────────────────────────────────────────────
[Authorize(Roles = "ADMIN")]
[Route("api/admin/returns")]
public class AdminReturnsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReturns(
        [FromQuery] string? search,
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.ReturnRequests.Include(r => r.Product).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all" && Enum.TryParse<ReturnStatus>(status, true, out var st))
        {
            query = query.Where(r => r.Status == st);
        }

        if (!string.IsNullOrWhiteSpace(type) && type.ToLower() != "all" && Enum.TryParse<ReturnType>(type, true, out var tp))
        {
            query = query.Where(r => r.Type == tp);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.Id.ToLower().Contains(s) ||
                                     r.OrderNumber.ToLower().Contains(s) ||
                                     r.CustomerName.ToLower().Contains(s) ||
                                     r.CustomerPhone.Contains(s) ||
                                     (r.CustomerEmail != null && r.CustomerEmail.ToLower().Contains(s)) ||
                                     (r.Company != null && r.Company.ToLower().Contains(s)) ||
                                     r.Reason.ToLower().Contains(s) ||
                                     r.ProductTitle.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var returnsList = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        var totalRequests = await db.ReturnRequests.CountAsync();
        var pendingCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.PENDING);
        var processingCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.PROCESSING);
        var completedCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.EXCHANGED || r.Status == ReturnStatus.REFUNDED);
        var totalRefunded = await db.ReturnRequests.Where(r => r.Status == ReturnStatus.REFUNDED).SumAsync(r => (long)r.RefundAmount);

        return ApiOk(new
        {
            returns = returnsList,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit),
            stats = new
            {
                totalRequests,
                pendingCount,
                processingCount,
                completedCount,
                totalRefunded
            }
        });
    }

    public record AdminUpdateReturnRequest(string? Id, string? Status, string? AdminNotes, int? RefundAmount);

    [HttpPatch]
    public async Task<IActionResult> UpdateReturn([FromBody] AdminUpdateReturnRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ApiBadRequest("Thiếu mã yêu cầu đổi trả");
        }

        var ret = await db.ReturnRequests.FirstOrDefaultAsync(r => r.Id == request.Id);
        if (ret == null)
        {
            return ApiNotFound("Không tìm thấy yêu cầu đổi trả");
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ReturnStatus>(request.Status, true, out var st))
        {
            ret.Status = st;
        }

        if (request.AdminNotes != null)
        {
            ret.AdminNotes = request.AdminNotes;
        }

        if (request.RefundAmount.HasValue)
        {
            ret.RefundAmount = request.RefundAmount.Value;
        }

        ret.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(ret, "Cập nhật yêu cầu đổi trả thành công");
    }

    public record AdminDeleteReturnRequest(string? Id, List<string>? Ids);

    [HttpDelete]
    public async Task<IActionResult> DeleteReturns([FromBody] AdminDeleteReturnRequest request)
    {
        var targetIds = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.Id)) targetIds.Add(request.Id);
        if (request.Ids != null) targetIds.AddRange(request.Ids);

        if (targetIds.Count == 0)
        {
            return ApiBadRequest("Không có danh sách ID cần xoá");
        }

        var toDelete = await db.ReturnRequests.Where(r => targetIds.Contains(r.Id)).ToListAsync();
        db.ReturnRequests.RemoveRange(toDelete);
        await db.SaveChangesAsync();

        return ApiOk(new
        {
            deletedCount = toDelete.Count
        }, $"Đã xoá {toDelete.Count} yêu cầu đổi trả thành công");
    }
}
