using System.Net;
using System.Text.RegularExpressions;

namespace HuniBackend.Application.Common;

public static class InputSanitizer
{
    private static readonly Regex ScriptTagRegex = new(@"<script[^>]*>[\s\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex HtmlTagRegex = new(@"<[^>]+>", RegexOptions.Compiled);

    private static readonly Regex MaliciousContentRegex = new(
        @"(<script[^>]*>|javascript:|onload=|onerror=|onclick=|<iframe|<embed)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

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
        var withoutScripts = ScriptTagRegex.Replace(input, string.Empty);
        var stripped = HtmlTagRegex.Replace(withoutScripts, string.Empty);
        return stripped.Trim();
    }

    public static bool ContainsMaliciousContent(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return false;
        return MaliciousContentRegex.IsMatch(input);
    }
}
