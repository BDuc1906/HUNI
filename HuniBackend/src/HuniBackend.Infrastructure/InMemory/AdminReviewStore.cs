using System;
using System.Collections.Generic;
using System.Linq;

namespace HuniBackend.Infrastructure.InMemory;

public class AdminReviewItem
{
    public string Id { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string? Avatar { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public string ProductTitle { get; set; } = string.Empty;
    public string ProductSku { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public short Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "APPROVED"; // APPROVED, PENDING, HIDDEN
    public string? AdminReply { get; set; }
    public DateTime? RepliedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public static class AdminReviewStore
{
    private static readonly object _lock = new();
    private static readonly List<AdminReviewItem> _reviews =
    [
        new AdminReviewItem
        {
            Id = "rev-001",
            CustomerName = "Nguyễn Văn Hưng",
            CustomerEmail = "hung.nv@techcorp.vn",
            CustomerPhone = "0912.345.678",
            Avatar = null,
            ProductId = "polo-doanh-nghiep-hdc-pro",
            ProductTitle = "Áo Polo Doanh Nghiệp HDC Classic",
            ProductSku = "HDC-POLO-CORP-01",
            ProductImage = "/images/06_polo_01.jpg",
            Rating = 5,
            Content = "Chất vải polo cá sấu compact rất mát và co giãn tốt. Đặt 120 áo cho toàn bộ nhân sự công ty, form áo lên chuẩn, thêu logo nét căng. Giao hàng đúng tiến độ sự kiện.",
            Status = "APPROVED",
            AdminReply = "Dạ HDC Fashion chân thành cảm ơn anh Hưng và tập thể TechCorp đã tin tưởng đặt may đồng phục! Chúc công ty ngày càng phát triển thịnh vượng ạ!",
            RepliedAt = DateTime.Parse("2026-09-28T10:30:00.000Z").ToUniversalTime(),
            CreatedAt = DateTime.Parse("2026-09-27T14:20:00.000Z").ToUniversalTime()
        },
        new AdminReviewItem
        {
            Id = "rev-002",
            CustomerName = "Trần Thị Bích Mai",
            CustomerEmail = "bichmai.hr@vingroup.com",
            CustomerPhone = "0988.765.432",
            Avatar = null,
            ProductId = "hdc-shirt-short-1",
            ProductTitle = "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
            ProductSku = "HDC-SHIRT-SHORT-01",
            ProductImage = "/images/05_bestseller_shirts_01.jpg",
            Rating = 5,
            Content = "Vải Kate Ý chống nhăn cực kỳ tiện lợi, giặt máy không lo nhăn nhúm. Form Regular fit vừa vặn cả các bạn nam lẫn các anh quản lý. Dịch vụ may áo mẫu 0đ rất chuyên nghiệp.",
            Status = "APPROVED",
            AdminReply = null,
            RepliedAt = null,
            CreatedAt = DateTime.Parse("2026-09-28T09:15:00.000Z").ToUniversalTime()
        },
        new AdminReviewItem
        {
            Id = "rev-003",
            CustomerName = "Lê Hoàng Nam",
            CustomerEmail = "namlh@fptretail.vn",
            CustomerPhone = "0903.222.111",
            Avatar = null,
            ProductId = "vest-doanh-nhan-bespoke",
            ProductTitle = "Áo Vest Nam Doanh Nhân Bespoke",
            ProductSku = "HDC-SUIT-BESPOKE-01",
            ProductImage = "/images/04_categories_suit.jpg",
            Rating = 4,
            Content = "Bộ vest may đo bespoke rất đứng dáng, đệm vai và lót lụa cao cấp. Chỉ có khuy áo giao hơi chậm hơn dự kiến 1 ngày nhưng hỗ trợ tận tình.",
            Status = "PENDING",
            AdminReply = null,
            RepliedAt = null,
            CreatedAt = DateTime.Parse("2026-09-29T16:45:00.000Z").ToUniversalTime()
        },
        new AdminReviewItem
        {
            Id = "rev-004",
            CustomerName = "Phạm Minh Tuấn",
            CustomerEmail = "tuan.pm@sunhouse.com.vn",
            CustomerPhone = "0915.889.900",
            Avatar = null,
            ProductId = "dong-phuc-golf-premium",
            ProductTitle = "Áo Thun Thể Thao Golf HDC Swift",
            ProductSku = "HDC-GOLF-SWIFT-01",
            ProductImage = "/images/03_features_02.jpg",
            Rating = 5,
            Content = "Đặt 50 áo cho câu lạc bộ Golf công ty, chất vải thể thao co giãn 4 chiều xịn sò, thoáng khí tuyệt vời. Đánh 18 hố không thấy bí rít.",
            Status = "APPROVED",
            AdminReply = "Dạ cảm ơn anh Tuấn đã phản hồi tích cực! HDC rất vinh dự được đồng hành cùng giải Golf của quý tập đoàn.",
            RepliedAt = DateTime.Parse("2026-09-30T11:00:00.000Z").ToUniversalTime(),
            CreatedAt = DateTime.Parse("2026-09-30T08:00:00.000Z").ToUniversalTime()
        },
        new AdminReviewItem
        {
            Id = "rev-005",
            CustomerName = "Vũ Đình Trọng",
            CustomerEmail = "trong.vu@gmail.com",
            CustomerPhone = "0934.567.890",
            Avatar = null,
            ProductId = "hdc-shirt-short-2",
            ProductTitle = "Sơ Mi Ngắn Tay HDC Caro Xanh",
            ProductSku = "HDC-SHIRT-SHORT-02",
            ProductImage = "/images/05_bestseller_shirts_02.jpg",
            Rating = 3,
            Content = "Chất vải mát nhưng size L hơi kích ngực một chút so với bảng size chuẩn. Đã liên hệ bộ phận CSKH để xin đổi sang size XL.",
            Status = "PENDING",
            AdminReply = null,
            RepliedAt = null,
            CreatedAt = DateTime.Parse("2026-10-01T07:15:00.000Z").ToUniversalTime()
        }
    ];

    public static List<AdminReviewItem> GetAll()
    {
        lock (_lock)
        {
            return _reviews.Select(r => new AdminReviewItem
            {
                Id = r.Id,
                CustomerName = r.CustomerName,
                CustomerEmail = r.CustomerEmail,
                CustomerPhone = r.CustomerPhone,
                Avatar = r.Avatar,
                ProductId = r.ProductId,
                ProductTitle = r.ProductTitle,
                ProductSku = r.ProductSku,
                ProductImage = r.ProductImage,
                Rating = r.Rating,
                Content = r.Content,
                Status = r.Status,
                AdminReply = r.AdminReply,
                RepliedAt = r.RepliedAt,
                CreatedAt = r.CreatedAt
            }).ToList();
        }
    }

    public static AdminReviewItem? FindById(string id)
    {
        lock (_lock)
        {
            return _reviews.FirstOrDefault(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        }
    }

    public static AdminReviewItem? Update(string id, string? status, string? adminReply)
    {
        lock (_lock)
        {
            var item = _reviews.FirstOrDefault(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (item == null) return null;

            if (!string.IsNullOrWhiteSpace(status))
            {
                item.Status = status.ToUpperInvariant();
            }

            if (adminReply != null)
            {
                item.AdminReply = adminReply;
                item.RepliedAt = DateTime.UtcNow;
            }

            return item;
        }
    }

    public static int Delete(IEnumerable<string> ids)
    {
        lock (_lock)
        {
            var idSet = ids.ToHashSet(StringComparer.OrdinalIgnoreCase);
            return _reviews.RemoveAll(r => idSet.Contains(r.Id));
        }
    }
}
