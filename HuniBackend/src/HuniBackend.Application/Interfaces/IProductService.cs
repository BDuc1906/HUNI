using HuniBackend.Application.DTOs.Products;
using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IProductService
{
    Task<(List<Product> Products, int Total)> GetProductsAsync(
        string? category = null,
        string? search = null,
        int? priceMin = null,
        int? priceMax = null,
        bool? featured = null,
        string? sort = null,
        int page = 1,
        int limit = 12,
        bool? published = true);

    Task<Product?> GetProductByIdOrSlugAsync(string idOrSlugOrSku);
    Task<(bool Success, string? Error, Product? Product)> CreateProductAsync(CreateProductRequest request);
    Task<(bool Success, string? Error, Product? Product)> CreateProductAsync(Product product);
    Task<(bool Success, string? Error, Product? Product)> UpdateProductAsync(string idOrSlug, UpdateProductRequest request);
    Task<(bool Success, string? Error, Product? Product)> UpdateProductAsync(string idOrSlug, Product updated);
    Task<bool> DeleteProductAsync(string idOrSlug);
    Task EnsureSeedProductsAsync();
}
