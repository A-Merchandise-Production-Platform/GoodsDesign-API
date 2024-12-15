using BusinessObjects.Entities;
using DataTransferObjects.MailDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILoggerService _logger;

        public EmailController(IEmailService emailService, ILoggerService logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailDTO emailDTO)
        {
            _logger.Info("Request to send email received.");
            try
            {
                if (emailDTO == null || string.IsNullOrWhiteSpace(emailDTO.To) || string.IsNullOrWhiteSpace(emailDTO.Subject) || string.IsNullOrWhiteSpace(emailDTO.Body))
                {
                    _logger.Warn("Invalid email request.");
                    return BadRequest(new { message = "Invalid email data. Please provide To, Subject, and Body fields." });
                }

                await _emailService.SendEmailAsync(emailDTO);

                _logger.Success("Email sent successfully.");
                return Ok(ApiResult<object>.Success(emailDTO, "sent successfully."));

            }
            catch (Exception ex)
            {
                _logger.Error($"Error during sending email: {ex.Message}");
                int statusCode = ExceptionUtils.ExtractStatusCode(ex.Message);
                return StatusCode(statusCode, ApiResult<object>.Error(ex.Message));
            }
        }
    }
}
