using FluentValidation;
using HuniBackend.Application.DTOs.Products;

namespace HuniBackend.Application.Validators;

public class ProductCreateValidator : AbstractValidator<CreateProductRequest>
{
    public ProductCreateValidator()
    {
        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Đường dẫn (slug) không được để trống.")
            .MinimumLength(2).WithMessage("Slug phải từ 2 ký tự trở lên.")
            .MaximumLength(200).WithMessage("Slug tối đa 200 ký tự.");

        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("Mã SKU không được để trống.")
            .MinimumLength(2).WithMessage("Mã SKU phải từ 2 ký tự trở lên.")
            .MaximumLength(50).WithMessage("Mã SKU tối đa 50 ký tự.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề sản phẩm không được để trống.")
            .MinimumLength(2).WithMessage("Tiêu đề sản phẩm phải từ 2 ký tự trở lên.")
            .MaximumLength(200).WithMessage("Tiêu đề sản phẩm tối đa 200 ký tự.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Mô tả sản phẩm không được để trống.")
            .MinimumLength(5).WithMessage("Mô tả sản phẩm phải từ 5 ký tự trở lên.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Danh mục sản phẩm không được để trống.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Giá sản phẩm phải lớn hơn hoặc bằng 0.");

        RuleFor(x => x.Images)
            .NotNull().WithMessage("Sản phẩm phải có ít nhất 1 hình ảnh.")
            .Must(imgs => imgs != null && imgs.Length > 0).WithMessage("Sản phẩm phải có ít nhất 1 hình ảnh.");
    }
}
