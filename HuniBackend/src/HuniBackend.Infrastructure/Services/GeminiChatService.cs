using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using HuniBackend.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HuniBackend.Infrastructure.Services;

public class GeminiChatService(
    HttpClient httpClient,
    IConfiguration config,
    ILogger<GeminiChatService> logger) : IChatService
{
    public const string DefaultFallbackReply =
        "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây hoặc gọi hotline 0984.959.586 ạ.";

    private static readonly string[] DefaultModelCascade =
    [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-flash-latest"
    ];

    public async Task<string> GetConsultantResponseAsync(List<ChatMessageDto> messages)
    {
        var apiKey = config["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning("Gemini API key is not configured or is a placeholder.");
            return DefaultFallbackReply;
        }

        var configuredModel = config["Gemini:ModelId"];
        var models = new List<string>();
        if (!string.IsNullOrWhiteSpace(configuredModel) && !DefaultModelCascade.Contains(configuredModel))
        {
            models.Add(configuredModel);
        }
        models.AddRange(DefaultModelCascade);

        // Lấy tối đa 10 messages cuối, trim mỗi message max 1000 ký tự
        var recentMessages = messages
            .TakeLast(10)
            .Select(m => new
            {
                role = m.Role.Equals("model", StringComparison.OrdinalIgnoreCase) ? "model" : "user",
                parts = new[]
                {
                    new
                    {
                        text = m.Text.Length > 1000 ? m.Text[..1000] : m.Text
                    }
                }
            })
            .ToList();

        var requestBody = new
        {
            systemInstruction = new
            {
                parts = new[]
                {
                    new
                    {
                        text = "Bạn là trợ lý tư vấn đồng phục HUNI. Trả lời tiếng Việt, thân thiện, chuyên nghiệp. " +
                               "Hỗ trợ tư vấn các sản phẩm: áo polo doanh nghiệp, áo sơ mi chống nhăn, đồng phục may đo cao cấp, veston, golf và học sinh. " +
                               "Nhận đặt may từ 10 áo, miễn phí thêu logo ngực cho đơn từ 30 áo. Tư vấn súc tích, lịch sự."
                    }
                }
            },
            contents = recentMessages,
            generationConfig = new
            {
                temperature = 0.7,
                topP = 0.95,
                maxOutputTokens = 1024
            }
        };

        // Fallback cascade: gemini-2.5-flash -> gemini-2.5-flash-lite -> gemini-2.0-flash -> gemini-flash-latest
        foreach (var model in models)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            // Retry 2 lần cho lỗi 503/429 (backoff: 500ms -> 1500ms)
            for (var attempt = 0; attempt <= 2; attempt++)
            {
                try
                {
                    var response = await httpClient.PostAsJsonAsync(url, requestBody);

                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(json);

                        if (doc.RootElement.TryGetProperty("candidates", out var candidates) &&
                            candidates.GetArrayLength() > 0)
                        {
                            var candidate = candidates[0];
                            if (candidate.TryGetProperty("content", out var content) &&
                                content.TryGetProperty("parts", out var parts) &&
                                parts.GetArrayLength() > 0)
                            {
                                var text = parts[0].GetProperty("text").GetString();
                                if (!string.IsNullOrWhiteSpace(text))
                                {
                                    return text.Trim();
                                }
                            }
                        }
                    }

                    var statusCode = (int)response.StatusCode;
                    var isTransient = response.StatusCode == HttpStatusCode.ServiceUnavailable || statusCode == 429;

                    if (isTransient && attempt < 2)
                    {
                        var delayMs = attempt == 0 ? 500 : 1500;
                        logger.LogWarning("Gemini model {Model} returned {StatusCode}. Retrying in {Delay}ms (attempt {Attempt}/2)...",
                            model, statusCode, delayMs, attempt + 1);
                        await Task.Delay(delayMs);
                        continue;
                    }

                    logger.LogWarning("Gemini model {Model} request failed with status code {StatusCode}.", model, statusCode);
                    break; // Move to next model in cascade
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Exception while calling Gemini model {Model} on attempt {Attempt}", model, attempt + 1);
                    if (attempt < 2)
                    {
                        var delayMs = attempt == 0 ? 500 : 1500;
                        await Task.Delay(delayMs);
                        continue;
                    }
                    break;
                }
            }
        }

        logger.LogWarning("All Gemini cascade models failed. Returning fallback message.");
        return DefaultFallbackReply;
    }
}
