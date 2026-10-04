using FluentAssertions;
using HuniBackend.Infrastructure.Security;
using Xunit;

namespace HuniBackend.UnitTests.Security;

public class LoginAttemptTrackerTests
{
    [Fact]
    public void Tracker_LocksOutAfterMaxAttempts()
    {
        var tracker = new LoginAttemptTracker(TimeSpan.FromMinutes(15));
        var email = "attacker@example.com";

        for (int i = 0; i < 4; i++)
        {
            tracker.RecordFailure(email);
            tracker.IsLocked(email).Should().BeFalse();
        }

        tracker.RecordFailure(email); // 5th failure
        tracker.IsLocked(email).Should().BeTrue();
    }

    [Fact]
    public void Tracker_ResetClearsLockout()
    {
        var tracker = new LoginAttemptTracker(TimeSpan.FromMinutes(15));
        var email = "user@example.com";

        for (int i = 0; i < 5; i++)
        {
            tracker.RecordFailure(email);
        }

        tracker.IsLocked(email).Should().BeTrue();

        tracker.Reset(email);
        tracker.IsLocked(email).Should().BeFalse();
    }
}
