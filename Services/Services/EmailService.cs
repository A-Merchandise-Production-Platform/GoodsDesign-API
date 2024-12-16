using DataTransferObjects.MailDTOs;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit.Text;
using MimeKit;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using System.Text.Json;

namespace Services.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILoggerService _logger;

        public EmailService(IConfiguration configuration, ILoggerService logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(EmailDTO request)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration["EmailUserName"]));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = request.Body
            };

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(_configuration["EmailHost"], 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_configuration["EmailUserName"], _configuration["EmailPassword"]);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during email processing: {ex.Message}");
                throw;
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }


        public async Task SendFactoryOwnerPendingApprovalEmail(string email, string userName)
        {
            var emailBody = $@"
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
            <div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                <h2 style='color: #333;'>Welcome to GoodsDesign!</h2>
                <p style='color: #555;'>Dear {userName},</p>
                <p style='color: #555;'>Thank you for registering as a Factory Owner. Your account is currently under review by our administrative team.</p>
                <p style='color: #555;'>We will notify you once your account has been approved. In the meantime, feel free to explore our platform and get ready to showcase your factory’s potential!</p>
                <p style='color: #555;'>Best regards,<br />The GoodsDesign Team</p>
            </div>
        </body>
        </html>";

            var emailDTO = new EmailDTO
            {
                To = email,
                Subject = "Welcome to GoodsDesign! Pending Approval",
                Body = emailBody
            };

            try
            {
                await SendEmailAsync(emailDTO);
                _logger.Success("Pending approval email sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Failed to send pending approval email: {ex.Message}");
                throw;
            }
        }


        public async Task SendFactoryApprovalEmailAsync(string email, string factoryInformation)
        {
            try
            {
                // Deserialize JSON string into a dictionary or a C# class
                var factoryInfo = JsonSerializer.Deserialize<Dictionary<string, string>>(factoryInformation);

                // Extract fields from the dictionary
                var factoryName = factoryInfo.ContainsKey("FactoryName") ? factoryInfo["FactoryName"] : "Unknown Factory";
                var factoryAddress = factoryInfo.ContainsKey("FactoryAddress") ? factoryInfo["FactoryAddress"] : "Unknown Address";
                var factoryContactPhone = factoryInfo.ContainsKey("FactoryContactPhone") ? factoryInfo["FactoryContactPhone"] : "Unknown Phone";
                var factoryContactPerson = factoryInfo.ContainsKey("FactoryContactPerson") ? factoryInfo["FactoryContactPerson"] : "Unknown Person";

                // Email body template with extracted fields
                var emailBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                <div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                    <h2 style='color: #333;'>Congratulations!</h2>
                    <p style='color: #555;'>Your factory <strong>{factoryName}</strong> located at <strong>{factoryAddress}</strong> with contact person <strong>{factoryContactPerson}</strong> and phone <strong>{factoryContactPhone}</strong> has been approved successfully.</p>
                    <p style='color: #555;'>You can now log in to your account and start managing your factory.</p>
                    <p style='color: #555;'>Thank you for joining our system. If you have any questions, feel free to contact support.</p>
                    <p style='color: #555;'>Best regards,<br />GoodsDesign Team</p>
                </div>
            </body>
            </html>";

                // Create email DTO
                var emailDto = new EmailDTO
                {
                    To = email,
                    Subject = "Factory Approval Notification",
                    Body = emailBody
                };

                await SendEmailAsync(emailDto);
            }
            catch (Exception ex)
            {
                _logger.Error($"Error while sending factory approval email: {ex.Message}");
                throw;
            }
        }


    }
}
