using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;

        public AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpPost("login")]
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

                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role == null)
                {
                    _logger.Warn("User has no assigned role.");
                    return BadRequest(ApiResult<object>.Error("400 - User does not have an assigned role."));
                }

                var accessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(5));
                var refreshToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromDays(7));

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
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        [HttpPost("register")]
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

                Role role = await _roleManager.FindByNameAsync(Roles.Customer.ToString());

                var user = new User
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.Email,
                    RoleId = role.Id,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Gender = (bool)registerDTO.Gender,
                    DateOfBirth = registerDTO.DateOfBirth,
                    ImageUrl = registerDTO.ImageUrl
                };

                var result = await _userManager.CreateAsync(user, registerDTO.Password);
                if (!result.Succeeded)
                {
                    _logger.Warn("User registration failed.");
                    return BadRequest(ApiResult<object>.Error("400 - User registration failed."));
                }

                _logger.Success("User registered successfully.");
                return Ok(ApiResult<object>.Success(null, "User registered successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during registration: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }
    }
}
