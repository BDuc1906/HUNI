using HuniBackend.API.Extensions;
using HuniBackend.Application.DTOs.Reviews;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/reviews")]
public class ReviewsController(IReviewService reviewService) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews([FromQuery] string? productId)
    {
        if (string.IsNullOrWhiteSpace(productId))
        {
            return ApiBadRequest("Thiếu thông tin productId");
        }

        var isAuthenticated = User.Identity?.IsAuthenticated == true;
        var userId = isAuthenticated ? User.GetUserId() : null;
        var userRole = isAuthenticated ? User.GetRole() : null;

        var result = await reviewService.GetReviewsAsync(productId, userId, userRole);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
    {
        var userId = User.GetUserId();
        var userRole = User.GetRole();

        var result = await reviewService.CreateReviewAsync(request, userId, userRole);

        if (!result.Success)
        {
            return result.StatusCode switch
            {
                401 => ApiUnauthorized(result.Error ?? "Vui lòng đăng nhập để gửi đánh giá sản phẩm."),
                403 => ApiForbidden(result.Error ?? "Bạn chỉ có thể đánh giá sản phẩm đã từng đặt may tại HUNI."),
                _ => ApiBadRequest(result.Error ?? "Không thể gửi đánh giá.")
            };
        }

        return StatusCode(201, new
        {
            success = true,
            message = "Gửi đánh giá thành công",
            review = result.Review,
            data = new { review = result.Review }
        });
    }
}
