using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/orders")]
public class OrdersController(IOrderService orderService) : BaseApiController
{
    [HttpGet("{orderNumber}")]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber, [FromQuery] string? phone)
    {
        var order = await orderService.GetOrderByNumberAsync(orderNumber, phone);
        if (order == null)
        {
            return ApiNotFound($"Không tìm thấy đơn hàng '{orderNumber}'.");
        }

        return ApiOk(order);
    }
}
