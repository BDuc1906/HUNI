using FluentAssertions;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Application.Interfaces;
using HuniBackend.Application.Services;
using HuniBackend.Application.Validators;
using HuniBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace HuniBackend.UnitTests.Services;

public class OrderServiceTests : TestBase
{
    private readonly PricingService _pricingService = new();
    private readonly CreateOrderValidator _validator = new();
    private readonly Mock<IMailService> _mailServiceMock = new();

    private Product CreateTestProduct(string id = "prod-polo-01", int price = 150000) => new()
    {
        Id = id,
        Slug = id,
        Sku = "POLO-SKU-01",
        Title = "Áo Polo HDC Tiêu Chuẩn",
        Price = price,
        Category = "polo",
        Published = true
    };

    private CreateOrderRequest CreateOrderRequest(int quantity = 10, int unitPrice = 150000, string phone = "0912345678", string? voucher = null) => new(
        Customer: new CustomerInfo(
            FullName: "Pham Van D",
            Phone: phone,
            Address: "456 Le Loi, Da Nang",
            Email: "phamvand@gmail.com",
            Company: "HDC Global"
        ),
        Items: new List<OrderItemRequest>
        {
            new(
                ProductId: "prod-polo-01",
                ProductName: "Áo Polo HDC Tiêu Chuẩn",
                Quantity: quantity,
                UnitPrice: unitPrice,
                Color: "Trắng",
                Size: "XL",
                CustomLogo: null
            )
        },
        PaymentMethod: "vietqr",
        VoucherCode: voucher,
        Notes: "Giao tận tay",
        VatInfo: null
    );

    [Fact]
    public async Task CreateOrder_ValidRequest_Returns201WithOrderNumber()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct());
        await db.SaveChangesAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        var req = CreateOrderRequest(quantity: 10, unitPrice: 150000);
        var (success, error, _, res, statusCode) = await sut.CreateOrderAsync(req);

        success.Should().BeTrue();
        error.Should().BeNull();
        statusCode.Should().Be(201);
        res.Should().NotBeNull();
        res!.Order.OrderNumber.Should().MatchRegex(@"^HN-\d{6}-\d{4}$");
    }

    [Fact]
    public async Task CreateOrder_PriceMismatchOver1Percent_Returns400()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct(price: 150000));
        await db.SaveChangesAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        // Client passes 99000 instead of 150000 (> 1% mismatch)
        var req = CreateOrderRequest(quantity: 10, unitPrice: 99000);
        var (success, error, errors, res, statusCode) = await sut.CreateOrderAsync(req);

        success.Should().BeFalse();
        statusCode.Should().Be(400);
        error.Should().Contain("Giá sản phẩm không hợp lệ");
        errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task CreateOrder_PriceMismatchUnder1Percent_Accepts()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct(price: 150000));
        await db.SaveChangesAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        // 149999 vs 150000 is 1 VND difference (< 1% diff)
        var req = CreateOrderRequest(quantity: 10, unitPrice: 149999);
        var (success, error, _, res, statusCode) = await sut.CreateOrderAsync(req);

        success.Should().BeTrue();
        statusCode.Should().Be(201);
        res.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateOrder_WithValidVoucher_AppliesDiscount()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct(price: 100000));
        db.Vouchers.Add(new Voucher
        {
            Code = "SUMMER10",
            Discount = 10,
            Type = "percentage",
            MinOrder = 500000,
            Active = true,
            ExpiresAt = DateTime.UtcNow.AddDays(10)
        });
        await db.SaveChangesAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        // 10 * 100,000 = 1,000,000đ subtotal => 10% discount = 100,000đ => total = 900,000đ
        var req = CreateOrderRequest(quantity: 10, unitPrice: 100000, voucher: "SUMMER10");
        var (success, error, _, res, statusCode) = await sut.CreateOrderAsync(req);

        success.Should().BeTrue();
        statusCode.Should().Be(201);
        res.Should().NotBeNull();
        res!.Order.Discount.Should().Be(100000);
        res.Order.Total.Should().Be(900000);
    }

    [Fact]
    public async Task CreateOrder_QuantityBelowMinimum_Returns400()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct());
        await db.SaveChangesAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        var req = CreateOrderRequest(quantity: 3); // minimum is 5
        var (success, error, _, _, statusCode) = await sut.CreateOrderAsync(req);

        success.Should().BeFalse();
        statusCode.Should().Be(400);
    }

    [Fact]
    public async Task CreateOrder_NewPhone_CreatesNewCustomer()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct());
        await db.SaveChangesAsync();

        var initialCustomerCount = await db.Customers.CountAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        var req = CreateOrderRequest(phone: "0999888777");
        var (success, _, _, _, _) = await sut.CreateOrderAsync(req);

        success.Should().BeTrue();
        var newCustomerCount = await db.Customers.CountAsync();
        newCustomerCount.Should().Be(initialCustomerCount + 1);
    }

    [Fact]
    public async Task CreateOrder_ExistingPhone_ReusesCustomer()
    {
        using var db = CreateInMemoryDb();
        db.Products.Add(CreateTestProduct());
        db.Customers.Add(new Customer
        {
            Id = "cust-existing-01",
            FullName = "Old Customer",
            Phone = "0988112233",
            Address = "Old Address"
        });
        await db.SaveChangesAsync();

        var initialCustomerCount = await db.Customers.CountAsync();

        var voucherService = new VoucherService(db);
        var sut = new OrderService(db, _validator, _pricingService, voucherService, _mailServiceMock.Object);

        var req = CreateOrderRequest(phone: "0988112233");
        var (success, _, _, _, _) = await sut.CreateOrderAsync(req);

        success.Should().BeTrue();
        var afterCustomerCount = await db.Customers.CountAsync();
        afterCustomerCount.Should().Be(initialCustomerCount); // Reused, not duplicated
    }
}
