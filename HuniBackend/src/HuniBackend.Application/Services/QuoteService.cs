using FluentValidation;
using HuniBackend.Application.Common;
using HuniBackend.Application.DTOs;
using HuniBackend.Application.DTOs.Quotes;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Common;
using HuniBackend.Domain.Entities;
using HuniBackend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Services;

public class QuoteService(
    IAppDbContext db,
    IValidator<CreateQuoteRequest> validator,
    IMailService mailService) : IQuoteService
{
    public async Task<(bool Success, string? Error, List<ValidationError>? ValidationErrors, string? QuoteId)> CreateQuoteAsync(CreateQuoteRequest request)
    {
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors
                .Select(e => new ValidationError(e.PropertyName, e.ErrorMessage))
                .ToList();
            return (false, "Dữ liệu không hợp lệ", errors, null);
        }

        // Upsert customer theo SĐT
        var normalizedPhone = PhoneNormalizer.NormalizePhone(request.Phone);
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.Phone == normalizedPhone);

        if (customer == null)
        {
            customer = new Customer
            {
                Id = CuidGenerator.NewCuid(),
                FullName = request.FullName.Trim(),
                Phone = normalizedPhone,
                Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
                Company = string.IsNullOrWhiteSpace(request.Company) ? null : request.Company.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            db.Customers.Add(customer);
        }
        else
        {
            customer.FullName = request.FullName.Trim();
            if (!string.IsNullOrWhiteSpace(request.Email)) customer.Email = request.Email.Trim();
            if (!string.IsNullOrWhiteSpace(request.Company)) customer.Company = request.Company.Trim();
            customer.UpdatedAt = DateTime.UtcNow;
        }

        var quote = new Quote
        {
            Id = CuidGenerator.NewCuid(),
            CustomerId = customer.Id,
            Customer = customer,
            Category = request.Category.Trim().ToLowerInvariant(),
            Quantity = request.Quantity,
            EstimatedPrice = request.EstimatedPrice,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Status = QuoteStatus.NEW,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Quotes.Add(quote);
        await db.SaveChangesAsync();

        _ = Task.Run(async () =>
        {
            try
            {
                await mailService.SendQuoteNotificationAsync(quote);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Background Email Error] {ex.Message}");
            }
        });

        return (true, null, null, quote.Id);
    }

    public async Task<Quote?> GetQuoteByIdAsync(string id)
    {
        return await db.Quotes
            .AsNoTracking()
            .Include(q => q.Customer)
            .FirstOrDefaultAsync(q => q.Id == id);
    }
}
