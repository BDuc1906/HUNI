using System.Net.Http.Json;
using System.Text.Json;
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

public class GeminiChatService(IConfiguration config, IHttpClientFactory httpClientFactory) : IChatService
{
    private static readonly string FallbackReply =
        "Dạ HDC Fashion hân hạnh được hỗ trợ tư vấn quý khách! Hiện tại hệ thống đang kết nối chuyên viên, anh/chị có thể để lại số điện thoại hoặc gọi hotline 0984.959.586 để nhận bảng giá sỉ may đo ưu đãi nhất ạ 😊";

    public async Task<string> GetConsultantResponseAsync(List<ChatMessageDto> messages)
    {
        var apiKey = config["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase))
        {
            return FallbackReply;
        }

        try
        {
            var modelId = config["Gemini:ModelId"] ?? "gemini-2.5-flash";
            var client = httpClientFactory.CreateClient();

            var recentMessages = messages.TakeLast(10).Select(m => new
            {
                role = m.Role.Equals("model", StringComparison.OrdinalIgnoreCase) ? "model" : "user",
                parts = new[] { new { text = m.Text.Length > 1000 ? m.Text[..1000] : m.Text } }
            }).ToList();

            var requestBody = new
            {
                systemInstruction = new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = "Bạn là trợ lý AI tư vấn đồng phục cao cấp của thương hiệu thời trang HUNI (HDC Fashion). " +
                                   "Hỗ trợ tư vấn các dòng áo polo doanh nghiệp, áo sơ mi chống nhăn, veston cao cấp, đồng phục golf và học sinh. " +
                                   "Đặc biệt: Nhận may từ 5 áo, thêu/in logo sắc nét, đơn từ 30 áo được miễn phí thêu logo 1 vị trí. Tư vấn ngắn gọn, lịch sự, thân thiện."
                        }
                    }
                },
                contents = recentMessages,
                generationConfig = new
                {
                    temperature = 0.65,
                    topP = 0.9,
                    maxOutputTokens = 1024
                }
            };

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent?key={apiKey}";
            var response = await client.PostAsJsonAsync(url, requestBody);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var candidates = doc.RootElement.GetProperty("candidates");
                if (candidates.GetArrayLength() > 0)
                {
                    var text = candidates[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    if (!string.IsNullOrWhiteSpace(text))
                    {
                        return text.Trim();
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Gemini Chat Notice] {ex.Message}");
        }

        return FallbackReply;
    }
}
