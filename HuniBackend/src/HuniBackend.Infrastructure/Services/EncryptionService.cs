using System.Security.Cryptography;
using System.Text;
using HuniBackend.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace HuniBackend.Infrastructure.Services;

public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration config)
    {
        var rawKey = config["Encryption:Key"] ?? config["Jwt:SecretKey"] ?? "huni-encryption-key-32bytes-default!!";
        _key = Encoding.UTF8.GetBytes(rawKey.PadRight(32)[..32]);
    }

    public string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText)) return string.Empty;

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor();
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        // Format: IV(16 bytes) + CipherText
        var result = new byte[aes.IV.Length + cipherBytes.Length];
        aes.IV.CopyTo(result, 0);
        cipherBytes.CopyTo(result, aes.IV.Length);

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText)) return string.Empty;

        var fullCipher = Convert.FromBase64String(cipherText);
        if (fullCipher.Length < 16)
        {
            throw new ArgumentException("Invalid cipher text length.");
        }

        var iv = fullCipher[..16];
        var cipher = fullCipher[16..];

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();
        var plainBytes = decryptor.TransformFinalBlock(cipher, 0, cipher.Length);
        return Encoding.UTF8.GetString(plainBytes);
    }
}
