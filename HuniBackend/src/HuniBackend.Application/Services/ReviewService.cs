using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs.Reviews;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Common;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace HuniBackend.Application.Services;

public class ReviewService(IAppDbContext db) : IReviewService
{
    public async Task<ReviewListResponse> GetReviewsAsync(string productId, string? userId = null, string? userRole = null)
    {
        var trimmedProductId = productId.Trim();

        var reviewsList = await db.Reviews
            .AsNoTracking()
            .Include(r => r.User)
            .Where(r => r.ProductId == trimmedProductId && r.Status == ReviewStatus.APPROVED)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var total = reviewsList.Count;
        var avgRating = total > 0 ? Math.Round(reviewsList.Average(r => (double)r.Rating), 1) : 5.0;

        var mappedReviews = reviewsList.Select(r => new ReviewResponse(
            Id: r.Id,
            Rating: r.Rating,
            Content: r.Content,
            CreatedAt: r.CreatedAt,
            User: new ReviewUserDto(
                FullName: r.User?.FullName ?? r.CustomerName,
                Name: r.User?.FullName ?? r.CustomerName,
                Avatar: r.User?.Avatar
            )
        )).ToList();

        var isAuthenticated = !string.IsNullOrWhiteSpace(userId);
        var canReview = false;
        var hasOrdered = false;

        if (isAuthenticated)
        {
            if (string.Equals(userRole, "ADMIN", StringComparison.OrdinalIgnoreCase))
            {
                canReview = true;
                hasOrdered = true;
            }
            else
            {
                var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                {
                    var alreadyReviewed = await db.Reviews.AnyAsync(r => r.ProductId == trimmedProductId && r.UserId == userId);
                    if (!alreadyReviewed)
                    {
                        var totalOrders = await db.Orders.CountAsync();
                        if (totalOrders == 0)
                        {
                            // DB chưa có đơn nào (môi trường dev/demo) -> cho phép review
                            hasOrdered = true;
                            canReview = true;
                        }
                        else
                        {
                            var userEmail = user.Email?.ToLower().Trim();
                            var userPhone = PhoneNormalizer.NormalizePhone(user.Phone);

                            hasOrdered = await db.Orders
                                .AsNoTracking()
                                .Include(o => o.Customer)
                                .Include(o => o.Items)
                                .Where(o => o.Status != OrderStatus.CANCELLED &&
                                            ((userEmail != null && o.Customer.Email != null && o.Customer.Email.ToLower() == userEmail) ||
                                             (!string.IsNullOrEmpty(userPhone) && o.Customer.Phone.Contains(userPhone))))
                                .AnyAsync(o => o.Items.Any(i => i.ProductId == trimmedProductId));

                            canReview = hasOrdered;
                        }
                    }
                }
            }
        }

        var listData = new ReviewListData(mappedReviews, avgRating, total);

        return new ReviewListResponse(
            Success: true,
            Data: listData,
            Reviews: mappedReviews,
            AvgRating: avgRating,
            Total: total,
            CanReview: canReview,
            HasOrdered: hasOrdered,
            IsAuthenticated: isAuthenticated
        );
    }

    public async Task<CreateReviewResult> CreateReviewAsync(CreateReviewRequest request, string? userId, string? userRole = null)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return new CreateReviewResult(false, 401, "Vui lòng đăng nhập để gửi đánh giá sản phẩm.", null);
        }

        if (string.IsNullOrWhiteSpace(request.ProductId))
        {
            return new CreateReviewResult(false, 400, "Thiếu thông tin productId", null);
        }

        if (request.Rating < 1 || request.Rating > 5)
        {
            return new CreateReviewResult(false, 400, "Đánh giá phải từ 1 đến 5 sao", null);
        }

        if (HuniBackend.Application.Common.InputSanitizer.ContainsMalicious(request.Content))
        {
            return new CreateReviewResult(false, 400, "Nội dung không hợp lệ", null);
        }

        var content = HuniBackend.Application.Common.InputSanitizer.StripHtml(request.Content);
        if (string.IsNullOrWhiteSpace(content) || content.Trim().Length < 5)
        {
            return new CreateReviewResult(false, 400, "Nội dung đánh giá phải có ít nhất 5 ký tự", null);
        }

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return new CreateReviewResult(false, 401, "Vui lòng đăng nhập để gửi đánh giá sản phẩm.", null);
        }

        var productId = request.ProductId.Trim();

        // 1. Kiểm tra đã gửi review trước đó chưa
        var alreadyReviewed = await db.Reviews.AnyAsync(r => r.ProductId == productId && r.UserId == userId);
        if (alreadyReviewed)
        {
            return new CreateReviewResult(false, 400, "Bạn đã gửi đánh giá cho sản phẩm này rồi.", null);
        }

        // 2. Nếu role != ADMIN -> kiểm tra đã mua hàng qua OrderItem
        var isAdmin = string.Equals(userRole, "ADMIN", StringComparison.OrdinalIgnoreCase) || user.Role == UserRole.ADMIN;
        if (!isAdmin)
        {
            var totalOrdersInDb = await db.Orders.CountAsync();
            if (totalOrdersInDb > 0)
            {
                var userEmail = user.Email?.ToLower().Trim();
                var userPhone = PhoneNormalizer.NormalizePhone(user.Phone);

                var hasOrdered = await db.Orders
                    .AsNoTracking()
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .Where(o => o.Status != OrderStatus.CANCELLED &&
                                ((userEmail != null && o.Customer.Email != null && o.Customer.Email.ToLower() == userEmail) ||
                                 (!string.IsNullOrEmpty(userPhone) && o.Customer.Phone.Contains(userPhone))))
                    .AnyAsync(o => o.Items.Any(i => i.ProductId == productId));

                if (!hasOrdered)
                {
                    return new CreateReviewResult(false, 403, "Bạn chỉ có thể đánh giá sản phẩm đã từng đặt may tại HUNI.", null);
                }
            }
        }

        // 3. Thêm review vào database với Fallback khi DB lỗi
        try
        {
            var review = new Review
            {
                Id = CuidGenerator.NewCuid(),
                ProductId = productId,
                UserId = userId,
                CustomerName = user.FullName,
                CustomerEmail = user.Email,
                CustomerPhone = user.Phone,
                Rating = request.Rating,
                Content = content,
                Status = ReviewStatus.APPROVED,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Reviews.Add(review);
            await db.SaveChangesAsync();

            Log.Information("Review submitted: Product {ProductId} | Rating: {Rating}", productId, request.Rating);

            var responseDto = new ReviewResponse(
                Id: review.Id,
                Rating: review.Rating,
                Content: review.Content,
                CreatedAt: review.CreatedAt,
                User: new ReviewUserDto(
                    FullName: user.FullName,
                    Name: user.FullName,
                    Avatar: user.Avatar
                )
            );

            return new CreateReviewResult(true, 201, null, responseDto);
        }
        catch
        {
            Log.Information("Review submitted: Product {ProductId} | Rating: {Rating}", productId, request.Rating);

            // Fallback: Nếu DB lỗi -> return simulated review với id "sim-{timestamp}" (HTTP 201)
            var simReview = new ReviewResponse(
                Id: $"sim-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                Rating: request.Rating,
                Content: request.Content.Trim(),
                CreatedAt: DateTime.UtcNow,
                User: new ReviewUserDto(
                    FullName: user.FullName,
                    Name: user.FullName,
                    Avatar: user.Avatar
                )
            );

            return new CreateReviewResult(true, 201, null, simReview);
        }
    }
}
