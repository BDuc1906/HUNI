namespace HuniBackend.Domain.Entities;

public class IdempotencyRecord
{
    public int Id { get; set; }
    public string Key { get; set; } = "";
    public string ResponseBody { get; set; } = "";
    public int StatusCode { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
}
