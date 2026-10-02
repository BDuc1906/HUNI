using HuniBackend.Domain.Common;
using HuniBackend.Domain.Enums;

namespace HuniBackend.Domain.Entities;

public class Quote
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Company { get; set; }
    public string Category { get; set; } = string.Empty;   // polo|shirt|suit|golf|school|accessories
    public int Quantity { get; set; }
    public int? EstimatedPrice { get; set; }
    public string? Notes { get; set; }
    public QuoteStatus Status { get; set; } = QuoteStatus.NEW;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
