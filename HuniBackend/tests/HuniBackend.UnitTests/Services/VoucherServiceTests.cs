using FluentAssertions;
using HuniBackend.Application.Services;
using HuniBackend.Domain.Entities;
using Xunit;

namespace HuniBackend.UnitTests.Services;

public class VoucherServiceTests : TestBase
{
    [Fact]
    public async Task ValidateVoucher_ValidPercentage_ReturnsDiscount()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "DISCOUNT10",
            Discount = 10,
            Type = "percentage",
            MinOrder = 500000,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, discount, voucher) = await sut.ValidateVoucherAsync("DISCOUNT10", 1000000);

        valid.Should().BeTrue();
        reason.Should().BeNull();
        discount.Should().Be(100000);
        voucher.Should().NotBeNull();
        voucher!.Code.Should().Be("DISCOUNT10");
    }

    [Fact]
    public async Task ValidateVoucher_ValidFixed_ReturnsFixedDiscount()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "FIXED50K",
            Discount = 50000,
            Type = "fixed",
            MinOrder = 200000,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, discount, voucher) = await sut.ValidateVoucherAsync("FIXED50K", 300000);

        valid.Should().BeTrue();
        discount.Should().Be(50000);
        voucher.Should().NotBeNull();
    }

    [Fact]
    public async Task ValidateVoucher_PercentageWithMaxDiscount_CapsAtMax()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "BIGPROMO",
            Discount = 20,
            Type = "percentage",
            MaxDiscount = 100000,
            MinOrder = 500000,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        // 2,000,000 * 20% = 400,000 => capped at 100,000
        var (valid, reason, discount, _) = await sut.ValidateVoucherAsync("BIGPROMO", 2000000);

        valid.Should().BeTrue();
        discount.Should().Be(100000);
    }

    [Fact]
    public async Task ValidateVoucher_BelowMinOrder_Rejects()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "MIN1M",
            Discount = 100000,
            Type = "fixed",
            MinOrder = 1000000,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, _, _) = await sut.ValidateVoucherAsync("MIN1M", 500000);

        valid.Should().BeFalse();
        reason.Should().NotBeNullOrWhiteSpace();
        reason.Should().Contain("Đơn hàng tối thiểu");
    }

    [Fact]
    public async Task ValidateVoucher_Expired_Rejects()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "EXPIRED",
            Discount = 50000,
            Type = "fixed",
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(-1)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, _, _) = await sut.ValidateVoucherAsync("EXPIRED", 200000);

        valid.Should().BeFalse();
        reason.Should().Contain("hết hạn");
    }

    [Fact]
    public async Task ValidateVoucher_Inactive_Rejects()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "INACTIVE",
            Discount = 50000,
            Type = "fixed",
            Active = false,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, _, _) = await sut.ValidateVoucherAsync("INACTIVE", 200000);

        valid.Should().BeFalse();
        reason.Should().Contain("vô hiệu hóa");
    }

    [Fact]
    public async Task ValidateVoucher_ExceededUsageLimit_Rejects()
    {
        using var db = CreateInMemoryDb();
        db.Vouchers.Add(new Voucher
        {
            Code = "LIMITED",
            Discount = 50000,
            Type = "fixed",
            UsageLimit = 5,
            UsedCount = 5,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var (valid, reason, _, _) = await sut.ValidateVoucherAsync("LIMITED", 200000);

        valid.Should().BeFalse();
        reason.Should().Contain("hết lượt sử dụng");
    }

    [Fact]
    public async Task ValidateVoucher_InvalidCode_Rejects()
    {
        using var db = CreateInMemoryDb();
        var sut = new VoucherService(db);
        var (valid, reason, _, _) = await sut.ValidateVoucherAsync("NON_EXISTENT_XYZ", 200000);

        valid.Should().BeFalse();
        reason.Should().Contain("không hợp lệ");
    }

    [Fact]
    public async Task ValidateVoucher_Success_IncrementsUsedCount()
    {
        using var db = CreateInMemoryDb();
        var voucher = new Voucher
        {
            Code = "COUNTTEST",
            Discount = 50000,
            Type = "fixed",
            UsageLimit = 10,
            UsedCount = 2,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        };
        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync();

        var sut = new VoucherService(db);
        var applied = await sut.ApplyVoucherAsync("COUNTTEST");

        applied.Should().BeTrue();
        var updated = await sut.GetVoucherByCodeAsync("COUNTTEST");
        updated.Should().NotBeNull();
        updated!.UsedCount.Should().Be(3);
    }
}
