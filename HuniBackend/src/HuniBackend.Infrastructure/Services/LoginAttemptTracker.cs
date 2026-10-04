namespace HuniBackend.Infrastructure.Services;

public class LoginAttemptTracker : HuniBackend.Infrastructure.Security.LoginAttemptTracker
{
    public LoginAttemptTracker(TimeSpan? lockoutDuration = null) : base(lockoutDuration) { }
}
