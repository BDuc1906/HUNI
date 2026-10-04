namespace HuniBackend.Application.DTOs.Quotes;

public record CreateQuoteRequest(
    string FullName,
    string Phone,
    string? Email = null,
    string? Company = null,
    string Category = "",
    int Quantity = 0,
    int? EstimatedPrice = null,
    string? Notes = null
);

public record CreateQuoteResponse(
    bool Success,
    string Message,
    string QuoteId
);
