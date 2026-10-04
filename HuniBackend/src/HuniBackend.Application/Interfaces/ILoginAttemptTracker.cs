namespace HuniBackend.Application.Interfaces;

public interface ILoginAttemptTracker
{
    bool IsLocked(string email);
    void RecordFailure(string email);
    void Reset(string email);

    bool IsLockedOut(string key);
    void RecordFailedAttempt(string key);
    void ResetAttempts(string key);
    int GetFailedAttempts(string key);
}
