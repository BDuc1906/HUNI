namespace HuniBackend.Application.DTOs.Orders;

public record CustomerInfo(
    string FullName,
    string Phone,
    string? Email,
    string? Company,
    string Address
);

public record CustomLogoInfo(
    string? Url,
    string? Position,
    double? Width,
    double? Height,
    string? Notes
);

public record OrderItemRequest(
    string ProductId,
    string ProductName,
    int Quantity,
    int UnitPrice,
    string? Color,
    string? Size,
    object? CustomLogo
);

public record VatInfoRequest(
    string TaxCode,
    string? CompanyName,
    string CompanyAddress,
    string Email
);

public record CreateOrderRequest(
    CustomerInfo Customer,
    List<OrderItemRequest> Items,
    string? VoucherCode,
    string PaymentMethod,
    string? Notes,
    VatInfoRequest? VatInfo
);
