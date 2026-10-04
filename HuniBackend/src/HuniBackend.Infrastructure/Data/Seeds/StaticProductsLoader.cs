using System.Text.Json;
using HuniBackend.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace HuniBackend.Infrastructure.Data.Seeds;

public class StaticProductsLoader
{
    private readonly Lazy<List<Product>> _productsLazy;
    private readonly ILogger<StaticProductsLoader>? _logger;

    public StaticProductsLoader(ILogger<StaticProductsLoader>? logger = null)
    {
        _logger = logger;
        _productsLazy = new Lazy<List<Product>>(LoadProductsFromSeed);
    }

    public IReadOnlyList<Product> Products => _productsLazy.Value;

    public Product? GetByIdOrSlugOrSku(string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier)) return null;

        var trimmed = identifier.Trim();
        var lower = trimmed.ToLowerInvariant();

        return Products.FirstOrDefault(p =>
            string.Equals(p.Id, trimmed, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(p.Slug, lower, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(p.Sku, lower, StringComparison.OrdinalIgnoreCase));
    }

    public (List<Product> Items, int Total) Filter(
        string? category = null,
        string? search = null,
        int? priceMin = null,
        int? priceMax = null,
        bool? featured = null,
        string? sort = null,
        int page = 1,
        int limit = 12,
        bool? published = true)
    {
        var query = Products.AsEnumerable();

        if (published.HasValue)
        {
            query = query.Where(p => p.Published == published.Value);
        }

        if (featured.HasValue)
        {
            query = query.Where(p => p.Featured == featured.Value);
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var cat = category.Trim().ToLowerInvariant();
            query = query.Where(p => p.Category.ToLowerInvariant() == cat);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLowerInvariant();
            query = query.Where(p =>
                p.Title.ToLowerInvariant().Contains(s) ||
                p.Sku.ToLowerInvariant().Contains(s) ||
                p.Description.ToLowerInvariant().Contains(s) ||
                (p.Material != null && p.Material.ToLowerInvariant().Contains(s)));
        }

        if (priceMin.HasValue)
        {
            query = query.Where(p => p.Price >= priceMin.Value);
        }

        if (priceMax.HasValue)
        {
            query = query.Where(p => p.Price <= priceMax.Value);
        }

        query = (sort?.ToLowerInvariant()) switch
        {
            "priceasc" or "price_asc" => query.OrderBy(p => p.Price),
            "pricedesc" or "price_desc" => query.OrderByDescending(p => p.Price),
            "popular" => query.OrderByDescending(p => p.Featured).ThenByDescending(p => p.CreatedAt),
            "discount" => query.OrderByDescending(p => (p.OriginalPrice ?? p.Price) - p.Price),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = query.Count();
        var safeLimit = Math.Clamp(limit, 1, 48);
        var safePage = Math.Max(1, page);

        var paged = query
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToList();

        return (paged, total);
    }

    private List<Product> LoadProductsFromSeed()
    {
        var candidates = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "Data", "Seeds", "products-seed.json"),
            Path.Combine(AppContext.BaseDirectory, "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds", "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "src", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "src", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json"),
            @"C:\Users\Ngoc Minh Kien\Downloads\HUNI\HuniBackend\src\HuniBackend.Infrastructure\Data\Seeds\products-seed.json"
        };

        var seedPath = candidates.FirstOrDefault(File.Exists);
        if (seedPath != null)
        {
            try
            {
                var json = File.ReadAllText(seedPath);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var list = JsonSerializer.Deserialize<List<Product>>(json, options);
                if (list != null && list.Count > 0)
                {
                    _logger?.LogInformation("Loaded {Count} static products from {Path}", list.Count, seedPath);
                    return list;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to load products from seed at {Path}", seedPath);
            }
        }

        // Hardcoded safety fallback
        return GetFallbackPoloProduct();
    }

    private static List<Product> GetFallbackPoloProduct()
    {
        return
        [
            new Product
            {
                Id = "ao-polo-hdc",
                Slug = "ao-polo-hdc",
                Sku = "HN-POLO-HDC",
                Title = "Áo Polo Doanh Nghiệp HDC Classic Gold",
                Description = "Dòng áo polo đồng phục doanh nghiệp cao cấp được HDC thiết kế riêng.",
                Category = "polo",
                Material = "Cá Sấu Cotton Cao Cấp 100%",
                Price = 185000,
                OriginalPrice = 250000,
                Stock = 100,
                Images = ["/images/uniform_polo_corporate.jpg"],
                Features = ["Vải cá sấu cotton 100%"],
                Colors = "[{\"name\":\"Vàng Gold\",\"code\":\"#D97706\"}]",
                Sizes = ["S", "M", "L", "XL", "2XL"],
                WholesaleTiers = "[{\"min\":10,\"max\":49,\"price\":185000,\"label\":\"10 - 49 áo\"}]",
                Published = true,
                Featured = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        ];
    }
}
