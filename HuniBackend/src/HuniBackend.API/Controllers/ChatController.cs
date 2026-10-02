using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/chat")]
public class ChatController(IChatService chatService) : BaseApiController
{
    public record ChatRequest(List<ChatMessageDto>? Messages);

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request?.Messages == null || request.Messages.Count == 0)
        {
            return Ok(new
            {
                reply = "Dạ HDC Fashion hân hạnh được hỗ trợ tư vấn quý khách! Anh/chị đang quan tâm đến dòng đồng phục polo, sơ mi, hay veston cao cấp ạ?"
            });
        }

        var reply = await chatService.GetConsultantResponseAsync(request.Messages);

        // Chat endpoint luôn trả về HTTP 200 kể cả khi AI gặp sự cố
        return Ok(new { reply });
    }
}
