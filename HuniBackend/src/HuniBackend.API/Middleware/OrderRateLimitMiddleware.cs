using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;

namespace HuniBackend.API.Middleware;

public class OrderRateLimitMiddleware(RequestDelegate next, IConfiguration config)
{
    private static readonly ConcurrentDictionary<string, List<DateTime>> RequestTracker = new();

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.Equals("/api/orders", StringComparison.OrdinalIgnoreCase) &&
            context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
        {
            var ip = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                     ?? context.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrWhiteSpace(ip) || ip == "::1")
            {
                ip = "127.0.0.1";
            }

            var maxOrdersPerHour = config.GetValue<int>("RateLimit:OrdersPerHour", 5);
            var now = DateTime.UtcNow;
            var windowStart = now.AddHours(-1);

            var timestamps = RequestTracker.GetOrAdd(ip, _ => []);

            bool isBlocked = false;
            int retryAfterSeconds = 0;
            int remainingMinutes = 0;

            lock (timestamps)
            {
                timestamps.RemoveAll(t => t < windowStart);

                if (timestamps.Count >= maxOrdersPerHour)
                {
                    var oldest = timestamps.Min();
                    retryAfterSeconds = (int)Math.Max(1, Math.Ceiling((oldest.AddHours(1) - now).TotalSeconds));
                    remainingMinutes = (int)Math.Max(1, Math.Ceiling(retryAfterSeconds / 60.0));
                    isBlocked = true;
                }
                else
                {
                    timestamps.Add(now);
                    var remaining = Math.Max(0, maxOrdersPerHour - timestamps.Count);
                    context.Items["OrderRateLimitRemaining"] = remaining;
                }
            }

            if (isBlocked)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                context.Response.Headers["Retry-After"] = retryAfterSeconds.ToString();

                var errorResponse = new
                {
                    success = false,
                    error = $"Bạn đã gửi quá nhiều đơn hàng. Vui lòng thử lại sau {remainingMinutes} phút."
                };

                var json = JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(json);
                return;
            }
        }

        await next(context);
    }

    public static int GetRemaining(string ip, int maxOrdersPerHour = 5)
    {
        if (string.IsNullOrWhiteSpace(ip) || ip == "::1") ip = "127.0.0.1";
        if (RequestTracker.TryGetValue(ip, out var timestamps))
        {
            lock (timestamps)
            {
                var windowStart = DateTime.UtcNow.AddHours(-1);
                timestamps.RemoveAll(t => t < windowStart);
                return Math.Max(0, maxOrdersPerHour - timestamps.Count);
            }
        }
        return maxOrdersPerHour;
    }

    public static void Reset(string? ip = null)
    {
        if (ip != null)
        {
            RequestTracker.TryRemove(ip, out _);
        }
        else
        {
            RequestTracker.Clear();
        }
    }
}
