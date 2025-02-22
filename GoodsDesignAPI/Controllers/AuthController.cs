using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using DataTransferObjects.AuthDTOs;
using DataTransferObjects.FactoryDTOs;
using DataTransferObjects.NotificationDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;
using Services.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
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
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;
        private readonly ICurrentTime _currentTime;


        public AuthController(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            ILoggerService logger,
            INotificationService notificationService,
            IFactoryService factoryService,
            IUserService userService,
            IEmailService emailService,
            ICurrentTime currentTime
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _notificationService = notificationService;
            _factoryService = factoryService;
            _userService = userService;
            _emailService = emailService;
            _currentTime = currentTime;
        }

        /// <summary>
        /// User login
        /// </summary>
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

                var accessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(60));
                var refreshToken = await _userManager.GenerateUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken");
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = _currentTime.GetCurrentTime().AddDays(7);
                var result = await _userManager.UpdateAsync(user);

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
        /// Register a new factory owner
        /// </summary>
        [HttpPost("register-factory-owner")]
        [ProducesResponseType(typeof(ApiResult<object>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 400)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<IActionResult> Register([FromBody] RegisterFactoryOwnerRequestDTO registerDTO)
        {
            _logger.Info("Factory owner registration attempt initiated.");
            try
            {
                if (registerDTO == null || string.IsNullOrWhiteSpace(registerDTO.Email) || string.IsNullOrWhiteSpace(registerDTO.Password))
                {
                    _logger.Warn("Invalid registration request.");
                    return BadRequest(ApiResult<object>.Error("400 - Invalid registration data."));
                }

                var role = await _roleManager.FindByNameAsync(Roles.FACTORYOWNER.ToString());
                if (role == null)
                {
                    _logger.Warn("FactoryOwner role not found.");
                    return BadRequest(ApiResult<object>.Error("500 - FactoryOwner role not found."));
                }

                var user = new User
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.UserName,
                    RoleId = role.Id,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Gender = registerDTO.Gender ?? false,
                    DateOfBirth = registerDTO.DateOfBirth,
                    ImageUrl = registerDTO.ImageUrl,
                    IsActive = false
                };

                var userCreationResult = await _userManager.CreateAsync(user, registerDTO.Password);
                if (!userCreationResult.Succeeded)
                {
                    var errors = string.Join(", ", userCreationResult.Errors.Select(e => e.Description));
                    _logger.Warn($"500 - Failed to register user: {errors}");
                    return BadRequest(ApiResult<object>.Error(errors));
                }


                var factory = new FactoryCreateDTO
                {
                    FactoryOwnerId = user.Id,
                    FactoryName = registerDTO.FactoryName,
                    FactoryContactPerson = registerDTO.FactoryContactPerson,
                    FactoryContactPhone = registerDTO.FactoryContactPhone,
                    FactoryAddress = registerDTO.FactoryAddress,
                    ContractName = registerDTO.ContractName,
                    ContractPaperUrl = registerDTO.ContractPaperUrl,
                    SelectedProducts = registerDTO.SelectedProducts,
                };

                await _factoryService.CreateFactory(factory);
                await _emailService.SendFactoryOwnerPendingApprovalEmail(user.Email, registerDTO.UserName);

                var notificationDTO = new NotificationDTO
                {
                    Title = "Welcome!",
                    Content = $"Thank you {user.Email} for registering as a Factory Owner.",
                    Url = "/",
                    UserId = user.Id
                };

                await _notificationService.PushNotificationToUser(user.Id, notificationDTO);

                _logger.Success("Factory owner registered successfully.");
                return Ok(ApiResult<object>.Success(new { userCreationResult, factory }, "Factory owner registered successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory owner registration: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }

        /// <summary>
        /// Approve a factory owner
        /// </summary>
        [HttpPut("factories/{id}/approve-factory-owner")]
        [ProducesResponseType(typeof(ApiResult<object>), 200)]
        [ProducesResponseType(typeof(ApiResult<object>), 404)]
        [ProducesResponseType(typeof(ApiResult<object>), 500)]
        public async Task<IActionResult> ApproveFactoryOwner(Guid id)
        {
            _logger.Info($"Request to approve factory owner with ID: {id} received.");
            try
            {
                var result = await _factoryService.UpdateActiveStatusFactory(id);
                await _emailService.SendFactoryApprovalEmailAsync(result.FactoryOwner.Email, result.Information);

                _logger.Success($"Factory owner with ID: {id} approved successfully.");
                return Ok(ApiResult<object>.Success(result, "Factory owner approved successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                _logger.Warn($"Factory not found: {ex.Message}");
                return NotFound(ApiResult<object>.Error(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory owner approval: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }


        [HttpPost("logout")]
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
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            _logger.Info("Token refresh attempt initiated.");
            try
            {
                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", true, true)
                    .AddEnvironmentVariables()
                    .Build();

                // Lấy Access Token từ header Authorization
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(ApiResult<object>.Error("401 - Missing or invalid Authorization header."));
                }

                var accessToken = authHeader.Replace("Bearer ", "");

                // Validate Access Token mà không kiểm tra expiration
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"])),
                    ValidateLifetime = false // Không check expiration (Vì token này có thể đã hết hạn)
                };

                var principal = new JwtSecurityTokenHandler().ValidateToken(accessToken, tokenValidationParameters, out SecurityToken securityToken);

                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token.");
                }

                // Lấy email từ token
                var email = principal.FindFirst(ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    _logger.Warn("Token does not contain email.");
                    return Unauthorized(ApiResult<object>.Error("401 - Token does not contain email."));
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    _logger.Warn("User not found for token refresh.");
                    return Unauthorized(ApiResult<object>.Error("401 - User not found."));
                }

                // Lấy refresh token từ cơ sở dữ liệu của user
                var storedRefreshToken = user.RefreshToken;
                if (string.IsNullOrEmpty(storedRefreshToken))
                {
                    _logger.Warn("User has no refresh token stored.");
                    return Unauthorized(ApiResult<object>.Error("401 - No refresh token available."));
                }

                // Kiểm tra refresh token hợp lệ
                if (!await _userManager.VerifyUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken", storedRefreshToken))
                {
                    _logger.Warn("Refresh token invalid or expired.");
                    return Unauthorized(ApiResult<object>.Error("401 - Refresh token invalid or expired."));
                }

                // Lấy thông tin role
                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role == null)
                {
                    _logger.Warn("User has no assigned role.");
                    return BadRequest(ApiResult<object>.Error("400 - User does not have an assigned role."));
                }

                // Tạo Access Token mới
                var newAccessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(15));

                // Tạo Refresh Token mới (Valid trong 7 ngày)
                var newRefreshToken = await _userManager.GenerateUserTokenAsync(user, "REFRESHTOKENPROVIDER", "RefreshToken");

                // Lưu refresh token mới vào database
                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = _currentTime.GetCurrentTime().AddDays(int.Parse(configuration["JWT:RefreshTokenValidityInDays"]));

                await _userManager.UpdateAsync(user);

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