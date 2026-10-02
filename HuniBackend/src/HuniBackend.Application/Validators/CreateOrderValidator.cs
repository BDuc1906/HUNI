using FluentValidation;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs.Orders;

namespace HuniBackend.Application.Validators;

public class CreateOrderValidator : AbstractValidator<CreateOrderRequest>
{
    private static readonly HashSet<string> AllowedPaymentMethods =
        new(StringComparer.OrdinalIgnoreCase) { "vietqr", "deposit30", "freesample" };

    public CreateOrderValidator()
    {
        RuleFor(x => x.Customer)
            .NotNull().WithMessage("Thông tin khách hàng không được để trống.");

        When(x => x.Customer != null, () =>
        {
            RuleFor(x => x.Customer.FullName)
                .NotEmpty().WithMessage("Họ và tên khách hàng không được để trống.")
                .MinimumLength(2).WithMessage("Họ và tên phải có ít nhất 2 ký tự.")
                .MaximumLength(100).WithMessage("Họ và tên tối đa 100 ký tự.");

            RuleFor(x => x.Customer.Phone)
                .NotEmpty().WithMessage("Số điện thoại không được để trống.")
                .Must(PhoneNormalizer.IsValidPhone)
                .WithMessage("Số điện thoại không hợp lệ (phải gồm 10-11 chữ số).");

            RuleFor(x => x.Customer.Address)
                .NotEmpty().WithMessage("Địa chỉ nhận hàng không được để trống.");

            RuleFor(x => x.Customer.Email)
                .EmailAddress().WithMessage("Địa chỉ email không đúng định dạng.")
                .When(x => !string.IsNullOrWhiteSpace(x.Customer.Email));

            RuleFor(x => x.Customer.Company)
                .MaximumLength(200).WithMessage("Tên công ty tối đa 200 ký tự.")
                .When(x => !string.IsNullOrWhiteSpace(x.Customer.Company));
        });

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Đơn hàng phải có ít nhất 1 sản phẩm.")
            .Must(items => items != null && items.Count >= 1 && items.Count <= 50)
            .WithMessage("Số loại sản phẩm trong một đơn hàng từ 1 đến 50.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId)
                .NotEmpty().WithMessage("Mã sản phẩm không được để trống.");

            item.RuleFor(i => i.ProductName)
                .NotEmpty().WithMessage("Tên sản phẩm không được để trống.")
                .MaximumLength(300).WithMessage("Tên sản phẩm tối đa 300 ký tự.");

            item.RuleFor(i => i.Quantity)
                .GreaterThanOrEqualTo(5).WithMessage("Số lượng đặt may tối thiểu là 5 sản phẩm/loại.")
                .LessThanOrEqualTo(100000).WithMessage("Số lượng tối đa là 100.000 sản phẩm/loại.");

            item.RuleFor(i => i.UnitPrice)
                .GreaterThanOrEqualTo(0).WithMessage("Đơn giá sản phẩm không được âm.");
        });

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Phương thức thanh toán không được để trống.")
            .Must(p => AllowedPaymentMethods.Contains(p?.Trim() ?? string.Empty))
            .WithMessage("Phương thức thanh toán chỉ chấp nhận: vietqr, deposit30 hoặc freesample.");

        RuleFor(x => x.VoucherCode)
            .MaximumLength(50).WithMessage("Mã ưu đãi tối đa 50 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.VoucherCode));

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Ghi chú đơn hàng tối đa 500 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));

        When(x => x.VatInfo != null, () =>
        {
            RuleFor(x => x.VatInfo!.TaxCode)
                .NotEmpty().WithMessage("Mã số thuế không được để trống.")
                .MaximumLength(50).WithMessage("Mã số thuế tối đa 50 ký tự.");

            RuleFor(x => x.VatInfo!.CompanyAddress)
                .NotEmpty().WithMessage("Địa chỉ công ty trên hóa đơn không được để trống.")
                .MaximumLength(500).WithMessage("Địa chỉ công ty tối đa 500 ký tự.");

            RuleFor(x => x.VatInfo!.Email)
                .NotEmpty().WithMessage("Email nhận hóa đơn VAT không được để trống.")
                .EmailAddress().WithMessage("Email nhận hóa đơn VAT không đúng định dạng.");
        });
    }
}
