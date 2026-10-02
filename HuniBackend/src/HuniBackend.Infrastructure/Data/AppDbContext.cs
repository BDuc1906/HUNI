using System.Text.RegularExpressions;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HuniBackend.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Voucher> Vouchers => Set<Voucher>();
    public DbSet<ReturnRequest> ReturnRequests => Set<ReturnRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tự động chuyển đổi tên bảng và cột sang snake_case
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var currentTableName = entity.GetTableName();
            if (!string.IsNullOrEmpty(currentTableName))
            {
                entity.SetTableName(ToSnakeCase(currentTableName));
            }

            foreach (var prop in entity.GetProperties())
            {
                var currentPropName = prop.GetColumnName();
                if (!string.IsNullOrEmpty(currentPropName))
                {
                    prop.SetColumnName(ToSnakeCase(currentPropName));
                }
            }
        }

        // OrderItem -> cascade delete khi Order bị xóa
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Customer.Phone unique
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Phone).IsUnique();

        // Product Slug + Sku unique
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Sku).IsUnique();

        // User.Email unique
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email).IsUnique();

        // Voucher.Code unique
        modelBuilder.Entity<Voucher>()
            .HasIndex(v => v.Code).IsUnique();

        // Order.OrderNumber unique
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderNumber).IsUnique();

        // PostgreSQL array columns
        modelBuilder.Entity<Product>()
            .Property(p => p.Images).HasColumnType("text[]");
        modelBuilder.Entity<Product>()
            .Property(p => p.Features).HasColumnType("text[]");
        modelBuilder.Entity<Product>()
            .Property(p => p.Sizes).HasColumnType("text[]");
        modelBuilder.Entity<ReturnRequest>()
            .Property(r => r.EvidenceImages).HasColumnType("text[]");

        // Enums -> string conversion
        modelBuilder.Entity<Order>()
            .Property(o => o.Status).HasConversion<string>();
        modelBuilder.Entity<Quote>()
            .Property(q => q.Status).HasConversion<string>();
        modelBuilder.Entity<User>()
            .Property(u => u.Role).HasConversion<string>();
        modelBuilder.Entity<Review>()
            .Property(r => r.Status).HasConversion<string>();
        modelBuilder.Entity<ReturnRequest>()
            .Property(r => r.Status).HasConversion<string>();
        modelBuilder.Entity<ReturnRequest>()
            .Property(r => r.Type).HasConversion<string>();

        // Review.Rating -> smallint
        modelBuilder.Entity<Review>()
            .Property(r => r.Rating).HasColumnType("smallint");

        // Quote.CustomerId optional FK
        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Customer)
            .WithMany(c => c.Quotes)
            .HasForeignKey(q => q.CustomerId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        // ReturnRequest optional FKs
        modelBuilder.Entity<ReturnRequest>()
            .HasOne(r => r.Order)
            .WithMany(o => o.ReturnRequests)
            .HasForeignKey(r => r.OrderId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ReturnRequest>()
            .HasOne(r => r.Customer)
            .WithMany(c => c.ReturnRequests)
            .HasForeignKey(r => r.CustomerId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static string ToSnakeCase(string name) =>
        Regex.Replace(name, "([a-z0-9])([A-Z])", "$1_$2").ToLower();
}
