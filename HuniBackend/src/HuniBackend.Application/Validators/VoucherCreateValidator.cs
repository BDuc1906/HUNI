using FluentValidation;
using HuniBackend.Application.DTOs.Vouchers;

namespace HuniBackend.Application.Validators;

public class VoucherCreateValidator : AbstractValidator<CreateVoucherRequest>
{
    public VoucherCreateValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã voucher không được để trống.")
            .MinimumLength(2).WithMessage("Mã voucher phải từ 2 ký tự trở lên.")
            .MaximumLength(50).WithMessage("Mã voucher tối đa 50 ký tự.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Loại voucher không được để trống.")
            .Must(t => t != null && (t.Equals("percentage", StringComparison.OrdinalIgnoreCase) || t.Equals("fixed", StringComparison.OrdinalIgnoreCase)))
            .WithMessage("Loại voucher phải là 'percentage' hoặc 'fixed'.");

        RuleFor(x => x.Discount)
            .GreaterThanOrEqualTo(1).WithMessage("Mức giảm giá phải lớn hơn hoặc bằng 1.");

        RuleFor(x => x.MinOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0.");

        When(x => x.UsageLimit.HasValue, () =>
        {
            RuleFor(x => x.UsageLimit!.Value)
                .GreaterThanOrEqualTo(1).WithMessage("Giới hạn sử dụng phải lớn hơn hoặc bằng 1.");
        });

        When(x => x.MaxDiscount.HasValue, () =>
        {
            RuleFor(x => x.MaxDiscount!.Value)
                .GreaterThanOrEqualTo(0).WithMessage("Giảm giá tối đa phải lớn hơn hoặc bằng 0.");
        });
    }
}
