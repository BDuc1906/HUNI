using System;
using System.Collections.Generic;
using System.Linq;

namespace HuniBackend.Infrastructure.InMemory;

public class AdminReturnItem
{
    public string Id { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string? Company { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public string ProductTitle { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public string Type { get; set; } = "EXCHANGE"; // EXCHANGE, REFUND
    public string Reason { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public int RefundAmount { get; set; } = 0;
    public object? BankInfo { get; set; }
    public string[] EvidenceImages { get; set; } = [];
    public string Status { get; set; } = "PENDING"; // PENDING, PROCESSING, EXCHANGED, REFUNDED, REJECTED
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public static class AdminReturnStore
{
    private static readonly object _lock = new();
    private static readonly List<AdminReturnItem> _returns =
    [
        new AdminReturnItem
        {
            Id = "RT-261001-001",
            OrderNumber = "HN-260930-1001",
            CustomerName = "Nguyễn Văn Hưng",
            CustomerPhone = "0912.345.678",
            CustomerEmail = "hung.nv@techcorp.vn",
            Company = "TechCorp Việt Nam",
            ProductId = "polo-doanh-nghiep-hdc-pro",
            ProductTitle = "Áo Polo Doanh Nghiệp HDC Classic",
            Quantity = 5,
            Type = "EXCHANGE",
            Reason = "Sai kích thước / form áo chật hơn bảng size",
            Details = "Có 5 nhân viên phòng kinh doanh mặc size L bị kích bắp tay, xin hỗ trợ đổi sang size XL. Áo còn nguyên tem mác chưa giặt.",
            RefundAmount = 0,
            BankInfo = null,
            EvidenceImages = ["/images/06_polo_01.jpg"],
            Status = "PROCESSING",
            AdminNotes = "Đã liên hệ anh Hưng, nhân viên kho đã chuẩn bị 5 áo size XL gửi shipper đi đổi chiều nay.",
            CreatedAt = DateTime.Parse("2026-10-01T08:30:00.000Z").ToUniversalTime(),
            UpdatedAt = DateTime.Parse("2026-10-01T10:15:00.000Z").ToUniversalTime()
        },
        new AdminReturnItem
        {
            Id = "RT-261001-002",
            OrderNumber = "HN-260929-2042",
            CustomerName = "Trần Thị Bích Mai",
            CustomerPhone = "0988.765.432",
            CustomerEmail = "bichmai.hr@vingroup.com",
            Company = "Vingroup HR Hub",
            ProductId = "hdc-shirt-short-1",
            ProductTitle = "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
            Quantity = 2,
            Type = "REFUND",
            Reason = "Lỗi đường chỉ may cổ áo",
            Details = "2 áo bị bung chỉ viền mép cổ áo sau khi bóc hộp kiểm tra. Nhân sự đã đủ số lượng nên công ty xin hoàn lại tiền 2 áo này.",
            RefundAmount = 470000,
            BankInfo = new
            {
                bankName = "Vietcombank (VCB)",
                accountNumber = "10188992288",
                accountHolder = "TRAN THI BICH MAI"
            },
            EvidenceImages = ["/images/05_bestseller_shirts_01.jpg"],
            Status = "PENDING",
            AdminNotes = "Cần kiểm tra xác nhận thu hồi 2 áo lỗi trước khi chuyển khoản hoàn tiền.",
            CreatedAt = DateTime.Parse("2026-10-01T09:45:00.000Z").ToUniversalTime(),
            UpdatedAt = DateTime.Parse("2026-10-01T09:45:00.000Z").ToUniversalTime()
        },
        new AdminReturnItem
        {
            Id = "RT-260930-003",
            OrderNumber = "HN-260925-8812",
            CustomerName = "Lê Hoàng Nam",
            CustomerPhone = "0903.222.111",
            CustomerEmail = "namlh@fptretail.vn",
            Company = "FPT Retail Corp",
            ProductId = "vest-doanh-nhan-bespoke",
            ProductTitle = "Áo Vest Nam Doanh Nhân Bespoke",
            Quantity = 1,
            Type = "EXCHANGE",
            Reason = "Chiều dài tay áo dài hơn số đo",
            Details = "Tay áo dài phủ quá mu bàn tay 2cm, cần hạ gấu tay áo để vừa vặn khi kết hợp cùng sơ mi cufflink.",
            RefundAmount = 0,
            BankInfo = null,
            EvidenceImages = ["/images/04_categories_suit.jpg"],
            Status = "EXCHANGED",
            AdminNotes = "Thợ may trưởng đã chỉnh sửa hạ tay áo 2cm và gửi lại cho anh Nam, khách rất hài lòng.",
            CreatedAt = DateTime.Parse("2026-09-30T14:20:00.000Z").ToUniversalTime(),
            UpdatedAt = DateTime.Parse("2026-10-01T08:00:00.000Z").ToUniversalTime()
        },
        new AdminReturnItem
        {
            Id = "RT-260929-004",
            OrderNumber = "HN-260922-4411",
            CustomerName = "Đặng Thị Thảo",
            CustomerPhone = "0977.112.233",
            CustomerEmail = "thao.dang@misa.vn",
            Company = "MISA JSC",
            ProductId = "dong-phuc-golf-premium",
            ProductTitle = "Áo Thun Thể Thao Golf HDC Swift",
            Quantity = 10,
            Type = "REFUND",
            Reason = "Huỷ đơn hàng sự kiện do bão hoãn tổ chức",
            Details = "Sự kiện chạy bộ bị huỷ do thời tiết, khách hàng yêu cầu hoàn lại tiền toàn bộ áo.",
            RefundAmount = 1850000,
            BankInfo = new
            {
                bankName = "Techcombank",
                accountNumber = "19033445566778",
                accountHolder = "DANG THI THAO"
            },
            EvidenceImages = [],
            Status = "REJECTED",
            AdminNotes = "Từ chối vì áo đã in logo độc quyền của sự kiện MISA Run 2026 theo điều khoản chính sách bảo hành.",
            CreatedAt = DateTime.Parse("2026-09-29T11:10:00.000Z").ToUniversalTime(),
            UpdatedAt = DateTime.Parse("2026-09-29T15:30:00.000Z").ToUniversalTime()
        },
        new AdminReturnItem
        {
            Id = "RT-260928-005",
            OrderNumber = "HN-260920-9900",
            CustomerName = "Phạm Quốc Dũng",
            CustomerPhone = "0966.554.433",
            CustomerEmail = "dung.pq@vinamilk.com.vn",
            Company = "Vinamilk Logistics",
            ProductId = "hdc-shirt-short-2",
            ProductTitle = "Sơ Mi Ngắn Tay HDC Caro Xanh",
            Quantity = 3,
            Type = "REFUND",
            Reason = "Giao sai mẫu áo caro so với mẫu duyệt",
            Details = "Giao nhầm 3 áo sơ mi caro xanh nhạt thay vì xanh đậm, xin hoàn tiền vào tài khoản.",
            RefundAmount = 735000,
            BankInfo = new
            {
                bankName = "MB Bank (Quân Đội)",
                accountNumber = "068899998888",
                accountHolder = "PHAM QUOC DUNG"
            },
            EvidenceImages = ["/images/05_bestseller_shirts_02.jpg"],
            Status = "REFUNDED",
            AdminNotes = "Đã thu hồi 3 áo và thực hiện ủy nhiệm chi chuyển khoản 735.000đ ngày 30/09.",
            CreatedAt = DateTime.Parse("2026-09-28T16:00:00.000Z").ToUniversalTime(),
            UpdatedAt = DateTime.Parse("2026-09-30T17:00:00.000Z").ToUniversalTime()
        }
    ];

    public static List<AdminReturnItem> GetAll()
    {
        lock (_lock)
        {
            return _returns.Select(r => new AdminReturnItem
            {
                Id = r.Id,
                OrderNumber = r.OrderNumber,
                CustomerName = r.CustomerName,
                CustomerPhone = r.CustomerPhone,
                CustomerEmail = r.CustomerEmail,
                Company = r.Company,
                ProductId = r.ProductId,
                ProductTitle = r.ProductTitle,
                Quantity = r.Quantity,
                Type = r.Type,
                Reason = r.Reason,
                Details = r.Details,
                RefundAmount = r.RefundAmount,
                BankInfo = r.BankInfo,
                EvidenceImages = r.EvidenceImages,
                Status = r.Status,
                AdminNotes = r.AdminNotes,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            }).ToList();
        }
    }

    public static AdminReturnItem? FindById(string id)
    {
        lock (_lock)
        {
            return _returns.FirstOrDefault(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        }
    }

    public static AdminReturnItem? Update(string id, string? status, string? adminNotes, int? refundAmount)
    {
        lock (_lock)
        {
            var item = _returns.FirstOrDefault(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (item == null) return null;

            if (!string.IsNullOrWhiteSpace(status))
            {
                item.Status = status.ToUpperInvariant();
            }

            if (adminNotes != null)
            {
                item.AdminNotes = adminNotes;
            }

            if (refundAmount.HasValue)
            {
                item.RefundAmount = refundAmount.Value;
            }

            item.UpdatedAt = DateTime.UtcNow;
            return item;
        }
    }

    public static int Delete(IEnumerable<string> ids)
    {
        lock (_lock)
        {
            var idSet = ids.ToHashSet(StringComparer.OrdinalIgnoreCase);
            return _returns.RemoveAll(r => idSet.Contains(r.Id));
        }
    }
}
