using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.Auth;
using DataTransferObjects.AuthDTOs;
using DataTransferObjects.FactoryDTOs;
using DataTransferObjects.NotificationDTOs;
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
        private readonly INotificationService _notificationService;
        private readonly IFactoryService _factoryService;

        public AuthController(UserManager<User> userManager, RoleManager<Role> roleManager
            , ILoggerService logger, INotificationService notificationService, IFactoryService factoryService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _notificationService = notificationService;
            _factoryService = factoryService;
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
                if (!user.IsActive)
                {
                    _logger.Warn("User hasn't been activated to access");
                    return BadRequest(ApiResult<object>.Error("400 - User active is still disableb (inapprove), cannot login"));
                }

                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role == null)
                {
                    _logger.Warn("User has no assigned role.");
                    return BadRequest(ApiResult<object>.Error("400 - User does not have an assigned role."));
                }

              


                var accessToken = JwtUtils.GenerateJwtToken(user.Id.ToString(), user.Email, role.Name, configuration, TimeSpan.FromMinutes(15));
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

                Role role = await _roleManager.FindByNameAsync(Roles.CUSTOMER.ToString());

                var user = new User
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.UserName,
                    RoleId = role.Id,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Gender = (bool)registerDTO.Gender,
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
                    Content = $"Thank {user.Email} for registering with us. We hope you enjoy your stay.",
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
                var errorResponse = ApiResult<object>.Error(ex.Message);

                return StatusCode(statusCode, errorResponse);
            }
        }

        [HttpPost("register-factory-owner")]
        public async Task<IActionResult> Register([FromBody] RegisterFactoryOwnerRequestDTO registerDTO)
        {
            _logger.Info("Factory owner registration attempt initiated.");
            try
            {
                // Kiểm tra dữ liệu đầu vào
                if (registerDTO == null || string.IsNullOrWhiteSpace(registerDTO.Email) || string.IsNullOrWhiteSpace(registerDTO.Password))
                {
                    _logger.Warn("Invalid registration request.");
                    return BadRequest(ApiResult<object>.Error("400 - Invalid registration data."));
                }

                // Tìm vai trò "factoryOwner"
                var role = await _roleManager.FindByNameAsync(Roles.FACTORYOWNER.ToString());
                if (role == null)
                {
                    _logger.Warn("FactoryOwner role not found.");
                    return BadRequest(ApiResult<object>.Error("500 - FactoryOwner role not found."));
                }

                // Tạo user
                var user = new User
                {
                    Email = registerDTO.Email,
                    UserName = registerDTO.UserName,
                    RoleId = role.Id,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Gender = registerDTO.Gender ?? false,
                    DateOfBirth = registerDTO.DateOfBirth,
                    ImageUrl = registerDTO.ImageUrl,
                    IsActive = true
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
                    FacetoryAddress = registerDTO.FacetoryAddress,
                    ContractName = registerDTO.ContractName,
                    ContractPaperUrl = registerDTO.ContractPaperUrl,                  
                };

                await _factoryService.CreateFactory(factory);
                // Gửi thông báo chào mừng
                var notificationDTO = new NotificationDTO
                {
                    Title = "Welcome!",
                    Content = $"Thank you {user.Email} for registering as a Factory Owner.",
                    Url = "/",
                    UserId = user.Id
                };

                await _notificationService.PushNotificationToUser(user.Id, notificationDTO);

                _logger.Success("Factory owner registered successfully.");
                return Ok(ApiResult<object>.Success(new { userCreationResult , factory}, "Factory owner registered successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during factory owner registration: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }


    }
}
