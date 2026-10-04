namespace HuniBackend.Application.DTOs.Reviews;

public record ReviewUserDto(
    string FullName,
    string Name,
    string? Avatar
);

public record ReviewResponse(
    string Id,
    short Rating,
    string Content,
    DateTime CreatedAt,
    ReviewUserDto User
);

public record CreateReviewRequest(
    string ProductId,
    short Rating,
    string Content
);

public record ReviewListData(
    List<ReviewResponse> Reviews,
    double AvgRating,
    int Total
);

public record ReviewListResponse(
    bool Success,
    ReviewListData Data,
    List<ReviewResponse> Reviews,
    double AvgRating,
    int Total,
    bool CanReview,
    bool HasOrdered,
    bool IsAuthenticated
);

public record CreateReviewResult(
    bool Success,
    int StatusCode,
    string? Error,
    ReviewResponse? Review
);
