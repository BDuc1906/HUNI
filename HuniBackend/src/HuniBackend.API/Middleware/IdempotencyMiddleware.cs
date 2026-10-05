using HuniBackend.Domain.Entities;
using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.API.Middleware;

public class IdempotencyMiddleware(RequestDelegate next, ILogger<IdempotencyMiddleware> logger)
{
    // Chỉ áp dụng cho các endpoint này:
    private static readonly string[] _protectedPaths = ["/api/orders", "/api/quotes"];

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        var isProtected = context.Request.Method == "POST" &&
            _protectedPaths.Any(p => context.Request.Path.StartsWithSegments(p));

        if (!isProtected)
        {
            await next(context);
            return;
        }

        var key = context.Request.Headers["Idempotency-Key"].FirstOrDefault()?.Trim();
        if (string.IsNullOrEmpty(key) || key.Length > 128)
        {
            await next(context);
            return;
        }

        // Tìm request đã xử lý trước đó
        var existing = await db.IdempotencyRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Key == key && r.ExpiresAt > DateTime.UtcNow);

        if (existing != null)
        {
            logger.LogInformation(
                "Idempotency hit: key={Key} → returning cached {Status}",
                key, existing.StatusCode);

            context.Response.StatusCode = existing.StatusCode;
            context.Response.ContentType = "application/json";
            context.Response.Headers["X-Idempotent-Replayed"] = "true";
            await context.Response.WriteAsync(existing.ResponseBody);
            return;
        }

        // Chưa xử lý → chạy bình thường, capture response
        var originalBody = context.Response.Body;
        using var buffer = new MemoryStream();
        context.Response.Body = buffer;

        try
        {
            await next(context);
        }
        finally
        {
            context.Response.Body = originalBody;
        }

        buffer.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(buffer).ReadToEndAsync();

        // Chỉ cache khi thành công (201 Created)
        if (context.Response.StatusCode == 201)
        {
            try
            {
                db.IdempotencyRecords.Add(new IdempotencyRecord
                {
                    Key = key,
                    ResponseBody = responseBody,
                    StatusCode = context.Response.StatusCode,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });
                await db.SaveChangesAsync();
                logger.LogInformation("Idempotency saved: key={Key}", key);
            }
            catch (Exception ex)
            {
                // Không crash app nếu lưu idempotency thất bại
                logger.LogWarning("Could not save idempotency record: {Msg}", ex.Message);
            }
        }

        // Ghi response về client
        buffer.Seek(0, SeekOrigin.Begin);
        await buffer.CopyToAsync(originalBody);
    }
}
