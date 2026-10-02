using HuniBackend.Domain.Common;

namespace HuniBackend.Domain.Entities;

public class Customer
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;       // unique
    public string? Email { get; set; }
    public string? Company { get; set; }
    public string? Address { get; set; }
    public string? TaxCode { get; set; }
    public string? Notes { get; set; }
    public List<Order> Orders { get; set; } = [];
    public List<Quote> Quotes { get; set; } = [];
    public List<ReturnRequest> ReturnRequests { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
