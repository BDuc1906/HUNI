using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.DTOs.Products;

public record CreateProductRequest(
    string Slug,
    string Sku,
    string Title,
    string Description,
    string Category,
    int Price,
    int? OriginalPrice = null,
    int Stock = 100,
    string? Material = null,
    string[]? Images = null,
    string[]? Features = null,
    string? Colors = null,
    string[]? Sizes = null,
    string? WholesaleTiers = null,
    bool Published = true,
    bool Featured = false
);

public record UpdateProductRequest(
    string? Slug = null,
    string? Sku = null,
    string? Title = null,
    string? Description = null,
    string? Category = null,
    int? Price = null,
    int? OriginalPrice = null,
    int? Stock = null,
    string? Material = null,
    string[]? Images = null,
    string[]? Features = null,
    string? Colors = null,
    string[]? Sizes = null,
    string? WholesaleTiers = null,
    bool? Published = null,
    bool? Featured = null
);

public record ProductListResponse(
    bool Success,
    List<Product> Products,
    int Total,
    int Page,
    int TotalPages
);

public record ProductDetailResponse(
    bool Success,
    Product? Product,
    string? Message = null
);
