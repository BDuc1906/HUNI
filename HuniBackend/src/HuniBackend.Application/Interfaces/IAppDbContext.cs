using HuniBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Customer> Customers { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Quote> Quotes { get; }
    DbSet<Product> Products { get; }
    DbSet<User> Users { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Voucher> Vouchers { get; }
    DbSet<ReturnRequest> ReturnRequests { get; }
    DbSet<IdempotencyRecord> IdempotencyRecords { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
