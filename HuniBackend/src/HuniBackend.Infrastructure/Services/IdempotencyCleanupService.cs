using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HuniBackend.Infrastructure.Services;

public class IdempotencyCleanupService(
    IServiceScopeFactory factory,
    ILogger<IdempotencyCleanupService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                using var scope = factory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var deleted = await db.IdempotencyRecords
                    .Where(r => r.ExpiresAt < DateTime.UtcNow)
                    .ExecuteDeleteAsync(ct);

                if (deleted > 0)
                    logger.LogInformation("Idempotency cleanup: removed {Count} expired records", deleted);
            }
            catch (Exception ex)
            {
                logger.LogWarning("Idempotency cleanup error: {Msg}", ex.Message);
            }

            await Task.Delay(TimeSpan.FromHours(6), ct);
        }
    }
}
