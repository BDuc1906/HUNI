using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IOrderService
{
    Task<(bool Success, string? Error, Order? Order)> CreateOrderAsync(object request, string? clientIp = null);
    Task<Order?> GetOrderByNumberAsync(string orderNumber, string? phone = null);
    Task<List<Order>> GetOrdersAsync(int page = 1, int limit = 10, string? status = null, string? search = null);
}
