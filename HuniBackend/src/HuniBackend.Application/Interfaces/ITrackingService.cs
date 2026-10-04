namespace HuniBackend.Application.Interfaces;

public interface ITrackingService
{
    Task<object?> TrackOrderAsync(string code);
}
