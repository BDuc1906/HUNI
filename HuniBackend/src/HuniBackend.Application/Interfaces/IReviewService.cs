using HuniBackend.Application.DTOs.Reviews;

namespace HuniBackend.Application.Interfaces;

public interface IReviewService
{
    Task<ReviewListResponse> GetReviewsAsync(string productId, string? userId = null, string? userRole = null);
    Task<CreateReviewResult> CreateReviewAsync(CreateReviewRequest request, string? userId, string? userRole = null);
}
