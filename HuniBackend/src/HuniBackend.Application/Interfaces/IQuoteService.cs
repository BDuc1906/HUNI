using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Quotes;
using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Interfaces;

public interface IQuoteService
{
    Task<(bool Success, string? Error, List<ValidationError>? ValidationErrors, string? QuoteId)> CreateQuoteAsync(CreateQuoteRequest request, string? ipAddress = null);
    Task<Quote?> GetQuoteByIdAsync(string id);
}
