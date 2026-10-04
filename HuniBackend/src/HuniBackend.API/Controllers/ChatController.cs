using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/chat")]
public class ChatController(IChatService chatService) : BaseApiController
{
    private const string FallbackReply =
        "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây hoặc gọi hotline 0984.959.586 ạ.";

    public record ChatRequest(List<ChatMessageDto>? Messages);

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request?.Messages == null || request.Messages.Count == 0)
        {
            return Ok(new
            {
                reply = "Dạ HUNI hân hạnh được hỗ trợ tư vấn quý khách! Anh/chị đang quan tâm đến dòng đồng phục polo, sơ mi, hay veston cao cấp ạ?"
            });
        }

        try
        {
            var reply = await chatService.GetConsultantResponseAsync(request.Messages);
            return Ok(new { reply = string.IsNullOrWhiteSpace(reply) ? FallbackReply : reply });
        }
        catch
        {
            // LUÔN trả HTTP 200 kể cả khi AI fail
            return Ok(new { reply = FallbackReply });
        }
    }
}
