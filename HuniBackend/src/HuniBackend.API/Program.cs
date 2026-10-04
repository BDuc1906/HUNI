using System.IO.Compression;
using System.Text;
using AspNetCoreRateLimit;
using FluentValidation;
using HuniBackend.API.Middleware;
using HuniBackend.Application.Interfaces;
using HuniBackend.Application.Services;
using HuniBackend.Application.Validators;
using HuniBackend.Infrastructure.Data;
using HuniBackend.Infrastructure.Data.Seeds;
using HuniBackend.Infrastructure.RateLimiting;
using HuniBackend.Infrastructure.Security;
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

// Configure Kestrel limits and headers
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false;
    serverOptions.Limits.MaxRequestBodySize = 5 * 1024 * 1024; // 5MB max request body
});

builder.WebHost.UseSentry(o =>
{
    o.Dsn = builder.Configuration["Sentry:Dsn"];
    o.Environment = builder.Environment.EnvironmentName;
    o.TracesSampleRate = 0.2;
    o.SendDefaultPii = false;
});

// ─── 0. Serilog Production Logging ─────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
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
        opt.UseNpgsql(connectionString, npgsqlOpt =>
        {
            npgsqlOpt.CommandTimeout(30);
        });
        opt.EnableSensitiveDataLogging(false);
        opt.EnableDetailedErrors(builder.Environment.IsDevelopment());
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
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();

// ─── 4. Response Compression ───────────────────────────────────────
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/json", "text/plain" });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(o =>
    o.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(o =>
    o.Level = CompressionLevel.Fastest);

// ─── 5. Output Cache ───────────────────────────────────────────────
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(5)));
    options.AddPolicy("Products", builder =>
        builder.Expire(TimeSpan.FromMinutes(5))
               .SetVaryByQuery("category", "search", "page", "limit", "sort"));
    options.AddPolicy("Static", builder =>
        builder.Expire(TimeSpan.FromHours(1)));
    options.AddPolicy("Products5min", builder =>
        builder.Expire(TimeSpan.FromMinutes(5))
               .SetVaryByQuery("category", "search", "page", "limit", "sort"));
    options.AddPolicy("Static1h", builder =>
        builder.Expire(TimeSpan.FromHours(1)));
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

builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(RateLimitConfig.ConfigureIpRateLimitOptions);
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddSingleton<ILoginAttemptTracker, HuniBackend.Infrastructure.Security.LoginAttemptTracker>();
builder.Services.AddSingleton<HuniBackend.Infrastructure.Security.LoginAttemptTracker>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<ITrackingService, TrackingService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddSingleton<StaticProductsLoader>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddHttpClient<IChatService, GeminiChatService>();

builder.Services.AddRouting(opt => { opt.LowercaseUrls = true; });

// ─── Pipeline ─────────────────────────────────────────────────────
var app = builder.Build();

if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing"))
{
    app.UseHsts();
}

app.UseResponseCompression();
app.UseRouting();
app.UseCors("NextJsPolicy");
app.UseOutputCache();

// Swagger chỉ bật ở Development và khi chưa bị tắt bởi cấu hình
var swaggerEnabled = builder.Configuration.GetValue<bool>("Swagger:Enabled", app.Environment.IsDevelopment());
if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HUNI API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseMiddleware<SecurityHeadersMiddleware>();

if (!app.Environment.IsEnvironment("Testing"))
{
    app.UseIpRateLimiting();
}

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

        var process = System.Diagnostics.Process.GetCurrentProcess();
        var uptime = DateTime.UtcNow - process.StartTime.ToUniversalTime();
        var memoryMb = (long)Math.Round(process.WorkingSet64 / 1024.0 / 1024.0);

        var checksDict = new Dictionary<string, object>();
        foreach (var entry in report.Entries)
        {
            if (entry.Key == "database")
            {
                checksDict["database"] = new
                {
                    status = entry.Value.Status.ToString().ToLower(),
                    responseMs = (long)Math.Round(entry.Value.Duration.TotalMilliseconds)
                };
            }
            else if (entry.Key == "gemini_api" || entry.Key == "gemini")
            {
                checksDict["gemini"] = new
                {
                    status = entry.Value.Status.ToString().ToLower()
                };
            }
            else
            {
                checksDict[entry.Key] = new
                {
                    status = entry.Value.Status.ToString().ToLower(),
                    responseMs = (long)Math.Round(entry.Value.Duration.TotalMilliseconds)
                };
            }
        }

        if (!checksDict.ContainsKey("database"))
        {
            checksDict["database"] = new { status = "healthy", responseMs = 0L };
        }
        if (!checksDict.ContainsKey("gemini"))
        {
            checksDict["gemini"] = new { status = "healthy" };
        }

        var result = new
        {
            status = report.Status.ToString().ToLower(),
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            environment = app.Environment.EnvironmentName,
            checks = checksDict,
            system = new
            {
                memoryMB = memoryMb,
                uptimeMinutes = (long)uptime.TotalMinutes
            }
        };
        await context.Response.WriteAsJsonAsync(result);
    }
});

app.MapGet("/ping", () => "pong");

app.MapGet("/api/test-error", () =>
{
    throw new Exception("Test Sentry integration");
});

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
