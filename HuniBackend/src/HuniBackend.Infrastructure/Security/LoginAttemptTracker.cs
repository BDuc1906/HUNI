using System;
using System.Collections.Concurrent;
using HuniBackend.Application.Interfaces;

namespace HuniBackend.Infrastructure.Security;

public class LoginAttemptTracker : ILoginAttemptTracker
{
    private static readonly ConcurrentDictionary<string, (int count, DateTime lockedUntil)> _attempts = new();
    private const int MaxAttempts = 5;
    private readonly TimeSpan _lockoutDuration;

    public LoginAttemptTracker(TimeSpan? lockoutDuration = null)
    {
        _lockoutDuration = lockoutDuration ?? TimeSpan.FromMinutes(15);
    }

    public bool IsLocked(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        var key = email.Trim().ToLowerInvariant();
        if (_attempts.TryGetValue(key, out var data))
        {
            if (data.count >= MaxAttempts && DateTime.UtcNow < data.lockedUntil)
            {
                return true;
            }
            if (data.count >= MaxAttempts && DateTime.UtcNow >= data.lockedUntil)
            {
                _attempts.TryRemove(key, out _);
            }
        }
        return false;
    }

    public void RecordFailure(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return;
        var key = email.Trim().ToLowerInvariant();
        _attempts.AddOrUpdate(
            key,
            _ => (1, DateTime.MinValue),
            (_, old) =>
            {
                var count = old.count + 1;
                var locked = count >= MaxAttempts ? DateTime.UtcNow.Add(_lockoutDuration) : old.lockedUntil;
                return (count, locked);
            }
        );
    }

    public void Reset(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return;
        _attempts.TryRemove(email.Trim().ToLowerInvariant(), out _);
    }

    public bool IsLockedOut(string key) => IsLocked(key);
    public void RecordFailedAttempt(string key) => RecordFailure(key);
    public void ResetAttempts(string key) => Reset(key);
    public int GetFailedAttempts(string key)
    {
        if (string.IsNullOrWhiteSpace(key)) return 0;
        var normalizedKey = key.Trim().ToLowerInvariant();
        return _attempts.TryGetValue(normalizedKey, out var data) ? data.count : 0;
    }
}
