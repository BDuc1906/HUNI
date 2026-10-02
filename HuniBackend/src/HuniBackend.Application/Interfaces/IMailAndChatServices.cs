using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public record ChatMessageDto(string Role, string Text);

public interface IMailService
{
    Task SendOrderConfirmationAsync(Order order);
    Task SendQuoteNotificationAsync(Quote quote);
}

public interface IChatService
{
    Task<string> GetConsultantResponseAsync(List<ChatMessageDto> messages);
}
