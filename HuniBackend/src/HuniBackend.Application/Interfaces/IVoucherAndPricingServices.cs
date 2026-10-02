using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IVoucherService
{
    Task<(bool Valid, string? Error, int DiscountAmount)> ValidateVoucherAsync(string code, int orderSubtotal);
    Task<Voucher?> GetVoucherByCodeAsync(string code);
}

public interface IPricingService
{
    int CalculateWholesalePrice(Product product, int quantity);
    int CalculateSubtotal(int unitPrice, int quantity);
}
