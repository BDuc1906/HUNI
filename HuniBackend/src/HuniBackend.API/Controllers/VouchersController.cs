using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/vouchers")]
public class VouchersController(IVoucherService voucherService) : BaseApiController
{
    [HttpGet("validate")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateVoucher([FromQuery] string? code, [FromQuery] int subtotal = 0)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return ApiBadRequest("Vui lòng cung cấp mã voucher cần kiểm tra.");
        }

        var (isValid, error, discountAmount, _) = await voucherService.ValidateVoucherAsync(code.Trim(), subtotal);
        if (!isValid)
        {
            return ApiBadRequest(error ?? "Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }

        return ApiOk(new
        {
            code = code.Trim().ToUpperInvariant(),
            discount = discountAmount,
            isValid = true
        }, "Áp dụng mã giảm giá thành công.");
    }
}
