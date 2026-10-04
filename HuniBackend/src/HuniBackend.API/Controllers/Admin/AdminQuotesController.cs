using HuniBackend.Domain.Enums;
using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/quotes")]
public class AdminQuotesController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetQuotes(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Quotes.AsNoTracking().Include(q => q.Customer).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            if (Enum.TryParse<QuoteStatus>(status, true, out var st))
            {
                query = query.Where(q => q.Status == st);
            }
            else
            {
                return ApiBadRequest("Trạng thái báo giá không hợp lệ.");
            }
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(q => q.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(q => q.FullName.ToLower().Contains(s) ||
                                     q.Phone.Contains(s) ||
                                     (q.Email != null && q.Email.ToLower().Contains(s)) ||
                                     (q.Company != null && q.Company.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var quotes = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync();

        return ApiOk(new
        {
            quotes,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit)
        });
    }

    public record AdminUpdateQuoteRequest(string? Status, int? EstimatedPrice, string? Notes);

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateQuote(string id, [FromBody] AdminUpdateQuoteRequest request)
    {
        var quote = await db.Quotes.Include(q => q.Customer).FirstOrDefaultAsync(q => q.Id == id);
        if (quote == null)
        {
            return ApiNotFound("Không tìm thấy yêu cầu báo giá");
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (Enum.TryParse<QuoteStatus>(request.Status, true, out var st))
            {
                quote.Status = st;
            }
            else
            {
                return ApiBadRequest("Trạng thái báo giá không hợp lệ.");
            }
        }

        if (request.EstimatedPrice.HasValue)
        {
            if (request.EstimatedPrice.Value < 0)
            {
                return ApiBadRequest("Giá dự toán phải lớn hơn hoặc bằng 0.");
            }
            quote.EstimatedPrice = request.EstimatedPrice.Value;
        }

        if (request.Notes != null)
        {
            if (request.Notes.Length > 500)
            {
                return ApiBadRequest("Ghi chú tối đa 500 ký tự.");
            }
            quote.Notes = request.Notes;
        }

        quote.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ApiOk(quote, "Cập nhật trạng thái báo giá thành công");
    }
}
