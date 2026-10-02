using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;
using HuniBackend.Application.DTOs;

namespace HuniBackend.API.Middleware;

public class OrderRateLimitMiddleware(RequestDelegate next, IConfiguration config)
{
    private static readonly ConcurrentDictionary<string, List<DateTime>> _requestTracker = new();

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/orders") &&
            context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var maxOrdersPerHour = config.GetValue<int>("RateLimit:OrdersPerHour", 5);

            var now = DateTime.UtcNow;
            var windowStart = now.AddHours(-1);

            var timestamps = _requestTracker.GetOrAdd(ip, _ => []);

            lock (timestamps)
            {
                timestamps.RemoveAll(t => t < windowStart);

                if (timestamps.Count >= maxOrdersPerHour)
                {
                    context.Response.ContentType = "application/json";
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;

                    var response = new ApiResponse<object>(
                        Success: false,
                        Error: "Bạn đã tạo quá nhiều đơn hàng trong thời gian ngắn. Vui lòng thử lại sau 1 giờ."
                    );

                    var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    context.Response.WriteAsync(json).Wait();
                    return;
                }

                timestamps.Add(now);
            }
        }

        await next(context);
    }
}
