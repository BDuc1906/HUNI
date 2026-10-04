using HuniBackend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Controllers.Admin;

[Authorize(Roles = "ADMIN")]
[Route("api/admin/customers")]
public class AdminCustomersController(AppDbContext db) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetCustomers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 100);
        var safePage = Math.Max(1, page);

        var query = db.Customers.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(c => c.FullName.ToLower().Contains(s) ||
                                     c.Phone.Contains(s) ||
                                     (c.Email != null && c.Email.ToLower().Contains(s)) ||
                                     (c.Company != null && c.Company.ToLower().Contains(s)));
        }

        var total = await query.CountAsync();
        var customers = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .Select(c => new
            {
                c.Id,
                c.FullName,
                c.Phone,
                c.Email,
                c.Company,
                c.Address,
                c.TaxCode,
                c.Notes,
                orderCount = c.Orders.Count,
                quoteCount = c.Quotes.Count,
                c.CreatedAt,
                c.UpdatedAt
            })
            .ToListAsync();

        return ApiOk(new
        {
            customers,
            total,
            page = safePage,
            limit = safeLimit,
            totalPages = (int)Math.Ceiling((double)total / safeLimit)
        });
    }
}
