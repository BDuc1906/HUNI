using HuniBackend.Application.DTOs;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace HuniBackend.API.Controllers;

[Route("api/products")]
public class ProductsController(IProductService productService, IOutputCacheStore? cacheStore = null) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Products5min")]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int? priceMin,
        [FromQuery] int? priceMax,
        [FromQuery] string? sort = "popular",
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var safeLimit = Math.Clamp(limit, 1, 48);
        var safePage = Math.Max(1, page);

        var (products, total) = await productService.GetProductsAsync(
            category: category,
            search: search,
            priceMin: priceMin,
            priceMax: priceMax,
            featured: null,
            sort: sort,
            page: safePage,
            limit: safeLimit,
            published: true);

        var totalPages = (int)Math.Ceiling((double)total / safeLimit);

        return ApiOk(new
        {
            products,
            total,
            page = safePage,
            totalPages
        });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Products5min")]
    public async Task<IActionResult> GetProduct(string id)
    {
        var product = await productService.GetProductByIdOrSlugAsync(id);
        if (product == null)
        {
            return ApiNotFound("Không tìm thấy sản phẩm");
        }

        return ApiOk(product);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateProduct([FromBody] Product product)
    {
        var errors = new List<ValidationError>();
        if (string.IsNullOrWhiteSpace(product.Slug) || product.Slug.Length < 2)
            errors.Add(new ValidationError("slug", "Slug phải từ 2 ký tự trở lên."));
        if (string.IsNullOrWhiteSpace(product.Sku) || product.Sku.Length < 2)
            errors.Add(new ValidationError("sku", "Mã SKU phải từ 2 ký tự trở lên."));
        if (string.IsNullOrWhiteSpace(product.Title) || product.Title.Length < 2)
            errors.Add(new ValidationError("title", "Tiêu đề sản phẩm phải từ 2 ký tự trở lên."));
        if (string.IsNullOrWhiteSpace(product.Description) || product.Description.Length < 5)
            errors.Add(new ValidationError("description", "Mô tả sản phẩm phải từ 5 ký tự trở lên."));
        if (string.IsNullOrWhiteSpace(product.Category))
            errors.Add(new ValidationError("category", "Danh mục không được để trống."));
        if (product.Price < 0)
            errors.Add(new ValidationError("price", "Giá sản phẩm phải lớn hơn hoặc bằng 0."));
        if (product.Images == null || product.Images.Length == 0)
            errors.Add(new ValidationError("images", "Sản phẩm phải có ít nhất 1 hình ảnh."));

        if (errors.Count > 0)
        {
            return ApiBadRequest("Dữ liệu sản phẩm không hợp lệ.", errors);
        }

        var (success, error, created) = await productService.CreateProductAsync(product);
        if (!success)
        {
            return ApiConflict(error ?? "Không thể tạo sản phẩm.");
        }

        if (cacheStore != null)
        {
            await cacheStore.EvictByTagAsync("products", default);
        }

        return ApiCreated(created!, "Tạo sản phẩm thành công");
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] Product product)
    {
        var (success, error, updated) = await productService.UpdateProductAsync(id, product);
        if (!success)
        {
            if (error?.Contains("Không tìm thấy", StringComparison.OrdinalIgnoreCase) == true)
            {
                return ApiNotFound("Không tìm thấy sản phẩm để cập nhật");
            }
            return ApiConflict(error ?? "Cập nhật sản phẩm thất bại.");
        }

        if (cacheStore != null)
        {
            await cacheStore.EvictByTagAsync("products", default);
        }

        return ApiOk(updated!, "Cập nhật sản phẩm thành công");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var deleted = await productService.DeleteProductAsync(id);
        if (!deleted)
        {
            return ApiNotFound("Không tìm thấy sản phẩm");
        }

        if (cacheStore != null)
        {
            await cacheStore.EvictByTagAsync("products", default);
        }

        return ApiOk(new { id }, "Xóa sản phẩm thành công");
    }
}
