using FluentValidation;
using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Products;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace HuniBackend.API.Controllers;

[Route("api/products")]
public class ProductsController(
    IProductService productService,
    IValidator<CreateProductRequest> validator,
    IOutputCacheStore? cacheStore = null) : BaseApiController
{
    [HttpGet]
    [AllowAnonymous]
    [OutputCache(PolicyName = "Products")]
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
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))
                .ToList();
            return ApiBadRequest("Dữ liệu sản phẩm không hợp lệ.", errors);
        }

        var (success, error, created) = await productService.CreateProductAsync(request);
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
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductRequest request)
    {
        var (success, error, updated) = await productService.UpdateProductAsync(id, request);
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
