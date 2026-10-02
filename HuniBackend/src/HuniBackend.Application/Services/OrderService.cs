using System.Text.Json;
using FluentValidation;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Common;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Services;

public class OrderService(
    IAppDbContext db,
    IValidator<CreateOrderRequest> validator,
    IPricingService pricingService,
    IVoucherService voucherService,
    IMailService mailService) : IOrderService
{
    private static List<Product>? _cachedSeedProducts;

    private static List<Product> GetSeedProducts()
    {
        if (_cachedSeedProducts != null) return _cachedSeedProducts;

        try
        {
            var possiblePaths = new[]
            {
                Path.Combine(AppContext.BaseDirectory, "Data", "Seeds", "products-seed.json"),
                Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seeds", "products-seed.json"),
                Path.Combine(Directory.GetCurrentDirectory(), "..", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json"),
                Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "HuniBackend.Infrastructure", "Data", "Seeds", "products-seed.json")
            };

            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    var json = File.ReadAllText(path);
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var list = JsonSerializer.Deserialize<List<Product>>(json, options);
                    if (list != null && list.Count > 0)
                    {
                        _cachedSeedProducts = list;
                        return list;
                    }
                }
            }
        }
        catch
        {
            // Bỏ qua lỗi IO fallback
        }

        return [];
    }

    public async Task<(bool Success, string? Error, List<ValidationError>? ValidationErrors, CreateOrderResponse? Response, int StatusCode)> CreateOrderAsync(
        CreateOrderRequest request, string? clientIp = null)
    {
        // ─── BƯỚC 2: FluentValidation ─────────────────────────────────────
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors
                .Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))
                .ToList();
            return (false, "Dữ liệu không hợp lệ", errors, null, 400);
        }

        // ─── BƯỚC 3: Verify giá server-side, reject nếu lệch > 1% ─────────
        var orderItemsToCreate = new List<(Product Product, int Quantity, int UnitPrice, string? Color, string? Size, string? CustomLogoJson)>();
        int subtotal = 0;

        foreach (var item in request.Items)
        {
            var product = await db.Products.FirstOrDefaultAsync(p =>
                p.Id == item.ProductId || p.Slug == item.ProductId || p.Sku == item.ProductId);

            if (product == null)
            {
                var seedProducts = GetSeedProducts();
                var seedProduct = seedProducts.FirstOrDefault(p =>
                    p.Id == item.ProductId || p.Slug == item.ProductId || p.Sku == item.ProductId);

                if (seedProduct != null)
                {
                    var inDb = await db.Products.FirstOrDefaultAsync(p => p.Id == seedProduct.Id || p.Slug == seedProduct.Slug);
                    if (inDb == null)
                    {
                        product = new Product
                        {
                            Id = seedProduct.Id,
                            Slug = seedProduct.Slug,
                            Sku = seedProduct.Sku,
                            Title = seedProduct.Title,
                            Description = seedProduct.Description,
                            Category = seedProduct.Category,
                            Material = seedProduct.Material,
                            Price = seedProduct.Price,
                            OriginalPrice = seedProduct.OriginalPrice,
                            Stock = seedProduct.Stock,
                            Images = seedProduct.Images,
                            Features = seedProduct.Features,
                            Colors = seedProduct.Colors,
                            Sizes = seedProduct.Sizes,
                            WholesaleTiers = seedProduct.WholesaleTiers,
                            Published = seedProduct.Published,
                            Featured = seedProduct.Featured,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        db.Products.Add(product);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        product = inDb;
                    }
                }
            }

            if (product == null)
            {
                return (false, $"Sản phẩm '{item.ProductId}' không tồn tại trong hệ thống.", null, null, 400);
            }

            bool hasCustomLogo = pricingService.HasCustomLogo(item.CustomLogo);
            int expectedUnitPrice = pricingService.CalculateUnitPrice(product, item.Quantity, hasCustomLogo);

            int diff = Math.Abs(item.UnitPrice - expectedUnitPrice);
            double maxAllowedDiff = expectedUnitPrice * 0.01; // 1%

            if (diff > maxAllowedDiff)
            {
                var errorDetails = new List<ValidationError>
                {
                    new(
                        $"items.{item.ProductId}.unitPrice",
                        $"Giá sản phẩm \"{product.Title}\" không khớp (client: {item.UnitPrice}đ, server: {expectedUnitPrice}đ)"
                    )
                };

                return (false, "Giá sản phẩm không hợp lệ. Vui lòng tải lại trang và thử lại.", errorDetails, null, 400);
            }

            string? logoJson = item.CustomLogo != null ? JsonSerializer.Serialize(item.CustomLogo) : null;
            orderItemsToCreate.Add((product, item.Quantity, expectedUnitPrice, item.Color, item.Size, logoJson));
            subtotal += expectedUnitPrice * item.Quantity;
        }

        // ─── BƯỚC 4: Validate voucher (nếu có) ────────────────────────────
        int discount = 0;
        string? voucherApplied = null;

        if (!string.IsNullOrWhiteSpace(request.VoucherCode))
        {
            var (voucherValid, voucherReason, voucherDiscount, voucher) =
                await voucherService.ValidateVoucherAsync(request.VoucherCode, subtotal);

            if (!voucherValid)
            {
                return (false, voucherReason ?? "Mã ưu đãi không hợp lệ", null, null, 400);
            }

            discount = voucherDiscount;
            voucherApplied = voucher?.Code ?? request.VoucherCode.Trim().ToUpperInvariant();
        }

        // ─── BƯỚC 5: Upsert Customer theo SĐT ─────────────────────────────
        var normalizedPhone = PhoneNormalizer.NormalizePhone(request.Customer.Phone);
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.Phone == normalizedPhone);

        if (customer == null)
        {
            customer = new Customer
            {
                Id = CuidGenerator.NewCuid(),
                FullName = request.Customer.FullName.Trim(),
                Phone = normalizedPhone,
                Email = string.IsNullOrWhiteSpace(request.Customer.Email) ? null : request.Customer.Email.Trim(),
                Company = string.IsNullOrWhiteSpace(request.Customer.Company) ? null : request.Customer.Company.Trim(),
                Address = request.Customer.Address.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Customers.Add(customer);
        }
        else
        {
            customer.FullName = request.Customer.FullName.Trim();
            if (!string.IsNullOrWhiteSpace(request.Customer.Email)) customer.Email = request.Customer.Email.Trim();
            if (!string.IsNullOrWhiteSpace(request.Customer.Company)) customer.Company = request.Customer.Company.Trim();
            if (!string.IsNullOrWhiteSpace(request.Customer.Address)) customer.Address = request.Customer.Address.Trim();
            customer.UpdatedAt = DateTime.UtcNow;
        }

        // ─── BƯỚC 6: Tạo Order + OrderItems, GenerateOrderNumber() ─────────
        var orderNumber = await OrderNumberGenerator.GenerateOrderNumberAsync(db);
        var order = new Order
        {
            Id = CuidGenerator.NewCuid(),
            OrderNumber = orderNumber,
            CustomerId = customer.Id,
            Customer = customer,
            Status = OrderStatus.PENDING,
            PaymentMethod = request.PaymentMethod.Trim().ToLowerInvariant(),
            Subtotal = subtotal,
            Discount = discount,
            Total = Math.Max(0, subtotal - discount),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            VatInfo = request.VatInfo != null ? JsonSerializer.Serialize(request.VatInfo) : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var item in orderItemsToCreate)
        {
            order.Items.Add(new OrderItem
            {
                Id = CuidGenerator.NewCuid(),
                OrderId = order.Id,
                ProductId = item.Product.Id,
                ProductName = item.Product.Title,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Color = item.Color,
                Size = item.Size,
                CustomLogo = item.CustomLogoJson,
                Subtotal = item.UnitPrice * item.Quantity
            });
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        if (!string.IsNullOrEmpty(voucherApplied))
        {
            await voucherService.ApplyVoucherAsync(voucherApplied);
        }

        // ─── BƯỚC 7: Gửi email background (Task.Run, không block) ─────────
        _ = Task.Run(async () =>
        {
            try
            {
                await mailService.SendOrderConfirmationAsync(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Background Email Notice] {ex.Message}");
            }
        });

        // ─── BƯỚC 8: Return 201 ───────────────────────────────────────────
        var response = new CreateOrderResponse(
            Success: true,
            Message: "Đơn hàng đã được tiếp nhận",
            Order: new OrderSummaryDto(
                Id: order.Id,
                OrderNumber: order.OrderNumber,
                Subtotal: order.Subtotal,
                Discount: order.Discount,
                Total: order.Total,
                Status: order.Status.ToString(),
                VoucherApplied: voucherApplied
            ),
            RateLimit: new RateLimitInfo(Remaining: 4)
        );

        return (true, null, null, response, 201);
    }

    public async Task<Order?> GetOrderByNumberAsync(string orderNumber, string? phone = null)
    {
        var query = db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Where(o => o.OrderNumber == orderNumber);

        if (!string.IsNullOrWhiteSpace(phone))
        {
            var normalizedPhone = PhoneNormalizer.NormalizePhone(phone);
            query = query.Where(o => o.Customer.Phone.Contains(normalizedPhone));
        }

        return await query.FirstOrDefaultAsync();
    }

    public async Task<(List<OrderDetailDto> Orders, int Total)> GetOrdersAsync(
        string? userId, string? userRole, bool mine, int page = 1, int limit = 20, string? status = null, string? search = null)
    {
        var query = db.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .AsQueryable();

        // RBAC: Nếu là CUSTOMER và xem của mình
        if (mine && !string.IsNullOrEmpty(userId))
        {
            var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                var userEmail = user.Email.ToLower();
                var userPhone = !string.IsNullOrEmpty(user.Phone) ? PhoneNormalizer.NormalizePhone(user.Phone) : null;

                query = query.Where(o =>
                    (o.Customer.Email != null && o.Customer.Email.ToLower() == userEmail) ||
                    (userPhone != null && o.Customer.Phone == userPhone));
            }
            else
            {
                return ([], 0);
            }
        }

        // Lọc theo status
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        // Tìm kiếm
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(s) ||
                o.Customer.FullName.ToLower().Contains(s) ||
                o.Customer.Phone.Contains(s) ||
                (o.Customer.Email != null && o.Customer.Email.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();

        var ordersList = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var dtos = ordersList.Select(o =>
        {
            object? parsedVat = null;
            if (!string.IsNullOrWhiteSpace(o.VatInfo))
            {
                try { parsedVat = JsonSerializer.Deserialize<object>(o.VatInfo); } catch { /* ignore */ }
            }

            return new OrderDetailDto(
                Id: o.Id,
                OrderNumber: o.OrderNumber,
                Status: o.Status.ToString(),
                PaymentMethod: o.PaymentMethod,
                Subtotal: o.Subtotal,
                Discount: o.Discount,
                Total: o.Total,
                Notes: o.Notes,
                VatInfo: parsedVat,
                CreatedAt: o.CreatedAt,
                UpdatedAt: o.UpdatedAt,
                Customer: new OrderCustomerDto(
                    Id: o.Customer.Id,
                    FullName: o.Customer.FullName,
                    Phone: o.Customer.Phone,
                    Email: o.Customer.Email,
                    Company: o.Customer.Company,
                    Address: o.Customer.Address
                ),
                Items: o.Items.Select(i =>
                {
                    object? parsedLogo = null;
                    if (!string.IsNullOrWhiteSpace(i.CustomLogo))
                    {
                        try { parsedLogo = JsonSerializer.Deserialize<object>(i.CustomLogo); } catch { /* ignore */ }
                    }

                    return new OrderItemDto(
                        Id: i.Id,
                        ProductId: i.ProductId,
                        ProductName: i.ProductName,
                        Quantity: i.Quantity,
                        UnitPrice: i.UnitPrice,
                        Color: i.Color,
                        Size: i.Size,
                        CustomLogo: parsedLogo,
                        Subtotal: i.Subtotal
                    );
                }).ToList()
            );
        }).ToList();

        return (dtos, total);
    }
}
