using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers;

[Route("api/returns")]
public class ReturnsController(AppDbContext db) : BaseApiController
{
    public record CreateReturnRequest(
        string OrderNumber,
        string CustomerName,
        string CustomerPhone,
        string? CustomerEmail,
        string? Company,
        string ProductId,
        string ProductTitle,
        int Quantity,
        string Type, // EXCHANGE | REFUND
        string Reason,
        string Details,
        string? BankInfo,
        string[]? EvidenceImages
    );

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateReturn([FromBody] CreateReturnRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OrderNumber))
        {
            return ApiBadRequest("Vui lòng cung cấp mã đơn hàng.");
        }

        if (string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.CustomerPhone))
        {
            return ApiBadRequest("Họ tên và số điện thoại không được để trống.");
        }

        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            return ApiBadRequest("Vui lòng cung cấp lý do đổi trả.");
        }

        var normalizedPhone = PhoneNormalizer.NormalizePhone(request.CustomerPhone);
        if (!PhoneNormalizer.IsValidPhone(normalizedPhone))
        {
            return ApiBadRequest("Số điện thoại không hợp lệ (yêu cầu 10-11 chữ số).");
        }

        var returnType = request.Type?.ToUpper() == "REFUND" ? ReturnType.REFUND : ReturnType.EXCHANGE;

        // Generate return ID RT-YYMMDD-XXX
        var dateStr = DateTime.UtcNow.ToString("yyMMdd");
        var today = DateTime.UtcNow.Date;
        var countToday = await db.ReturnRequests.CountAsync(r => r.CreatedAt >= today) + 1;
        var returnId = $"RT-{dateStr}-{countToday:D3}";

        var returnRequest = new ReturnRequest
        {
            Id = returnId,
            OrderNumber = request.OrderNumber.Trim().ToUpperInvariant(),
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = normalizedPhone,
            CustomerEmail = request.CustomerEmail?.Trim(),
            Company = request.Company?.Trim(),
            ProductId = request.ProductId,
            ProductTitle = request.ProductTitle,
            Quantity = Math.Max(1, request.Quantity),
            Type = returnType,
            Reason = request.Reason.Trim(),
            Details = request.Details ?? "",
            BankInfo = request.BankInfo,
            EvidenceImages = request.EvidenceImages ?? [],
            Status = ReturnStatus.PENDING,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.ReturnRequests.Add(returnRequest);
        await db.SaveChangesAsync();

        return ApiCreated(returnRequest, "Yêu cầu đổi trả đã được gửi thành công.");
    }
}
