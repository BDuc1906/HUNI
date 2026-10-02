using System.Collections.Concurrent;
using HuniBackend.Application.Interfaces;

namespace HuniBackend.Infrastructure.Services;

public class LoginAttemptTracker : ILoginAttemptTracker
{
    private readonly ConcurrentDictionary<string, (int Count, DateTime LockoutUntil)> _attempts = new();
    private const int MaxAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);

    public bool IsLockedOut(string key)
    {
        if (_attempts.TryGetValue(key, out var record))
        {
            if (DateTime.UtcNow < record.LockoutUntil)
            {
                return true;
            }
            if (record.Count >= MaxAttempts && DateTime.UtcNow >= record.LockoutUntil)
            {
                _attempts.TryRemove(key, out _);
            }
        }
        return false;
    }

    public void RecordFailedAttempt(string key)
    {
        _attempts.AddOrUpdate(
            key,
            _ => (1, DateTime.MinValue),
            (_, old) =>
            {
                var newCount = old.Count + 1;
                var lockout = newCount >= MaxAttempts ? DateTime.UtcNow.Add(LockoutDuration) : old.LockoutUntil;
                return (newCount, lockout);
            }
        );
    }

    public void ResetAttempts(string key)
    {
        _attempts.TryRemove(key, out _);
    }
}
