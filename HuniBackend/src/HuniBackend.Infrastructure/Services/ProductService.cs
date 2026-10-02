using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Services;

public class ProductService(AppDbContext db) : IProductService
{
    public async Task<(List<Product> Products, int Total)> GetProductsAsync(
        string? category = null, string? search = null, int page = 1, int limit = 12, bool? published = true)
    {
        var query = db.Products.AsNoTracking().AsQueryable();

        if (published.HasValue)
        {
            query = query.Where(p => p.Published == published.Value);
        }

        if (!string.IsNullOrWhiteSpace(category) && category != "all")
        {
            query = query.Where(p => p.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower().Trim();
            query = query.Where(p => p.Title.ToLower().Contains(s) || p.Sku.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return (products, total);
    }

    public async Task<Product?> GetProductByIdOrSlugAsync(string idOrSlug)
    {
        return await db.Products
            .AsNoTracking()
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == idOrSlug || p.Slug == idOrSlug);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateProductAsync(string id, Product updated)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (existing == null) return null;

        existing.Title = updated.Title;
        existing.Slug = updated.Slug;
        existing.Sku = updated.Sku;
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
        return existing;
    }

    public async Task<bool> DeleteProductAsync(string id)
    {
        var existing = await db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (existing == null) return false;

        db.Products.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }
}
