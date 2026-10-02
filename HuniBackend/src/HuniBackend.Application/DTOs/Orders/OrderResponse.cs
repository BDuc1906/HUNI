namespace HuniBackend.Application.DTOs.Orders;

public record OrderSummaryDto(
    string Id,
    string OrderNumber,
    int Subtotal,
    int Discount,
    int Total,
    string Status,
    string? VoucherApplied
);

public record RateLimitInfo(
    int Remaining
);

public record CreateOrderResponse(
    bool Success,
    string Message,
    OrderSummaryDto Order,
    RateLimitInfo RateLimit
);

public record OrderCustomerDto(
    string Id,
    string FullName,
    string Phone,
    string? Email,
    string? Company,
    string? Address
);

public record OrderItemDto(
    string Id,
    string ProductId,
    string ProductName,
    int Quantity,
    int UnitPrice,
    string? Color,
    string? Size,
    object? CustomLogo,
    int Subtotal
);

public record OrderDetailDto(
    string Id,
    string OrderNumber,
    string Status,
    string PaymentMethod,
    int Subtotal,
    int Discount,
    int Total,
    string? Notes,
    object? VatInfo,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    OrderCustomerDto Customer,
    List<OrderItemDto> Items
);

public record OrdersListResponse(
    bool Success,
    int Count,
    int Total,
    int Page,
    int Limit,
    int TotalPages,
    List<OrderDetailDto> Orders
);
