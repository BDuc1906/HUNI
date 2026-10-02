using HuniBackend.Application.Interfaces;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/tracking")]
public class TrackingController(IOrderService orderService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> TrackOrder([FromQuery] string orderNumber, [FromQuery] string? phone)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            return ApiBadRequest("Vui lòng cung cấp mã đơn hàng cần tra cứu.");
        }

        var order = await orderService.GetOrderByNumberAsync(orderNumber.Trim(), phone);
        if (order == null)
        {
            return ApiNotFound("Không tìm thấy đơn hàng phù hợp với thông tin đã nhập.");
        }

        return ApiOk(new
        {
            order.OrderNumber,
            order.Status,
            order.CreatedAt,
            Customer = new
            {
                order.Customer.FullName,
                order.Customer.Phone
            },
            order.Items,
            order.Total
        });
    }
}

[Route("api/quotes")]
public class QuotesController(AppDbContext db, IMailService mailService) : BaseApiController
{
    public record CreateQuoteRequest(
        string FullName,
        string Phone,
        string? Email,
        string? Company,
        string Category,
        int Quantity,
        string? Notes
    );

    [HttpPost]
    public async Task<IActionResult> CreateQuote([FromBody] CreateQuoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Phone))
        {
            return ApiBadRequest("Họ tên và số điện thoại không được để trống.");
        }

        var quote = new Domain.Entities.Quote
        {
            FullName = request.FullName.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email?.Trim(),
            Company = request.Company?.Trim(),
            Category = request.Category ?? "polo",
            Quantity = Math.Max(1, request.Quantity),
            Notes = request.Notes
        };

        db.Quotes.Add(quote);
        await db.SaveChangesAsync();

        await mailService.SendQuoteNotificationAsync(quote);

        return ApiCreated(quote, "Yêu cầu báo giá đã được gửi thành công!");
    }
}

[Route("api/reviews")]
public class ReviewsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] string? productId)
    {
        var query = db.Reviews.AsNoTracking().Where(r => r.Status == Domain.Enums.ReviewStatus.APPROVED);

        if (!string.IsNullOrWhiteSpace(productId))
        {
            query = query.Where(r => r.ProductId == productId);
        }

        var reviews = await query.OrderByDescending(r => r.CreatedAt).Take(50).ToListAsync();
        var avgRating = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 5.0;

        return ApiOk(new
        {
            reviews,
            total = reviews.Count,
            avgRating = Math.Round(avgRating, 1)
        });
    }
}

[Route("api/chat")]
public class ChatController(IChatService chatService) : BaseApiController
{
    public record ChatRequest(string Message, List<string>? History);

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return ApiBadRequest("Nội dung tin nhắn không được để trống.");
        }

        var reply = await chatService.GetConsultantResponseAsync(request.Message, request.History);
        return ApiOk(new { reply });
    }
}
