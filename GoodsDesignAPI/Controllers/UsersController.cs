using BusinessObjects.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //Create, Update, Delete, Ban, Unban

        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILoggerService _logger;

        public UsersController(UserManager<User> userManager, RoleManager<Role> roleManager, ILoggerService logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }


        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            _logger.Info("Create user attempt initiated.");
            try
            {
                throw new Exception("500 - Not implemented yet.");
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
