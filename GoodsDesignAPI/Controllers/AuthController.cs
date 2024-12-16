using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using DataTransferObjects.NotificationDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using Services.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;
        private readonly INotificationService _notificationService;
        private readonly IFactoryService _factoryService;
        private readonly IUserService _userService;

        public AuthController(UserManager<User> userManager, RoleManager<Role> roleManager,
            ILoggerService logger, INotificationService notificationService,
            IFactoryService factoryService, IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _notificationService = notificationService;
            _factoryService = factoryService;
            _userService = userService;
        }

        /// <summary>
        /// User login
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "email": "admin@gmail.com",
        ///     "password": "123456"
        /// }
        /// </remarks>
        /// <response code="200">Returns Access Token & Refresh Token</response>
        /// <response code="400">Invalid login request</response>
        /// <response code="401">Invalid credentials</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResult<LoginResponseDTO>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 400)]
        [ProducesResponseType(typeof(ApiResult<object>), 401)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginDTO)
        {
            _logger.Info("Login attempt initiated.");
            try
            {
                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", true, true)
                    .AddEnvironmentVariables()
                    .Build();

                if (loginDTO == null || string.IsNullOrWhiteSpace(loginDTO.Email) || string.IsNullOrWhiteSpace(loginDTO.Password))
                {
                    _logger.Warn("Invalid login request.");
                    return BadRequest(ApiResult<object>.Error("401 - Invalid email or password."));
                }

                var user = await _userManager.FindByEmailAsync(loginDTO.Email);
                if (user == null || !(await _userManager.CheckPasswordAsync(user, loginDTO.Password)))
                {
                    _logger.Warn("Invalid credentials.");
                    return Unauthorized(ApiResult<object>.Error("401 - Invalid email or password."));
                }
                if (!user.IsActive)
                {
                    _logger.Warn("User hasn't been activated to access");
                    return BadRequest(ApiResult<object>.Error("400 - User is not activated, cannot login."));
                }

                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role == null)
                {
                    _logger.Warn("User has no assigned role.");
                    return BadRequest(ApiResult<object>.Error("400 - User does not have an assigned role."));
                }

                var accessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(15));
                var refreshToken = await _userManager.GenerateUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken");

                _logger.Success("Login successful.");
                return Ok(ApiResult<LoginResponseDTO>.Success(new LoginResponseDTO
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                }, "Login successful."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during login: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Register a new customer
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "email": "user@gmail.com",
        ///     "password": "123456",
        ///     "userName": "John Doe",
        ///     "phoneNumber": "123456789",
        ///     "gender": true,
        ///     "dateOfBirth": "2000-01-01",
        ///     "imageUrl": "http://example.com/image.png"
        /// }
        /// </remarks>
        /// <response code="200">Registration successful</response>
        /// <response code="400">Invalid registration data</response>
        /// <response code="500">Error during registration</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResult<object>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 400)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerDTO)
        {
            _logger.Info("Registration attempt initiated.");
            try
            {
                if (registerDTO == null || string.IsNullOrWhiteSpace(registerDTO.Email) || string.IsNullOrWhiteSpace(registerDTO.Password))
                {
                    _logger.Warn("Invalid registration request.");
                    return BadRequest(ApiResult<object>.Error("400 - Invalid registration data."));
                }

                Role role = await _roleManager.FindByNameAsync(Roles.CUSTOMER.ToString());

                var user = new User
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.UserName,
                    RoleId = role.Id,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Gender = registerDTO.Gender ?? false,
                    DateOfBirth = registerDTO.DateOfBirth,
                    ImageUrl = registerDTO.ImageUrl,
                    IsActive = true,
                };

                var result = await _userManager.CreateAsync(user, registerDTO.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.Warn($"500 - Failed to register user: {errors}");
                    return BadRequest(ApiResult<object>.Error(errors));
                }

                var notificationDTO = new NotificationDTO
                {
                    Title = "Welcome!",
                    Content = $"Thank you {user.Email} for registering with us.",
                    Url = "/",
                    UserId = user.Id
                };

                await _notificationService.PushNotificationToUser(user.Id, notificationDTO);

                _logger.Success("User registered successfully.");
                return Ok(ApiResult<object>.Success(null, "User registered successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during registration: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Logout the user
        /// </summary>
        /// <remarks>Invalidates the current session of the user</remarks>
        /// <response code="200">Logout successful</response>
        /// <response code="401">User not authenticated</response>
        [HttpPost("logout")]
        [ProducesResponseType(typeof(ApiResult<object>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 401)]
        public async Task<IActionResult> Logout()
        {
            _logger.Info("Logout attempt initiated.");
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.Warn("User ID not found in token.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not authenticated."));
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.Warn("User not found to logout");
                    return NotFound(ApiResult<object>.Error("404 - User not found."));
                }

                await _userManager.UpdateSecurityStampAsync(user);

                _logger.Success("Logout successful.");
                return Ok(ApiResult<object>.Success(null, "User logged out successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during logout: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Refresh JWT Token
        /// </summary>
        /// <remarks>Generates new Access Token and Refresh Token for the authenticated user</remarks>
        /// <response code="200">Token refreshed successfully</response>
        /// <response code="401">Invalid or expired refresh token</response>
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(ApiResult<LoginResponseDTO>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 401)]
        public async Task<IActionResult> RefreshToken([FromBody] LoginResponseDTO request)
        {
            _logger.Info("Token refresh attempt initiated.");
            try
            {
                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", true, true)
                    .AddEnvironmentVariables()
                    .Build();

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"])),
                    ValidateLifetime = true
                };

                var principal = new JwtSecurityTokenHandler().ValidateToken(request.AccessToken, tokenValidationParameters, out SecurityToken securityToken);

                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token.");
                }

                var email = principal.FindFirst(ClaimTypes.Email)?.Value;
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    _logger.Warn("User not found for token refresh.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found."));
                }

                if (!await _userManager.VerifyUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken", request.RefreshToken))
                {
                    _logger.Warn("Refresh token invalid or expired.");
                    return Unauthorized(ApiResult<object>.Error("401 - Refresh token invalid or expired."));
                }

                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role == null)
                {
                    _logger.Warn("User has no assigned role.");
                    return BadRequest(ApiResult<object>.Error("400 - User does not have an assigned role."));
                }

                var newAccessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(15));
                var newRefreshToken = await _userManager.GenerateUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken");

                _logger.Success("Token refresh successful.");
                return Ok(ApiResult<LoginResponseDTO>.Success(new LoginResponseDTO
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                }, "Token refreshed successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during token refresh: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
