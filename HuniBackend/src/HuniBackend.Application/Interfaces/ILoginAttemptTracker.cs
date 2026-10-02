namespace HuniBackend.Application.Interfaces;

public interface ILoginAttemptTracker
{
    bool IsLockedOut(string key);
    void RecordFailedAttempt(string key);
    void ResetAttempts(string key);
}
