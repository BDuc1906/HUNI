using HuniBackend.Domain.Common;
using HuniBackend.Domain.Enums;

namespace HuniBackend.Domain.Entities;

public class Order
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string OrderNumber { get; set; } = string.Empty;  // HN-YYMMDD-XXXX, unique
    public string CustomerId { get; set; } = string.Empty;
    public Customer Customer { get; set; } = null!;
    public OrderStatus Status { get; set; } = OrderStatus.PENDING;
    public string PaymentMethod { get; set; } = string.Empty; // vietqr|deposit30|freesample|cod
    public int Subtotal { get; set; }
    public int Discount { get; set; }
    public int Total { get; set; }
    public string? Notes { get; set; }
    public string? VatInfo { get; set; }   // JSON string {taxCode, companyName, companyAddress, email}
    public List<OrderItem> Items { get; set; } = [];
    public List<ReturnRequest> ReturnRequests { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
