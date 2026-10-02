using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace HuniBackend.Infrastructure.Services;

public class MailService(IConfiguration config) : IMailService
{
    public async Task SendOrderConfirmationAsync(Order order)
    {
        // Gửi email xác nhận đơn hàng qua SMTP
        await Task.CompletedTask;
    }

    public async Task SendQuoteNotificationAsync(Quote quote)
    {
        // Gửi email thông báo báo giá mới
        await Task.CompletedTask;
    }
}

public class GeminiChatService(IConfiguration config) : IChatService
{
    public async Task<string> GetConsultantResponseAsync(string userMessage, List<string>? history = null)
    {
        // Tư vấn trực tiếp sản phẩm đồng phục HDC Fashion
        await Task.CompletedTask;
        return "Dạ HDC Fashion hân hạnh được hỗ trợ tư vấn quý khách!";
    }
}
