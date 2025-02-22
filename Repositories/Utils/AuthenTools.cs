using System.Security.Claims;
#pragma warning disable CS8603 // Possible null reference return =))
namespace Repositories.Utils
{
    public static class AuthenTools
    {
        public static string GetCurrentUserId(ClaimsIdentity identity)
        {
            if (identity != null)
            {
                var userClaims = identity.Claims;
                return userClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            return null;
        }
    }
}
