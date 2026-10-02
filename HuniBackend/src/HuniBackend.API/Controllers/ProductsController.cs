using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/products")]
public class ProductsController(IProductService productService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var (products, total) = await productService.GetProductsAsync(category, search, page, limit, published: true);
        var totalPages = (int)Math.Ceiling((double)total / limit);

        return ApiOk(new
        {
            products,
            total,
            page,
            limit,
            totalPages
        });
    }

    [HttpGet("{idOrSlug}")]
    public async Task<IActionResult> GetProduct(string idOrSlug)
    {
        var product = await productService.GetProductByIdOrSlugAsync(idOrSlug);
        if (product == null)
        {
            return ApiNotFound($"Không tìm thấy sản phẩm '{idOrSlug}'.");
        }

        return ApiOk(product);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateProduct([FromBody] Product product)
    {
        var created = await productService.CreateProductAsync(product);
        return ApiCreated(created, "Tạo sản phẩm mới thành công.");
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateProduct(string id, [FromBody] Product product)
    {
        var updated = await productService.UpdateProductAsync(id, product);
        if (updated == null)
        {
            return ApiNotFound("Không tìm thấy sản phẩm cần cập nhật.");
        }

        return ApiOk(updated, "Cập nhật sản phẩm thành công.");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var deleted = await productService.DeleteProductAsync(id);
        if (!deleted)
        {
            return ApiNotFound("Không tìm thấy sản phẩm cần xoá.");
        }

        return ApiOk(new { id }, "Đã xoá sản phẩm thành công.");
    }
}
