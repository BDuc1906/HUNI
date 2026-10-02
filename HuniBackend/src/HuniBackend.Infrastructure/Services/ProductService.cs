using System.Text.Json;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Services;

public class ProductService(AppDbContext db) : IProductService
{
    public async Task<(List<Product> Products, int Total)> GetProductsAsync(
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
        await EnsureSeedProductsAsync();

        var query = db.Products.AsNoTracking().AsQueryable();

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
            var cat = category.Trim().ToLower();
            query = query.Where(p => p.Category.ToLower() == cat);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(p => p.Title.ToLower().Contains(s) ||
                                     p.Sku.ToLower().Contains(s) ||
                                     p.Description.ToLower().Contains(s) ||
                                     (p.Material != null && p.Material.ToLower().Contains(s)));
        }

        if (priceMin.HasValue)
        {
            query = query.Where(p => p.Price >= priceMin.Value);
        }

        if (priceMax.HasValue)
        {
            query = query.Where(p => p.Price <= priceMax.Value);
        }

        query = (sort?.ToLower()) switch
        {
            "priceasc" or "price_asc" => query.OrderBy(p => p.Price),
            "pricedesc" or "price_desc" => query.OrderByDescending(p => p.Price),
            "popular" => query.OrderByDescending(p => p.Featured).ThenByDescending(p => p.CreatedAt),
            "discount" => query.OrderByDescending(p => (p.OriginalPrice ?? p.Price) - p.Price),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = await query.CountAsync();
        var safeLimit = Math.Clamp(limit, 1, 48);
        var safePage = Math.Max(1, page);

        var products = await query
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        return (products, total);
    }

    public async Task<Product?> GetProductByIdOrSlugAsync(string idOrSlugOrSku)
    {
        await EnsureSeedProductsAsync();

        var trimmed = idOrSlugOrSku.Trim();
        var lower = trimmed.ToLower();

        return await db.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == trimmed || p.Slug.ToLower() == lower || p.Sku.ToLower() == lower);
    }

    public async Task<(bool Success, string? Error, Product? Product)> CreateProductAsync(Product product)
    {
        var slugExists = await db.Products.AnyAsync(p => p.Slug.ToLower() == product.Slug.ToLower());
        if (slugExists)
        {
            return (false, $"Đường dẫn (slug) \"{product.Slug}\" đã tồn tại.", null);
        }

        var skuExists = await db.Products.AnyAsync(p => p.Sku.ToLower() == product.Sku.ToLower());
        if (skuExists)
        {
            return (false, $"Mã SKU \"{product.Sku}\" đã tồn tại.", null);
        }

        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        db.Products.Add(product);
        await db.SaveChangesAsync();

        return (true, null, product);
    }

    public async Task<(bool Success, string? Error, Product? Product)> UpdateProductAsync(string idOrSlug, Product updated)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug.ToLower() == idOrSlug.ToLower());
        if (existing == null)
        {
            return (false, "Không tìm thấy sản phẩm để cập nhật.", null);
        }

        if (!string.Equals(existing.Slug, updated.Slug, StringComparison.OrdinalIgnoreCase))
        {
            var slugExists = await db.Products.AnyAsync(p => p.Id != existing.Id && p.Slug.ToLower() == updated.Slug.ToLower());
            if (slugExists)
            {
                return (false, $"Đường dẫn (slug) \"{updated.Slug}\" đã tồn tại.", null);
            }
            existing.Slug = updated.Slug;
        }

        if (!string.Equals(existing.Sku, updated.Sku, StringComparison.OrdinalIgnoreCase))
        {
            var skuExists = await db.Products.AnyAsync(p => p.Id != existing.Id && p.Sku.ToLower() == updated.Sku.ToLower());
            if (skuExists)
            {
                return (false, $"Mã SKU \"{updated.Sku}\" đã tồn tại.", null);
            }
            existing.Sku = updated.Sku;
        }

        existing.Title = updated.Title;
        existing.Description = updated.Description;
        existing.Category = updated.Category;
        existing.Material = updated.Material;
        existing.Price = updated.Price;
        existing.OriginalPrice = updated.OriginalPrice;
        existing.Stock = updated.Stock;
        existing.Images = updated.Images;
        existing.Features = updated.Features;
        existing.Colors = updated.Colors;
        existing.Sizes = updated.Sizes;
        existing.WholesaleTiers = updated.WholesaleTiers;
        existing.Published = updated.Published;
        existing.Featured = updated.Featured;
        existing.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return (true, null, existing);
    }

    public async Task<bool> DeleteProductAsync(string idOrSlug)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug.ToLower() == idOrSlug.ToLower());
        if (existing == null) return false;

        db.Products.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task EnsureSeedProductsAsync()
    {
        var currentCount = await db.Products.CountAsync();
        if (currentCount >= 40) return;

        var candidates = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "Data", "Seeds", "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds", "products-seed.json"),
            Path.Combine(AppContext.BaseDirectory, "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "src", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json")
        };

        var foundPath = candidates.FirstOrDefault(File.Exists);
        if (foundPath != null)
        {
            var json = await File.ReadAllTextAsync(foundPath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var products = JsonSerializer.Deserialize<List<Product>>(json, options);
            if (products != null && products.Count > 0)
            {
                var existingSlugs = await db.Products.Select(p => p.Slug.ToLower()).ToListAsync();
                var toAdd = products.Where(p => !existingSlugs.Contains(p.Slug.ToLower())).ToList();
                if (toAdd.Count > 0)
                {
                    await db.Products.AddRangeAsync(toAdd);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}
