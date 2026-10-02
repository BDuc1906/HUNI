using HuniBackend.Application.DTOs.Quotes;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/quotes")]
public class QuotesController(IQuoteService quoteService) : BaseApiController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateQuote([FromBody] CreateQuoteRequest request)
    {
        var (success, error, validationErrors, quoteId) = await quoteService.CreateQuoteAsync(request);

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

            return BadRequest(new
            {
                success = false,
                error = error ?? "Không thể tạo yêu cầu báo giá"
            });
        }

        return StatusCode(201, new
        {
            success = true,
            message = "Yêu cầu báo giá đã được tiếp nhận",
            quoteId
        });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuote(string id)
    {
        var quote = await quoteService.GetQuoteByIdAsync(id);
        if (quote == null)
        {
            return ApiNotFound("Không tìm thấy yêu cầu báo giá");
        }

        return ApiOk(quote);
    }
}
