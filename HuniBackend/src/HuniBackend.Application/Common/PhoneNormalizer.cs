using System.Text.RegularExpressions;

namespace HuniBackend.Application.Common;

public static class PhoneNormalizer
{
    public static string NormalizePhone(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return string.Empty;

        // Bỏ khoảng trắng, dấu chấm, dấu gạch nối, dấu ngoặc
        var cleaned = Regex.Replace(phone.Trim(), @"[\s.\-\(\)]", "");

        // Chuẩn hoá đầu số quốc tế +84 hoặc 84 về 0
        if (cleaned.StartsWith("+84"))
        {
            cleaned = "0" + cleaned[3..];
        }
        else if (cleaned.StartsWith("84") && cleaned.Length > 9)
        {
            cleaned = "0" + cleaned[2..];
        }
        else if (cleaned.StartsWith("+"))
        {
            cleaned = cleaned[1..];
        }

        return cleaned;
    }

    public static bool IsValidPhone(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return false;

        var normalized = NormalizePhone(phone);
        return Regex.IsMatch(normalized, @"^[0-9]{10,11}$");
    }
}
