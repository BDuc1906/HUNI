using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace HuniBackend.Infrastructure.Services;

public class MailService : IMailService
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
