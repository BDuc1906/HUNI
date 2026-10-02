using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IOrderService
{
    Task<(bool Success, string? Error, List<ValidationError>? ValidationErrors, CreateOrderResponse? Response, int StatusCode)> CreateOrderAsync(
        CreateOrderRequest request, string? clientIp = null);

    Task<Order?> GetOrderByNumberAsync(string orderNumber, string? phone = null);

    Task<(List<OrderDetailDto> Orders, int Total)> GetOrdersAsync(
        string? userId, string? userRole, bool mine, int page = 1, int limit = 20, string? status = null, string? search = null);
}
