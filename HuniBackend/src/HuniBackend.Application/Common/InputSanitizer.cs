using System.Net;
using System.Text.RegularExpressions;

namespace HuniBackend.Application.Common;

public static class InputSanitizer
{
    private static readonly Regex ScriptTagRegex = new(@"<script[^>]*>[\s\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex HtmlTagRegex = new(@"<[^>]+>", RegexOptions.Compiled);

    public static string Sanitize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        // 1. Remove dangerous script tags
        var cleaned = ScriptTagRegex.Replace(input, string.Empty);

        // 2. HTML encode special characters to prevent stored XSS
        return WebUtility.HtmlEncode(cleaned.Trim());
    }

    public static string StripHtml(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var stripped = HtmlTagRegex.Replace(input, string.Empty);
        return stripped.Trim();
    }
}
