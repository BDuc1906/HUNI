using HuniBackend.API.Extensions;
using HuniBackend.API.Middleware;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers;

[Route("api/orders")]
public class OrdersController(IOrderService orderService, IAppDbContext db) : BaseApiController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        var (success, error, validationErrors, response, statusCode) =
            await orderService.CreateOrderAsync(request, clientIp);

        if (!success)
        {
            if (validationErrors != null && validationErrors.Count > 0)
            {
                return BadRequest(new
                {
                    success = false,
                    error = error ?? "Dữ liệu không hợp lệ",
                    details = validationErrors
                });
            }

            return StatusCode(statusCode, new
            {
                success = false,
                error = error ?? "Không thể xử lý đơn hàng"
            });
        }

        // Cập nhật remaining rate limit thực tế từ middleware nếu có
        var remaining = HttpContext.Items.TryGetValue("OrderRateLimitRemaining", out var r) && r is int rem
            ? rem
            : OrderRateLimitMiddleware.GetRemaining(clientIp ?? "127.0.0.1");

        var finalResponse = response! with { RateLimit = new RateLimitInfo(Remaining: remaining) };

        return StatusCode(201, finalResponse);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetOrders(
        [FromQuery] bool mine = false,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var isAdmin = User.IsAdmin();

        // RBAC Guard: CUSTOMER bắt buộc phải có ?mine=true
        if (!isAdmin && !mine)
        {
            return ApiForbidden("Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền.");
        }

        var userId = User.GetUserId();
        var userRole = User.GetRole();

        var (orders, total) = await orderService.GetOrdersAsync(
            userId: userId,
            userRole: userRole,
            mine: mine,
            page: Math.Max(1, page),
            limit: Math.Clamp(limit, 1, 100),
            status: status,
            search: search
        );

        int totalPages = total == 0 ? 0 : (int)Math.Ceiling((double)total / limit);

        return Ok(new
        {
            success = true,
            count = orders.Count,
            total,
            page,
            limit,
            totalPages,
            orders
        });
    }

    [HttpGet("{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber, [FromQuery] string? phone)
    {
        var order = await orderService.GetOrderByNumberAsync(orderNumber);
        if (order == null)
        {
            return ApiNotFound($"Không tìm thấy đơn hàng '{orderNumber}'.");
        }

        // 🔐 Resource-based Auth check
        if (User.Identity?.IsAuthenticated == true)
        {
            if (!User.IsAdmin())
            {
                var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value?.ToLowerInvariant();
                var userPhone = User.FindFirst(System.Security.Claims.ClaimTypes.MobilePhone)?.Value;
                var normalizedUserPhone = !string.IsNullOrEmpty(userPhone) ? PhoneNormalizer.NormalizePhone(userPhone) : null;
                var normalizedOrderPhone = PhoneNormalizer.NormalizePhone(order.Customer.Phone);

                bool isOwner = (!string.IsNullOrEmpty(userEmail) && order.Customer.Email?.ToLowerInvariant() == userEmail) ||
                               (normalizedUserPhone != null && normalizedOrderPhone == normalizedUserPhone);

                if (!isOwner)
                {
                    return ApiForbidden("Bạn không có quyền xem đơn hàng này.");
                }
            }
        }
        else if (!string.IsNullOrWhiteSpace(phone))
        {
            var normalizedPhone = PhoneNormalizer.NormalizePhone(phone);
            var normalizedOrderPhone = PhoneNormalizer.NormalizePhone(order.Customer.Phone);
            if (!normalizedOrderPhone.Contains(normalizedPhone))
            {
                return ApiForbidden("Bạn không có quyền xem đơn hàng này.");
            }
        }

        object? parsedVat = null;
        if (!string.IsNullOrWhiteSpace(order.VatInfo))
        {
            try { parsedVat = System.Text.Json.JsonSerializer.Deserialize<object>(order.VatInfo); } catch { }
        }

        var dto = new OrderDetailDto(
            Id: order.Id,
            OrderNumber: order.OrderNumber,
            Status: order.Status.ToString(),
            PaymentMethod: order.PaymentMethod,
            Subtotal: order.Subtotal,
            Discount: order.Discount,
            Total: order.Total,
            Notes: order.Notes,
            VatInfo: parsedVat,
            CreatedAt: order.CreatedAt,
            UpdatedAt: order.UpdatedAt,
            Customer: new OrderCustomerDto(
                Id: order.Customer.Id,
                FullName: order.Customer.FullName,
                Phone: order.Customer.Phone,
                Email: order.Customer.Email,
                Company: order.Customer.Company,
                Address: order.Customer.Address
            ),
            Items: order.Items.Select(i =>
            {
                object? parsedLogo = null;
                if (!string.IsNullOrWhiteSpace(i.CustomLogo))
                {
                    try { parsedLogo = System.Text.Json.JsonSerializer.Deserialize<object>(i.CustomLogo); } catch { }
                }

                return new OrderItemDto(
                    Id: i.Id,
                    ProductId: i.ProductId,
                    ProductName: i.ProductName,
                    Quantity: i.Quantity,
                    UnitPrice: i.UnitPrice,
                    Color: i.Color,
                    Size: i.Size,
                    CustomLogo: parsedLogo,
                    Subtotal: i.Subtotal
                );
            }).ToList()
        );

        return ApiOk(dto);
    }

    public record UpdateOrderRequest(string? Notes);

    [HttpPatch("{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateOrder(string orderNumber, [FromBody] UpdateOrderRequest request, [FromQuery] string? phone)
    {
        var order = await db.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber || o.Id == orderNumber);

        if (order == null)
        {
            return ApiNotFound($"Không tìm thấy đơn hàng '{orderNumber}'.");
        }

        // 🔐 Resource-based check
        if (User.Identity?.IsAuthenticated == true)
        {
            if (!User.IsAdmin())
            {
                var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value?.ToLowerInvariant();
                var userPhone = User.FindFirst(System.Security.Claims.ClaimTypes.MobilePhone)?.Value;
                var normalizedUserPhone = !string.IsNullOrEmpty(userPhone) ? PhoneNormalizer.NormalizePhone(userPhone) : null;
                var normalizedOrderPhone = PhoneNormalizer.NormalizePhone(order.Customer.Phone);

                bool isOwner = (!string.IsNullOrEmpty(userEmail) && order.Customer.Email?.ToLowerInvariant() == userEmail) ||
                               (normalizedUserPhone != null && normalizedOrderPhone == normalizedUserPhone);

                if (!isOwner)
                {
                    return ApiForbidden("Bạn không có quyền chỉnh sửa đơn hàng này.");
                }
            }
        }
        else
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                return ApiForbidden("Vui lòng cung cấp số điện thoại để xác thực chỉnh sửa đơn hàng.");
            }

            var normalizedPhone = PhoneNormalizer.NormalizePhone(phone);
            var normalizedOrderPhone = PhoneNormalizer.NormalizePhone(order.Customer.Phone);
            if (!normalizedOrderPhone.Contains(normalizedPhone))
            {
                return ApiForbidden("Bạn không có quyền chỉnh sửa đơn hàng này.");
            }
        }

        // Chặn sửa khi đơn đã hoàn thành hoặc hủy
        if (order.Status is OrderStatus.COMPLETED or OrderStatus.CANCELLED)
        {
            return ApiBadRequest("Đơn hàng đã hoàn thành hoặc đã hủy, không thể chỉnh sửa.");
        }

        if (request.Notes != null && request.Notes.Length > 500)
        {
            return ApiBadRequest("Ghi chú tối đa 500 ký tự.");
        }

        order.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : InputSanitizer.StripHtml(request.Notes);
        order.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return ApiOk(new { order.OrderNumber, order.Notes, order.UpdatedAt }, "Cập nhật đơn hàng thành công.");
    }
}
