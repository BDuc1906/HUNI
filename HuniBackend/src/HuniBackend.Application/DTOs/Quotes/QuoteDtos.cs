namespace HuniBackend.Application.DTOs.Quotes;

public record CreateQuoteRequest(
    string FullName,
    string Phone,
    string? Email,
    string? Company,
    string Category,
    int Quantity,
    int? EstimatedPrice,
    string? Notes
);

public record CreateQuoteResponse(
    bool Success,
    string Message,
    string QuoteId
);
