using HuniBackend.Domain.Common;

namespace HuniBackend.Domain.Entities;

public class Product
{
    public string Id { get; set; } = CuidGenerator.NewCuid();
    public string Slug { get; set; } = string.Empty;       // unique
    public string Sku { get; set; } = string.Empty;        // unique
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Material { get; set; }
    public int Price { get; set; }
    public int? OriginalPrice { get; set; }
    public int Stock { get; set; } = 100;
    public string[] Images { get; set; } = [];
    public string[] Features { get; set; } = [];
    public string? Colors { get; set; }           // JSON: [{name, code}]
    public string[] Sizes { get; set; } = [];
    public string? WholesaleTiers { get; set; }   // JSON: [{min, max, price, label}]
    public bool Published { get; set; } = true;
    public bool Featured { get; set; } = false;
    public List<Review> Reviews { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
