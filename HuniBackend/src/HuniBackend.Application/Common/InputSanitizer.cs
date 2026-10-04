using System;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Ganss.Xss;

namespace HuniBackend.Application.Common;

public static class InputSanitizer
{
    private static readonly HtmlSanitizer _sanitizer = new()
    {
        KeepChildNodes = true
    };
    private static readonly Regex ScriptTagRegex = new(@"<script[^>]*>[\s\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex HtmlTagRegex = new(@"<[^>]+>", RegexOptions.Compiled);

    static InputSanitizer()
    {
        // Strip tất cả HTML tags, chỉ giữ lại text thuần theo P10-F
        _sanitizer.AllowedTags.Clear();
        _sanitizer.AllowedAttributes.Clear();
        _sanitizer.AllowedCssProperties.Clear();
        _sanitizer.AllowedSchemes.Clear();
    }

    public static string Sanitize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var stripped = StripHtml(input);
        return WebUtility.HtmlEncode(stripped);
    }

    public static string StripHtml(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var withoutScripts = ScriptTagRegex.Replace(input, string.Empty);
        var sanitized = _sanitizer.Sanitize(withoutScripts);
        var stripped = HtmlTagRegex.Replace(sanitized, string.Empty);
        return stripped.Trim();
    }

    public static bool ContainsMaliciousContent(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return false;
        var patterns = new[] { "<script", "javascript:", "onerror=", "onload=", "onclick=", "<iframe", "<embed", "DROP TABLE", "1=1", "--" };
        return patterns.Any(p => input.Contains(p, StringComparison.OrdinalIgnoreCase));
    }

    public static bool ContainsMalicious(string? input) => ContainsMaliciousContent(input);
}
