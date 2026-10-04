using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using HuniBackend.Infrastructure.InMemory;
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

        var dbCount = await db.Reviews.CountAsync();
        if (dbCount > 0)
        {
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

            var pendingCount = await db.Reviews.CountAsync(r => r.Status == ReviewStatus.PENDING);
            var fiveStarCount = await db.Reviews.CountAsync(r => r.Rating == 5);
            var avgRatingVal = await db.Reviews.AverageAsync(r => (double)r.Rating);

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
                    totalReviews = dbCount,
                    avgRating = Math.Round(avgRatingVal, 1).ToString("0.0"),
                    pendingCount,
                    fiveStarPercent = (int)Math.Round((double)fiveStarCount / dbCount * 100)
                }
            });
        }

        // Fallback to In-Memory store
        var memoryItems = AdminReviewStore.GetAll();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            memoryItems = memoryItems.Where(r => r.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(rating) && rating.ToLower() != "all" && short.TryParse(rating, out var memRate))
        {
            memoryItems = memoryItems.Where(r => r.Rating == memRate).ToList();
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            memoryItems = memoryItems.Where(r => r.CustomerName.ToLower().Contains(s) ||
                                                 (r.CustomerEmail != null && r.CustomerEmail.ToLower().Contains(s)) ||
                                                 (r.CustomerPhone != null && r.CustomerPhone.Contains(s)) ||
                                                 r.Content.ToLower().Contains(s) ||
                                                 r.ProductTitle.ToLower().Contains(s) ||
                                                 r.ProductSku.ToLower().Contains(s)).ToList();
        }

        var memTotal = memoryItems.Count;
        var paginatedMem = memoryItems
            .OrderByDescending(r => r.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToList();

        var allStoreItems = AdminReviewStore.GetAll();
        var allStoreCount = allStoreItems.Count;
        var memPending = allStoreItems.Count(r => r.Status.Equals("PENDING", StringComparison.OrdinalIgnoreCase));
        var memFiveStar = allStoreItems.Count(r => r.Rating == 5);
        var memAvg = allStoreCount > 0 ? allStoreItems.Average(r => (double)r.Rating) : 5.0;

        return ApiOk(new
        {
            reviews = paginatedMem,
            total = memTotal,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)memTotal / safeLimit),
            stats = new
            {
                totalReviews = allStoreCount,
                avgRating = Math.Round(memAvg, 1).ToString("0.0"),
                pendingCount = memPending,
                fiveStarPercent = allStoreCount > 0 ? (int)Math.Round((double)memFiveStar / allStoreCount * 100) : 0
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
        if (review != null)
        {
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

        // Try In-Memory Store
        var memUpdated = AdminReviewStore.Update(request.Id, request.Status, request.AdminReply);
        if (memUpdated != null)
        {
            return ApiOk(memUpdated, "Cập nhật đánh giá thành công");
        }

        return ApiNotFound("Không tìm thấy đánh giá");
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

        var deletedFromMemory = AdminReviewStore.Delete(targetIds);
        var totalDeleted = toDeleteDb.Count + deletedFromMemory;

        return Ok(new
        {
            success = true,
            deletedCount = totalDeleted,
            data = new
            {
                deletedCount = totalDeleted
            },
            message = $"Đã xoá {totalDeleted} đánh giá thành công"
        });
    }
}
