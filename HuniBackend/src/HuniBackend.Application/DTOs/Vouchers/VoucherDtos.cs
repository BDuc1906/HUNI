namespace HuniBackend.Application.DTOs.Vouchers;

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

public record VoucherResponse(
    string Id,
    string Code,
    string Type,
    int Discount,
    int MinOrder,
    int? MaxDiscount,
    int? UsageLimit,
    int UsedCount,
    bool Active,
    DateTime? ExpiresAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
