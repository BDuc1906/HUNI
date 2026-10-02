using FluentAssertions;
using HuniBackend.Infrastructure.Services;
using Xunit;

namespace HuniBackend.UnitTests.Helpers;

public class LoginAttemptTrackerTests
{
    [Fact]
    public void IsLockedOut_FreshEmail_ReturnsFalse()
    {
        var tracker = new LoginAttemptTracker();
        tracker.IsLockedOut("user@test.com").Should().BeFalse();
    }

    [Fact]
    public void RecordFailedAttempt_4Times_NotLockedOut()
    {
        var tracker = new LoginAttemptTracker();
        for (int i = 0; i < 4; i++)
        {
            tracker.RecordFailedAttempt("user@test.com");
        }
        tracker.IsLockedOut("user@test.com").Should().BeFalse();
    }

    [Fact]
    public void RecordFailedAttempt_5Times_LocksAccount()
    {
        var tracker = new LoginAttemptTracker();
        for (int i = 0; i < 5; i++)
        {
            tracker.RecordFailedAttempt("user@test.com");
        }
        tracker.IsLockedOut("user@test.com").Should().BeTrue();
    }

    [Fact]
    public void IsLockedOut_After5Fails_ReturnsTrue()
    {
        var tracker = new LoginAttemptTracker();
        for (int i = 0; i < 6; i++)
        {
            tracker.RecordFailedAttempt("user@test.com");
        }
        tracker.IsLockedOut("user@test.com").Should().BeTrue();
    }

    [Fact]
    public void RecordSuccess_ClearsAttempts()
    {
        var tracker = new LoginAttemptTracker();
        for (int i = 0; i < 4; i++)
        {
            tracker.RecordFailedAttempt("user@test.com");
        }
        tracker.ResetAttempts("user@test.com");
        tracker.IsLockedOut("user@test.com").Should().BeFalse();

        // 1 more fail should not lock out
        tracker.RecordFailedAttempt("user@test.com");
        tracker.IsLockedOut("user@test.com").Should().BeFalse();
    }

    [Fact]
    public void IsLockedOut_AfterLockExpires_ReturnsFalse()
    {
        // Tracker with 1ms lockout duration
        var tracker = new LoginAttemptTracker(TimeSpan.FromMilliseconds(5));
        for (int i = 0; i < 5; i++)
        {
            tracker.RecordFailedAttempt("user@test.com");
        }

        Thread.Sleep(15);
        tracker.IsLockedOut("user@test.com").Should().BeFalse();
    }
}
