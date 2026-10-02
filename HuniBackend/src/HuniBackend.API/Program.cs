using System.IO.Compression;
using System.Text;
using FluentValidation;
using HuniBackend.API.Middleware;
using HuniBackend.Application.Interfaces;
using HuniBackend.Application.Services;
using HuniBackend.Application.Validators;
using HuniBackend.Infrastructure.Data;
using HuniBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Disable Server header in Kestrel
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false;
});

// ─── 0. Serilog Production Logging ─────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("MachineName", Environment.MachineName)
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/huni-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// ─── 1. Database (PostgreSQL via Npgsql, or InMemory for Testing) ──
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = "Host=localhost;Port=5433;Database=hdcfashion;Username=postgres;Password=postgres;SSL Mode=Prefer";
}

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

// ─── 2. CORS ───────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? ["http://localhost:3000", "https://hunistore.com", "https://www.hunistore.com"];
builder.Services.AddCors(opt =>
    opt.AddPolicy("NextJsPolicy", p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials()));

// ─── 3. JWT Authentication ────────────────────────────────────────
var rawSecret = builder.Configuration.GetSection("Jwt")["SecretKey"];
var secretKey = string.IsNullOrWhiteSpace(rawSecret)
    ? "huni-backend-super-secret-key-256bit-minimum-here-please-change-in-production!"
    : rawSecret;

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
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

// ─── 4. Response Compression ───────────────────────────────────────
builder.Services.AddResponseCompression(opt =>
{
    opt.EnableForHttps = true;
    opt.Providers.Add<BrotliCompressionProvider>();
    opt.Providers.Add<GzipCompressionProvider>();
    opt.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(["application/json"]);
});
builder.Services.Configure<BrotliCompressionProviderOptions>(opt => opt.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(opt => opt.Level = CompressionLevel.Fastest);

// ─── 5. Output Cache ───────────────────────────────────────────────
builder.Services.AddOutputCache(opt =>
{
    opt.AddPolicy("Products5min", p => p
        .Expire(TimeSpan.FromMinutes(5))
        .Tag("products"));
    opt.AddPolicy("Static1h", p => p
        .Expire(TimeSpan.FromHours(1))
        .Tag("static"));
});

// ─── 6. Health Checks ──────────────────────────────────────────────
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddCheck("gemini_api", () =>
    {
        var apiKey = builder.Configuration["Gemini:ApiKey"];
        return !string.IsNullOrEmpty(apiKey) && apiKey != "YOUR_GEMINI_API_KEY"
            ? HealthCheckResult.Healthy("Gemini API key configured")
            : HealthCheckResult.Degraded("Gemini API key not configured");
    });

// ─── 7. Swagger UI ─────────────────────────────────────────────────
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

// ─── 8. Validators & Services DI ───────────────────────────────────
builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

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

builder.Services.AddRouting(opt => { opt.LowercaseUrls = true; });

// ─── Pipeline ─────────────────────────────────────────────────────
var app = builder.Build();

app.UseResponseCompression();
app.UseRouting();
app.UseCors("NextJsPolicy");
app.UseOutputCache();

// Swagger chỉ bật ở Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HUNI API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<OrderRateLimitMiddleware>();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health Check Endpoints
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = new
        {
            status = report.Status.ToString().ToLower(),
            timestamp = DateTime.UtcNow,
            service = "HuniBackend",
            version = "1.0.0",
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString().ToLower(),
                duration = e.Value.Duration.TotalMilliseconds,
                description = e.Value.Description
            })
        };
        await context.Response.WriteAsJsonAsync(result);
    }
});

app.MapGet("/ping", () => "pong");

// Tự động apply migrations khi khởi động (chỉ ở Development)
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
