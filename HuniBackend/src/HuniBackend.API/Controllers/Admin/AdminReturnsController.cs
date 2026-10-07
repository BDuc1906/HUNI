using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/returns")]
public class AdminReturnsController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetReturns(
        [FromQuery] string? search,
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.ReturnRequests.Include(r => r.Product).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all" && Enum.TryParse<ReturnStatus>(status, true, out var st))
        {
            query = query.Where(r => r.Status == st);
        }

        if (!string.IsNullOrWhiteSpace(type) && type.ToLower() != "all" && Enum.TryParse<ReturnType>(type, true, out var tp))
        {
            query = query.Where(r => r.Type == tp);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.Id.ToLower().Contains(s) ||
                                     r.OrderNumber.ToLower().Contains(s) ||
                                     r.CustomerName.ToLower().Contains(s) ||
                                     r.CustomerPhone.Contains(s) ||
                                     (r.CustomerEmail != null && r.CustomerEmail.ToLower().Contains(s)) ||
                                     (r.Company != null && r.Company.ToLower().Contains(s)) ||
                                     r.Reason.ToLower().Contains(s) ||
                                     r.ProductTitle.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var returnsList = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        var totalRequests = await db.ReturnRequests.CountAsync();
        var pendingCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.PENDING);
        var processingCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.PROCESSING);
        var completedCount = await db.ReturnRequests.CountAsync(r => r.Status == ReturnStatus.EXCHANGED || r.Status == ReturnStatus.REFUNDED);
        var totalRefunded = await db.ReturnRequests.Where(r => r.Status == ReturnStatus.REFUNDED).SumAsync(r => (long)r.RefundAmount);

        return ApiOk(new
        {
            returns = returnsList,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit),
            stats = new
            {
                totalRequests,
                pendingCount,
                processingCount,
                completedCount,
                totalRefunded
            }
        });
    }

    public record AdminUpdateReturnRequest(string? Id, string? Status, string? AdminNotes, int? RefundAmount);

    [HttpPatch]
    public async Task<IActionResult> UpdateReturn([FromBody] AdminUpdateReturnRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ApiBadRequest("Thiếu mã yêu cầu đổi trả");
        }

        var ret = await db.ReturnRequests.FirstOrDefaultAsync(r => r.Id == request.Id);
        if (ret == null)
        {
            return ApiNotFound("Không tìm thấy yêu cầu đổi trả");
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ReturnStatus>(request.Status, true, out var st))
        {
            ret.Status = st;
        }

        if (request.AdminNotes != null)
        {
            ret.AdminNotes = request.AdminNotes;
        }

        if (request.RefundAmount.HasValue)
        {
            ret.RefundAmount = request.RefundAmount.Value;
        }

        ret.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(ret, "Cập nhật yêu cầu đổi trả thành công");
    }

    public record AdminDeleteReturnRequest(string? Id, List<string>? Ids);

    [HttpDelete]
    public async Task<IActionResult> DeleteReturns([FromBody] AdminDeleteReturnRequest request)
    {
        var targetIds = new List<string>();
        if (!string.IsNullOrWhiteSpace(request.Id)) targetIds.Add(request.Id);
        if (request.Ids != null) targetIds.AddRange(request.Ids);

        if (targetIds.Count == 0)
        {
            return ApiBadRequest("Không có danh sách ID cần xoá");
        }

        var toDeleteDb = await db.ReturnRequests.Where(r => targetIds.Contains(r.Id)).ToListAsync();
        if (toDeleteDb.Count > 0)
        {
            db.ReturnRequests.RemoveRange(toDeleteDb);
            await db.SaveChangesAsync();
        }

        return Ok(new
        {
            success = true,
            deletedCount = toDeleteDb.Count,
            data = new
            {
                deletedCount = toDeleteDb.Count
            },
            message = $"Đã xoá {toDeleteDb.Count} yêu cầu đổi trả thành công"
        });
    }
}
