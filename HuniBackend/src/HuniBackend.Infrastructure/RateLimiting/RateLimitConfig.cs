using AspNetCoreRateLimit;

namespace HuniBackend.Infrastructure.RateLimiting;

public static class RateLimitConfig
{
    public static void ConfigureIpRateLimitOptions(IpRateLimitOptions options)
    {
        options.EnableEndpointRateLimiting = true;
        options.StackBlockedRequests = false;
        options.HttpStatusCode = 429;
        options.RealIpHeader = "X-Real-IP";
        options.ClientIdHeader = "X-ClientId";

        options.GeneralRules =
        [
            // 1. Auth endpoints: 10 req/5 phút/IP
            new RateLimitRule
            {
                Endpoint = "*:/api/auth/*",
                Period = "5m",
                Limit = 10
            },
            // 2. Orders: 5 req/giờ/IP
            new RateLimitRule
            {
                Endpoint = "post:/api/orders",
                Period = "1h",
                Limit = 5
            },
            // 3. Global: 200 req/phút/IP
            new RateLimitRule
            {
                Endpoint = "*",
                Period = "1m",
                Limit = 200
            }
        ];
    }
}
