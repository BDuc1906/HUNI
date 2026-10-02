using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IMailService
{
    Task SendOrderConfirmationAsync(Order order);
    Task SendQuoteNotificationAsync(Quote quote);
}

public interface IChatService
{
    Task<string> GetConsultantResponseAsync(string userMessage, List<string>? history = null);
}
