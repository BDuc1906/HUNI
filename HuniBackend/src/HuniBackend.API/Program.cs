using System.Text;
using FluentValidation;
using HuniBackend.API.Middleware;
using HuniBackend.Application.Interfaces;
using HuniBackend.Application.Services;
using HuniBackend.Application.Validators;
using HuniBackend.Infrastructure.Data;
using HuniBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ─── Services ───────────────────────────────────────────────────
// 1. Database (PostgreSQL via Npgsql, or InMemory for Testing)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    if (builder.Environment.EnvironmentName == "Testing")
    {
        var dbName = builder.Configuration["TestingDbName"] ?? "HuniTestDb";
        opt.UseInMemoryDatabase(dbName);
    }
    else
    {
        opt.UseNpgsql(connectionString);
    }
});
builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

// 2. CORS — cho phép Next.js frontend gọi
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? ["http://localhost:3000"];
builder.Services.AddCors(opt =>
    opt.AddPolicy("NextJsPolicy", p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials()));

// 3. JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        var jwt = builder.Configuration.GetSection("Jwt");
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"] ?? "HuniBackend",
            ValidAudience = jwt["Audience"] ?? "HuniClient",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["SecretKey"] ?? "huni-backend-super-secret-key-256bit-minimum-here-please-change-in-production!"))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHttpClient();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger UI với cấu hình JWT Bearer
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HUNI HDC Fashion API",
        Version = "v1",
        Description = "Backend REST API cho hệ thống may đo và thương mại điện tử HUNI (C# .NET 9)"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token JWT: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 5. Validators (FluentValidation)
builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

// 6. Application & Infrastructure Services Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddSingleton<ILoginAttemptTracker, LoginAttemptTracker>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddSingleton<IChatService, GeminiChatService>();

// 7. Lowercase URLs
builder.Services.AddRouting(opt => { opt.LowercaseUrls = true; });

// ─── Pipeline ───────────────────────────────────────────────────
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HUNI API v1");
    c.RoutePrefix = "swagger";
});

app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<OrderRateLimitMiddleware>();

app.UseHttpsRedirection();
app.UseCors("NextJsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "HuniBackend (.NET 9)"
}));

// Tự động apply migrations khi khởi động (nếu DB đã kết nối)
if (app.Environment.IsDevelopment())
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        if (db.Database.CanConnect())
        {
            db.Database.Migrate();
            if (!db.Users.Any(u => u.Email == "admin@huni.vn"))
            {
                db.Users.Add(new HuniBackend.Domain.Entities.User
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "admin@huni.vn",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    FullName = "HUNI Administrator",
                    Role = HuniBackend.Domain.Enums.UserRole.ADMIN,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
                db.SaveChanges();
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB Startup Notice] Could not connect to DB yet: {ex.Message}");
    }
}

app.Run();

public partial class Program { }
