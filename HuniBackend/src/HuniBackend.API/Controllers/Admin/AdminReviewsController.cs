using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

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

        var query = db.Reviews
            .Include(r => r.Product)
            .Include(r => r.User)
            .AsNoTracking()
            .AsQueryable();

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

        var totalReviews = await db.Reviews.CountAsync();
        var pendingCount = await db.Reviews.CountAsync(r => r.Status == ReviewStatus.PENDING);
        var fiveStarCount = await db.Reviews.CountAsync(r => r.Rating == 5);
        var avgRatingVal = totalReviews > 0 ? await db.Reviews.AverageAsync(r => (double)r.Rating) : 5.0;

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
            totalPages = total > 0 ? (int)Math.Ceiling((double)total / safeLimit) : 0,
            stats = new
            {
                totalReviews,
                avgRating = Math.Round(avgRatingVal, 1).ToString("0.0"),
                pendingCount,
                fiveStarPercent = totalReviews > 0 ? (int)Math.Round((double)fiveStarCount / totalReviews * 100) : 0
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

        var toDeleteDb = await db.Reviews.Where(r => targetIds.Contains(r.Id)).ToListAsync();
        if (toDeleteDb.Count > 0)
        {
            db.Reviews.RemoveRange(toDeleteDb);
            await db.SaveChangesAsync();
        }

        return Ok(new
        {
            success = true,
            deletedCount = toDeleteDb.Count,
            data = new
            {
                deletedCount = toDeleteDb.Count
            },
            message = $"Đã xoá {toDeleteDb.Count} đánh giá thành công"
        });
    }
}
