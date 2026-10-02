using System.Text.Json;
using HuniBackend.Application.Interfaces;
using HuniBackend.Domain.Entities;

namespace HuniBackend.Application.Services;

public class WholesaleTier
{
    public int Min { get; set; }
    public int? Max { get; set; }
    public int Price { get; set; }
    public string? Label { get; set; }
}

public class PricingService : IPricingService
{
    public const int LogoFeePerItem = 15000;

    public int CalculateTierPrice(Product product, int quantity)
    {
        if (product == null) return 0;

        if (!string.IsNullOrWhiteSpace(product.WholesaleTiers))
        {
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var tiers = JsonSerializer.Deserialize<List<WholesaleTier>>(product.WholesaleTiers, options);
                if (tiers != null && tiers.Count > 0)
                {
                    var matchedTier = tiers.FirstOrDefault(tier =>
                        quantity >= tier.Min && (tier.Max == null || tier.Max == 0 || quantity <= tier.Max));

                    if (matchedTier != null && matchedTier.Price > 0)
                    {
                        return matchedTier.Price;
                    }
                }
            }
            catch
            {
                // Fallback to base product.Price
            }
        }

        return product.Price;
    }

    public int CalculateUnitPrice(Product product, int quantity, bool hasCustomLogo)
    {
        var tierPrice = CalculateTierPrice(product, quantity);
        return tierPrice + (hasCustomLogo ? LogoFeePerItem : 0);
    }

    public bool HasCustomLogo(object? customLogo)
    {
        if (customLogo == null) return false;

        if (customLogo is JsonElement element)
        {
            if (element.ValueKind == JsonValueKind.Null || element.ValueKind == JsonValueKind.Undefined)
                return false;

            if (element.ValueKind == JsonValueKind.Object)
            {
                // Check if it has any non-empty properties (như url, position, ...)
                if (element.TryGetProperty("url", out var urlProp) && !string.IsNullOrWhiteSpace(urlProp.GetString()))
                    return true;
                if (element.EnumerateObject().Any())
                    return true;
            }
            return false;
        }

        var json = JsonSerializer.Serialize(customLogo);
        return !string.IsNullOrWhiteSpace(json) && json != "{}" && json != "null";
    }
}
