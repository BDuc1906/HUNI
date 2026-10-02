using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IProductService
{
    Task<(List<Product> Products, int Total)> GetProductsAsync(string? category = null, string? search = null, int page = 1, int limit = 12, bool? published = true);
    Task<Product?> GetProductByIdOrSlugAsync(string idOrSlug);
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> UpdateProductAsync(string id, Product updated);
    Task<bool> DeleteProductAsync(string id);
}
