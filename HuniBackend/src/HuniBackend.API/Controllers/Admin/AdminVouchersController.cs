using FluentValidation;
using HuniBackend.Application.DTOs.Vouchers;
using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/vouchers")]
public class AdminVouchersController(AppDbContext db, IValidator<CreateVoucherRequest> validator) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetVouchers()
    {
        var vouchers = await db.Vouchers.AsNoTracking().OrderByDescending(v => v.CreatedAt).ToListAsync();
        return ApiOk(new
        {
            vouchers,
            total = vouchers.Count
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherRequest request)
    {
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            return ApiBadRequest(valResult.Errors.First().ErrorMessage);
        }

        var codeUpper = request.Code.Trim().ToUpperInvariant();
        var exists = await db.Vouchers.AnyAsync(v => v.Code == codeUpper);
        if (exists)
        {
            return ApiConflict($"Mã voucher \"{codeUpper}\" đã tồn tại trên hệ thống.");
        }

        var voucher = new Voucher
        {
            Code = codeUpper,
            Type = request.Type.Trim().ToLowerInvariant() == "fixed" ? "fixed" : "percentage",
            Discount = request.Discount,
            MinOrder = Math.Max(0, request.MinOrder),
            MaxDiscount = request.MaxDiscount,
            UsageLimit = request.UsageLimit,
            ExpiresAt = request.ExpiresAt,
            Active = request.Active,
            UsedCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync();

        return ApiCreated(voucher, "Tạo voucher thành công");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVoucher(string id)
    {
        var voucher = await db.Vouchers.FirstOrDefaultAsync(v => v.Id == id || v.Code.ToUpper() == id.ToUpper());
        if (voucher == null) return ApiNotFound("Không tìm thấy voucher");

        db.Vouchers.Remove(voucher);
        await db.SaveChangesAsync();
        return ApiOk(new { id }, "Đã xoá voucher thành công");
    }
}
