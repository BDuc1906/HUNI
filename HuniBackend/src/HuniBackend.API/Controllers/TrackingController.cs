using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/tracking")]
public class TrackingController(ITrackingService trackingService) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> TrackOrder([FromQuery] string? code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return BadRequest(new
            {
                success = false,
                error = "Thiếu mã đơn hàng"
            });
        }

        var order = await trackingService.TrackOrderAsync(code);

        // Không tìm thấy đơn hàng vẫn trả về HTTP 200 { success = true, order = null } (KHÔNG phải 404)
        return Ok(new
        {
            success = true,
            order
        });
    }
}
