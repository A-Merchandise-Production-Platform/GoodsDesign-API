using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services.Utils
{
    public static class JwtUtils
    {
        /// <summary>
        /// Generates a JWT token with the specified expiration time.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <param name="email">The user's email.</param>
        /// <param name="role">The user's role.</param>
        /// <param name="configuration">The application configuration.</param>
        /// <param name="validityPeriod">The token's validity period.</param>
        /// <returns>A JWT token as a string.</returns>
        public static string GenerateJwtToken(string userId, string email, string role, IConfiguration configuration, TimeSpan validityPeriod)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration["JWT:Issuer"],
                audience: configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(validityPeriod),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
