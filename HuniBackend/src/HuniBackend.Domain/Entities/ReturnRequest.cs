using HuniBackend.Domain.Common;
using HuniBackend.Domain.Enums;

namespace HuniBackend.Domain.Entities;

public class ReturnRequest
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string? OrderId { get; set; }
    public Order? Order { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string? Company { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; }
    public string ProductTitle { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public ReturnType Type { get; set; } = ReturnType.EXCHANGE;
    public string Reason { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public int RefundAmount { get; set; } = 0;
    public string? BankInfo { get; set; } // JSON string
    public string[] EvidenceImages { get; set; } = [];
    public ReturnStatus Status { get; set; } = ReturnStatus.PENDING;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
