using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IPricingService
{
    int CalculateTierPrice(Product product, int quantity);
    int CalculateUnitPrice(Product product, int quantity, bool hasCustomLogo);
    bool HasCustomLogo(object? customLogo);
}

public interface IVoucherService
{
    Task<(bool Valid, string? Reason, int Discount, Voucher? Voucher)> ValidateVoucherAsync(string? code, int subtotal);
    Task<bool> ApplyVoucherAsync(string code);
    Task<Voucher?> GetVoucherByCodeAsync(string code);
}
