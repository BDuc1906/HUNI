using FluentValidation;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs.Quotes;

namespace HuniBackend.Application.Validators;

public class CreateQuoteValidator : AbstractValidator<CreateQuoteRequest>
{
    private static readonly HashSet<string> AllowedCategories =
        new(StringComparer.OrdinalIgnoreCase) { "polo", "shirt", "suit", "golf", "school", "accessories" };

    public CreateQuoteValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MinimumLength(2).WithMessage("Họ và tên phải có ít nhất 2 ký tự.")
            .MaximumLength(100).WithMessage("Họ và tên tối đa 100 ký tự.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Số điện thoại không được để trống.")
            .Must(PhoneNormalizer.IsValidPhone)
            .WithMessage("Số điện thoại không hợp lệ (phải gồm 10-11 chữ số).");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Địa chỉ email không đúng định dạng.")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Company)
            .MaximumLength(200).WithMessage("Tên công ty tối đa 200 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.Company));

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Danh mục sản phẩm không được để trống.")
            .Must(c => AllowedCategories.Contains(c?.Trim() ?? string.Empty))
            .WithMessage("Danh mục phải thuộc: polo, shirt, suit, golf, school, accessories.");

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(10).WithMessage("Số lượng yêu cầu báo giá tối thiểu từ 10 sản phẩm.");

        RuleFor(x => x.EstimatedPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Ngân sách dự kiến không được âm.")
            .When(x => x.EstimatedPrice.HasValue);

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Ghi chú yêu cầu báo giá tối đa 500 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}
