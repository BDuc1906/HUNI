using HuniBackend.Domain.Common;

namespace HuniBackend.Domain.Entities;

public class Voucher
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Code { get; set; } = string.Empty;       // unique, uppercase
    public int Discount { get; set; }
    public string Type { get; set; } = string.Empty;       // percentage | fixed
    public int MinOrder { get; set; } = 0;
    public int? MaxDiscount { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; } = 0;
    public bool Active { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
