using HuniBackend.Domain.Common;

namespace HuniBackend.Domain.Entities;

public class OrderItem
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; } = null!;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int UnitPrice { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? CustomLogo { get; set; }  // JSON string
    public int Subtotal { get; set; }
}
