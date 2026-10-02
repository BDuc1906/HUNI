namespace HuniBackend.Domain.Common;

public static class CuidGenerator
{
    private static readonly Random _random = new();

    public static string NewCuid()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = _random.NextInt64(0, 0xFFFFFFF).ToString("x7");
        return $"c{timestamp:x}{random}";
    }
}
