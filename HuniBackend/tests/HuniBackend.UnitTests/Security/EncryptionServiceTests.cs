using FluentAssertions;
using HuniBackend.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace HuniBackend.UnitTests.Security;

public class EncryptionServiceTests
{
    private readonly EncryptionService _encryptionService;

    public EncryptionServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Encryption:Key"] = "test-encryption-key-32-chars-long!"
            })
            .Build();

        _encryptionService = new EncryptionService(config);
    }

    [Fact]
    public void Encrypt_PlainText_ReturnsEncryptedStringDifferentFromOriginal()
    {
        var plain = "MST-0102030405";
        var encrypted = _encryptionService.Encrypt(plain);

        encrypted.Should().NotBeNullOrWhiteSpace();
        encrypted.Should().NotBe(plain);
    }

    [Fact]
    public void Decrypt_EncryptedText_RestoresOriginalPlainText()
    {
        var plain = "CÔNG TY CỔ PHẦN THỜI TRANG HUNI - MST: 0312345678";
        var encrypted = _encryptionService.Encrypt(plain);
        var decrypted = _encryptionService.Decrypt(encrypted);

        decrypted.Should().Be(plain);
    }

    [Fact]
    public void Encrypt_EmptyOrNull_ReturnsEmptyString()
    {
        _encryptionService.Encrypt("").Should().BeEmpty();
        _encryptionService.Encrypt(null!).Should().BeEmpty();
        _encryptionService.Decrypt("").Should().BeEmpty();
    }
}
