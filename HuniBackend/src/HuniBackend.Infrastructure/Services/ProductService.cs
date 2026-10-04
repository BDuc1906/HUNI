using System.Text.Json;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs.Products;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Common;
using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using HuniBackend.Infrastructure.Data.Seeds;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Services;

public class ProductService(AppDbContext db, StaticProductsLoader staticLoader) : IProductService
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
        // 1. Kiểm tra DB có sản phẩm published không
        var hasDbProducts = await db.Products.AsNoTracking().AnyAsync(p => p.Published);

        if (!hasDbProducts)
        {
            // Fallback sang StaticProductsLoader nếu DB chưa có sản phẩm
            return staticLoader.Filter(
                category: category,
                search: search,
                priceMin: priceMin,
                priceMax: priceMax,
                featured: featured,
                sort: sort,
                page: page,
                limit: limit,
                published: published);
        }

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
            var cat = category.Trim().ToLowerInvariant();
            query = query.Where(p => p.Category.ToLower() == cat);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLowerInvariant();
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

        query = (sort?.ToLowerInvariant()) switch
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
        if (string.IsNullOrWhiteSpace(idOrSlugOrSku)) return null;

        var trimmed = idOrSlugOrSku.Trim();
        var lower = trimmed.ToLowerInvariant();

        // 1. Tìm trong DB trước
        var product = await db.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == trimmed || p.Slug.ToLower() == lower || p.Sku.ToLower() == lower);

        if (product != null)
        {
            return product;
        }

        // 2. Fallback sang static loader
        return staticLoader.GetByIdOrSlugOrSku(trimmed);
    }

    public async Task<(bool Success, string? Error, Product? Product)> CreateProductAsync(CreateProductRequest request)
    {
        var slugExists = await db.Products.AnyAsync(p => p.Slug.ToLower() == request.Slug.ToLower());
        if (slugExists)
        {
            return (false, $"Đường dẫn (slug) \"{request.Slug}\" đã tồn tại.", null);
        }

        var skuExists = await db.Products.AnyAsync(p => p.Sku.ToLower() == request.Sku.ToLower());
        if (skuExists)
        {
            return (false, $"Mã SKU \"{request.Sku}\" đã tồn tại.", null);
        }

        var product = new Product
        {
            Id = CuidGenerator.NewCuid(),
            Slug = request.Slug.Trim(),
            Sku = request.Sku.Trim(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Category = request.Category.Trim(),
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Stock = request.Stock,
            Material = request.Material,
            Images = request.Images ?? [],
            Features = request.Features ?? [],
            Colors = request.Colors,
            Sizes = request.Sizes ?? [],
            WholesaleTiers = request.WholesaleTiers,
            Published = request.Published,
            Featured = request.Featured,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();

        return (true, null, product);
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

        if (string.IsNullOrWhiteSpace(product.Id))
        {
            product.Id = CuidGenerator.NewCuid();
        }

        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        db.Products.Add(product);
        await db.SaveChangesAsync();

        return (true, null, product);
    }

    public async Task<(bool Success, string? Error, Product? Product)> UpdateProductAsync(string idOrSlug, UpdateProductRequest request)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug.ToLower() == idOrSlug.ToLower() || p.Sku.ToLower() == idOrSlug.ToLower());
        if (existing == null)
        {
            return (false, "Không tìm thấy sản phẩm để cập nhật.", null);
        }

        if (!string.IsNullOrWhiteSpace(request.Slug) && !string.Equals(existing.Slug, request.Slug, StringComparison.OrdinalIgnoreCase))
        {
            var slugExists = await db.Products.AnyAsync(p => p.Id != existing.Id && p.Slug.ToLower() == request.Slug.ToLower());
            if (slugExists)
            {
                return (false, $"Đường dẫn (slug) \"{request.Slug}\" đã tồn tại.", null);
            }
            existing.Slug = request.Slug;
        }

        if (!string.IsNullOrWhiteSpace(request.Sku) && !string.Equals(existing.Sku, request.Sku, StringComparison.OrdinalIgnoreCase))
        {
            var skuExists = await db.Products.AnyAsync(p => p.Id != existing.Id && p.Sku.ToLower() == request.Sku.ToLower());
            if (skuExists)
            {
                return (false, $"Mã SKU \"{request.Sku}\" đã tồn tại.", null);
            }
            existing.Sku = request.Sku;
        }

        if (request.Title != null) existing.Title = request.Title;
        if (request.Description != null) existing.Description = request.Description;
        if (request.Category != null) existing.Category = request.Category;
        if (request.Material != null) existing.Material = request.Material;
        if (request.Price.HasValue) existing.Price = request.Price.Value;
        if (request.OriginalPrice.HasValue) existing.OriginalPrice = request.OriginalPrice.Value;
        if (request.Stock.HasValue) existing.Stock = request.Stock.Value;
        if (request.Images != null) existing.Images = request.Images;
        if (request.Features != null) existing.Features = request.Features;
        if (request.Colors != null) existing.Colors = request.Colors;
        if (request.Sizes != null) existing.Sizes = request.Sizes;
        if (request.WholesaleTiers != null) existing.WholesaleTiers = request.WholesaleTiers;
        if (request.Published.HasValue) existing.Published = request.Published.Value;
        if (request.Featured.HasValue) existing.Featured = request.Featured.Value;
        existing.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return (true, null, existing);
    }

    public async Task<(bool Success, string? Error, Product? Product)> UpdateProductAsync(string idOrSlug, Product updated)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug.ToLower() == idOrSlug.ToLower() || p.Sku.ToLower() == idOrSlug.ToLower());
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
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug.ToLower() == idOrSlug.ToLower() || p.Sku.ToLower() == idOrSlug.ToLower());
        if (existing == null) return false;

        db.Products.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task EnsureSeedProductsAsync()
    {
        var currentCount = await db.Products.CountAsync();
        if (currentCount >= 40) return;

        var products = staticLoader.Products;
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
