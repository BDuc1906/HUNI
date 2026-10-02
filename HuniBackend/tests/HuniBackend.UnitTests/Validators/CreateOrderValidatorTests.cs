using FluentAssertions;
using HuniBackend.Application.DTOs.Orders;
using HuniBackend.Application.Validators;
using Xunit;

namespace HuniBackend.UnitTests.Validators;

public class CreateOrderValidatorTests
{
    private readonly CreateOrderValidator _sut = new();

    private CreateOrderRequest CreateValidRequest() => new(
        Customer: new CustomerInfo(
            FullName: "Tran Thi B",
            Phone: "0912345678",
            Address: "123 Nguyen Trai, Q.1, TP.HCM",
            Email: "tranthib@gmail.com",
            Company: "HDC Corp"
        ),
        Items: new List<OrderItemRequest>
        {
            new(
                ProductId: "HN-POLO-01",
                ProductName: "Áo Polo Doanh Nghiệp HDC",
                Quantity: 10,
                UnitPrice: 150000,
                Color: "Navy",
                Size: "L",
                CustomLogo: null
            )
        },
        PaymentMethod: "vietqr",
        VoucherCode: "HUNI2026",
        Notes: "Giao giờ hành chính",
        VatInfo: null
    );

    [Fact]
    public void Validate_ValidRequest_Passes()
    {
        var req = CreateValidRequest();
        var result = _sut.Validate(req);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_NullCustomer_Fails()
    {
        var req = CreateValidRequest() with { Customer = null! };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_EmptyItems_Fails()
    {
        var req = CreateValidRequest() with { Items = new List<OrderItemRequest>() };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_QuantityBelow5_Fails()
    {
        var req = CreateValidRequest();
        req.Items[0] = req.Items[0] with { Quantity = 3 };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_InvalidPaymentMethod_Fails()
    {
        var req = CreateValidRequest() with { PaymentMethod = "cash_on_delivery" };
        var result = _sut.Validate(req);
        result.IsValid.Should().BeFalse();
    }
}
