using Microsoft.Extensions.Configuration;
using Net.payOS;
using Repositories.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services.ThirdPartyService
{
    public class PayOSService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly PayOS _payOS;
        private readonly IConfiguration _configuration;

        public PayOSService(ILoggerService logger, IConfiguration configuration, IUnitOfWork unitOfWork, PayOS payOS)
        {
            _logger = logger;
            _configuration = configuration;
            _payOS = payOS;
            _unitOfWork = unitOfWork;
        }

        //public async Task<string> CreateLink(int depositMoney, int txnRef)
        //{
        //    var domain = "https://koifarmshop.netlify.app/payment";

        //    var paymentLinkRequest = new PaymentData(
        //        orderCode: txnRef,
        //        amount: depositMoney,
        //        description: "Nạp tiền: " + depositMoney,
        //        items: [new("Nạp tiền " + depositMoney, 1, depositMoney)],
        //        returnUrl: domain + "?success=true&transactionId=" + "GG" + "&amount=" + depositMoney,
        //        cancelUrl: domain + "?canceled=true&transactionId=" + "GG" + "&amount=" + depositMoney
        //    );
        //    var response = await _payOS.createPaymentLink(paymentLinkRequest);

        //    return response.checkoutUrl;
        //}

        //public async Task<WebhookResponse> ReturnWebhook(WebhookType webhookType)
        //{
        //    try
        //    {
        //        // Log the receipt of the webhook
        //        //Seriablize the object to log
        //        _logger.LogInformation(JsonConvert.SerializeObject(webhookType));

        //        //WebhookData verifiedData = _payOS.verifyPaymentWebhookData(webhookType); //xác thực data from webhook
        //        //string responseCode = verifiedData.code;
        //        //string orderCode = verifiedData.orderCode.ToString();
        //        //string transactionId = "TRANS" + orderCode;

        //        var transaction = await _unitOfWork.TransactionRepository.GetByIdAsync(int.Parse(webhookType.data.orderCode.ToString()));

        //        // Handle the webhook based on the transaction status
        //        switch (webhookType.data.code)
        //        {
        //            case "00":
        //                // Update the transaction status
        //                await UpdateStatusTransaction(transaction);

        //                return new WebhookResponse
        //                {
        //                    Success = true,
        //                    Note = "Payment processed successfully"
        //                };

        //            case "01":
        //                // Update the transaction status
        //                await UpdateErrorTransaction(transaction, "Payment failed");

        //                return new WebhookResponse
        //                {
        //                    Success = false,
        //                    Note = "Invalid parameters"
        //                };

        //            default:
        //                return new WebhookResponse
        //                {
        //                    Success = false,
        //                    Note = "Unhandled code"
        //                };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message);
        //        throw ex;
        //    }
        //}

        //private async Task UpdateStatusTransaction(WalletTransaction transaction)
        //{
        //    transaction.TransactionStatus = TransactionStatusEnums.COMPLETED.ToString();
        //    //Plus money to user wallet
        //    var wallet = await _unitOfWork.WalletRepository.GetAllWalletByIdAsync(transaction.WalletId);
        //    wallet.Balance += transaction.Amount;
        //    await _unitOfWork.TransactionRepository.Update(transaction);
        //    await _unitOfWork.SaveChangeAsync();
        //}

        //public async Task UpdateErrorTransaction(WalletTransaction transaction, string note)
        //{
        //    transaction.TransactionStatus = TransactionStatusEnums.FAILED.ToString();
        //    transaction.Note = note;
        //    await _unitOfWork.TransactionRepository.Update(transaction);
        //    await _unitOfWork.SaveChangeAsync();
        //}
    }

    //public static class PayOSUtils
    //{
    //    public static bool IsValidData(WebhookType payOSWebhook, string transactionSignature, string ChecksumKey)
    //    {
    //        try
    //        {
    //            JObject jsonObject = JObject.Parse(payOSWebhook.data.ToString().Replace("'", "\""));
    //            var sortedKeys = jsonObject.Properties().Select(p => p.Name).OrderBy(k => k).ToList();

    //            StringBuilder transactionStr = new StringBuilder();
    //            foreach (var key in sortedKeys)
    //            {
    //                string value = jsonObject[key]?.ToString() ?? string.Empty;
    //                transactionStr.Append($"{key}={value}");
    //                if (key != sortedKeys.Last())
    //                {
    //                    transactionStr.Append("&");
    //                }
    //            }

    //            string signature = ComputeHmacSha256(transactionStr.ToString(), ChecksumKey);
    //            return signature.Equals(transactionSignature, StringComparison.OrdinalIgnoreCase);
    //        }
    //        catch (Exception ex)
    //        {
    //            Console.WriteLine(ex.Message);
    //        }
    //        return false;
    //    }

    //    public static string ComputeHmacSha256(string data, string key)
    //    {
    //        using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
    //        {
    //            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
    //            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    //        }
    //    }
    //}

    //public class DepositRequest
    //{
    //    public int Amount { get; set; }
    //}

    //public class WebhookResponse
    //{
    //    public bool Success { get; set; }
    //    public string Note { get; set; }
    //}
}
