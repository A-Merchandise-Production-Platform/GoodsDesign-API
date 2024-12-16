using DataTransferObjects.MailDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailDTO request);
        Task SendFactoryApprovalEmailAsync(string email, string factoryName);
        Task SendFactoryOwnerPendingApprovalEmail(string email, string userName);
    }
}
