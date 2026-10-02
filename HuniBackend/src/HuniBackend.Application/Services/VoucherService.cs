using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Services;

public class VoucherService(IAppDbContext db) : IVoucherService
{
    private static readonly Dictionary<string, (int Discount, string Type, int MinOrder, int? MaxDiscount)> StaticFallbackVouchers =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["HUNI2026"] = (5, "percentage", 0, 5_000_000),
            ["DOANHNGHIEP"] = (200_000, "fixed", 5_000_000, 200_000)
        };

    public async Task<(bool Valid, string? Reason, int Discount, Voucher? Voucher)> ValidateVoucherAsync(string? code, int subtotal)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return (false, "Vui lòng nhập mã ưu đãi", 0, null);
        }

        var normalizedCode = code.Trim().ToUpperInvariant();
        var voucher = await GetVoucherByCodeAsync(normalizedCode);

        // Fallback tự động tạo voucher mặc định nếu DB chưa có
        if (voucher == null && StaticFallbackVouchers.TryGetValue(normalizedCode, out var fb))
        {
            voucher = new Voucher
            {
                Code = normalizedCode,
                Discount = fb.Discount,
                Type = fb.Type,
                MinOrder = fb.MinOrder,
                MaxDiscount = fb.MaxDiscount,
                Active = true,
                ExpiresAt = DateTime.UtcNow.AddYears(1),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Vouchers.Add(voucher);
            await db.SaveChangesAsync();
        }

        if (voucher == null)
        {
            return (false, "Mã ưu đãi không hợp lệ", 0, null);
        }

        if (!voucher.Active)
        {
            return (false, "Mã ưu đãi đã bị vô hiệu hóa", 0, voucher);
        }

        if (voucher.ExpiresAt.HasValue && voucher.ExpiresAt.Value < DateTime.UtcNow)
        {
            return (false, "Mã ưu đãi đã hết hạn", 0, voucher);
        }

        if (voucher.UsageLimit.HasValue && voucher.UsedCount >= voucher.UsageLimit.Value)
        {
            return (false, "Mã ưu đãi đã hết lượt sử dụng", 0, voucher);
        }

        if (subtotal < voucher.MinOrder)
        {
            return (false, $"Đơn hàng tối thiểu {voucher.MinOrder:N0}đ để áp dụng mã này", 0, voucher);
        }

        int discount = 0;
        if (voucher.Type.Equals("percentage", StringComparison.OrdinalIgnoreCase) ||
            voucher.Type.Equals("percent", StringComparison.OrdinalIgnoreCase))
        {
            discount = (int)Math.Round((double)subtotal * voucher.Discount / 100.0);
        }
        else
        {
            discount = voucher.Discount;
        }

        if (voucher.MaxDiscount.HasValue && discount > voucher.MaxDiscount.Value)
        {
            discount = voucher.MaxDiscount.Value;
        }

        discount = Math.Min(discount, subtotal);
        return (true, null, discount, voucher);
    }

    public async Task<bool> ApplyVoucherAsync(string code)
    {
        if (string.IsNullOrWhiteSpace(code)) return false;

        var normalizedCode = code.Trim().ToUpperInvariant();
        var voucher = await GetVoucherByCodeAsync(normalizedCode);
        if (voucher != null)
        {
            voucher.UsedCount += 1;
            voucher.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<Voucher?> GetVoucherByCodeAsync(string code)
    {
        if (string.IsNullOrWhiteSpace(code)) return null;
        var normalizedCode = code.Trim().ToUpperInvariant();
        return await db.Vouchers.FirstOrDefaultAsync(v => v.Code.ToUpper() == normalizedCode);
    }
}
