using HuniBackend.Domain.Common;
using HuniBackend.Domain.Enums;

namespace HuniBackend.Domain.Entities;

public class Review
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string ProductId { get; set; } = string.Empty;
    public Product Product { get; set; } = null!;
    public string? UserId { get; set; }
    public User? User { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public short Rating { get; set; }   // 1-5
    public string Content { get; set; } = string.Empty;
    public ReviewStatus Status { get; set; } = ReviewStatus.PENDING;
    public string? AdminReply { get; set; }
    public DateTime? RepliedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
