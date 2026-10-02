using System.Security.Claims;
using HuniBackend.API.Extensions;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers;

[Route("api/reviews")]
public class ReviewsController(AppDbContext db) : BaseApiController
{
    public record CreateReviewRequest(string ProductId, short Rating, string Content);

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews([FromQuery] string? productId)
    {
        if (string.IsNullOrWhiteSpace(productId))
        {
            return ApiBadRequest("Thiếu thông tin productId");
        }

        var trimmedProductId = productId.Trim();

        // Tìm reviews được duyệt của product này
        var reviewsList = await db.Reviews
            .AsNoTracking()
            .Include(r => r.User)
            .Where(r => r.ProductId == trimmedProductId && r.Status == ReviewStatus.APPROVED)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var total = reviewsList.Count;
        var avgRating = total > 0 ? Math.Round(reviewsList.Average(r => (double)r.Rating), 1) : 5.0;

        var mappedReviews = reviewsList.Select(r => new
        {
            id = r.Id,
            rating = r.Rating,
            content = r.Content,
            createdAt = r.CreatedAt,
            user = new
            {
                fullName = r.User?.FullName ?? r.CustomerName,
                name = r.User?.FullName ?? r.CustomerName,
                avatar = r.User?.Avatar
            }
        }).ToList();

        // Kiểm tra quyền review của user hiện tại
        var isAuthenticated = User.Identity?.IsAuthenticated == true;
        var canReview = false;
        var hasOrdered = false;

        if (isAuthenticated)
        {
            var userRole = User.GetRole();
            var userId = User.GetUserId();

            if (userRole == "ADMIN")
            {
                canReview = true;
                hasOrdered = true;
            }
            else
            {
                var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                {
                    // Kiểm tra xem đã review chưa
                    var alreadyReviewed = await db.Reviews.AnyAsync(r => r.ProductId == trimmedProductId && r.UserId == userId);
                    if (!alreadyReviewed)
                    {
                        var userEmail = user.Email?.ToLower().Trim();
                        var userPhone = PhoneNormalizer.NormalizePhone(user.Phone);

                        hasOrdered = await db.Orders
                            .AsNoTracking()
                            .Include(o => o.Customer)
                            .Include(o => o.Items)
                            .Where(o => o.Status != OrderStatus.CANCELLED &&
                                        ((userEmail != null && o.Customer.Email != null && o.Customer.Email.ToLower() == userEmail) ||
                                         (userPhone != "" && o.Customer.Phone.Contains(userPhone))))
                            .AnyAsync(o => o.Items.Any(i => i.ProductId == trimmedProductId));

                        canReview = hasOrdered;
                    }
                }
            }
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                reviews = mappedReviews,
                avgRating,
                total
            },
            reviews = mappedReviews,
            avgRating,
            total,
            canReview,
            hasOrdered,
            isAuthenticated
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProductId))
        {
            return ApiBadRequest("Thiếu thông tin productId");
        }

        if (request.Rating < 1 || request.Rating > 5)
        {
            return ApiBadRequest("Đánh giá phải từ 1 đến 5 sao");
        }

        if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Trim().Length < 5)
        {
            return ApiBadRequest("Nội dung đánh giá phải có ít nhất 5 ký tự");
        }

        var userId = User.GetUserId();
        var userRole = User.GetRole();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return ApiUnauthorized("Vui lòng đăng nhập để gửi đánh giá sản phẩm.");
        }

        var productId = request.ProductId.Trim();

        // Kiểm tra đã review chưa
        var alreadyReviewed = await db.Reviews.AnyAsync(r => r.ProductId == productId && r.UserId == userId);
        if (alreadyReviewed)
        {
            return ApiBadRequest("Bạn đã gửi đánh giá cho sản phẩm này rồi.");
        }

        // Kiểm tra quyền mua hàng nếu không phải ADMIN
        if (userRole != "ADMIN")
        {
            var userEmail = user.Email?.ToLower().Trim();
            var userPhone = PhoneNormalizer.NormalizePhone(user.Phone);

            var hasOrdered = await db.Orders
                .AsNoTracking()
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Where(o => o.Status != OrderStatus.CANCELLED &&
                            ((userEmail != null && o.Customer.Email != null && o.Customer.Email.ToLower() == userEmail) ||
                             (userPhone != "" && o.Customer.Phone.Contains(userPhone))))
                .AnyAsync(o => o.Items.Any(i => i.ProductId == productId));

            if (!hasOrdered)
            {
                return ApiForbidden("Bạn chỉ có thể đánh giá sản phẩm đã từng đặt may tại HUNI.");
            }
        }

        var review = new Review
        {
            ProductId = productId,
            UserId = userId,
            CustomerName = user.FullName,
            CustomerEmail = user.Email,
            CustomerPhone = user.Phone,
            Rating = request.Rating,
            Content = request.Content.Trim(),
            Status = ReviewStatus.APPROVED,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Reviews.Add(review);
        await db.SaveChangesAsync();

        var reviewDto = new
        {
            id = review.Id,
            rating = review.Rating,
            content = review.Content,
            createdAt = review.CreatedAt,
            user = new
            {
                name = user.FullName,
                fullName = user.FullName,
                avatar = user.Avatar
            }
        };

        return StatusCode(201, new
        {
            success = true,
            message = "Gửi đánh giá thành công",
            review = reviewDto,
            data = new { review = reviewDto }
        });
    }
}
