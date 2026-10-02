using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Services;

public class VoucherService(AppDbContext db) : IVoucherService
{
    public async Task<(bool Valid, string? Error, int DiscountAmount)> ValidateVoucherAsync(string code, int orderSubtotal)
    {
        var voucher = await GetVoucherByCodeAsync(code);
        if (voucher == null || !voucher.Active)
        {
            return (false, "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hoá.", 0);
        }

        if (voucher.ExpiresAt.HasValue && voucher.ExpiresAt.Value < DateTime.UtcNow)
        {
            return (false, "Mã giảm giá đã hết hạn sử dụng.", 0);
        }

        if (voucher.UsageLimit.HasValue && voucher.UsedCount >= voucher.UsageLimit.Value)
        {
            return (false, "Mã giảm giá đã hết lượt sử dụng.", 0);
        }

        if (orderSubtotal < voucher.MinOrder)
        {
            return (false, $"Đơn hàng tối thiểu phải từ {voucher.MinOrder:N0}đ để áp dụng mã này.", 0);
        }

        int discount = 0;
        if (voucher.Type.Equals("percentage", StringComparison.OrdinalIgnoreCase))
        {
            discount = (int)Math.Round(orderSubtotal * (voucher.Discount / 100.0));
            if (voucher.MaxDiscount.HasValue && discount > voucher.MaxDiscount.Value)
            {
                discount = voucher.MaxDiscount.Value;
            }
        }
        else
        {
            discount = voucher.Discount;
        }

        discount = Math.Min(discount, orderSubtotal);
        return (true, null, discount);
    }

    public async Task<Voucher?> GetVoucherByCodeAsync(string code)
    {
        return await db.Vouchers.FirstOrDefaultAsync(v => v.Code.ToUpper() == code.ToUpper().Trim());
    }
}

public class PricingService : IPricingService
{
    public int CalculateWholesalePrice(Product product, int quantity)
    {
        // Mặc định trả về giá gốc của sản phẩm
        return product.Price;
    }

    public int CalculateSubtotal(int unitPrice, int quantity)
    {
        return unitPrice * quantity;
    }
}
