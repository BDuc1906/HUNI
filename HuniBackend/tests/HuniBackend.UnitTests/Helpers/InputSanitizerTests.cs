using FluentAssertions;
using HuniBackend.Application.Common;
using Xunit;

namespace HuniBackend.UnitTests.Helpers;

public class InputSanitizerTests
{
    [Theory]
    [InlineData("<script>alert('xss')</script>Hello", "Hello")]
    [InlineData("<b>Bold</b> text", "Bold text")]
    [InlineData("Normal text", "Normal text")]
    [InlineData(null, "")]
    public void StripHtml_RemovesAllTags(string? input, string expected)
    {
        var result = InputSanitizer.StripHtml(input);
        result.Should().Be(expected);
    }

    [Theory]
    [InlineData("<script>alert(1)</script>", true)]
    [InlineData("javascript:void(0)", true)]
    [InlineData("Normal notes", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void ContainsMaliciousContent_DetectsCorrectly(string? input, bool expected)
    {
        var result = InputSanitizer.ContainsMaliciousContent(input);
        result.Should().Be(expected);
    }
}
