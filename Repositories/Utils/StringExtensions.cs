using System.Text.RegularExpressions;

namespace Repositories.Utils
{
    public static class StringExtensions
    {
        private static readonly Regex _stripJsonWhitespaceRegex = new Regex("(\"(?:[^\"\\\\]|\\\\.)*\")|\\s+", RegexOptions.Compiled);
        public static string StripJsonWhitespace(this string json) => _stripJsonWhitespaceRegex.Replace(json, "$1");
    }
}
