using BusinessObjects;
using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.JsonBDTOs;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces.CommonService;
using Services.Utils;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/system-config")]
    [ApiController]
    public class SystemConfigController : ControllerBase
    {
        private readonly ILoggerService _logger;
        private readonly GoodsDesignDbContext _context;

        public SystemConfigController(ILoggerService logger, GoodsDesignDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        #region Seed SystemConfig
        [HttpPost("seed")]
        public async Task<ApiResult<List<SystemConfig>>> SeedSystemConfig()
        {
            try
            {
                _logger.Info("Seeding SystemConfig initiated.");

                _context.SystemConfigs.RemoveRange(_context.SystemConfigs);
                await _context.SaveChangesAsync();

                var systemConfigs = new List<SystemConfig>
                {
                    new SystemConfig { Id = SystemConfigEnum.BANK.ToString(), Value = JsonConvert.SerializeObject(GetDefaultBanks()) },
                    new SystemConfig { Id = SystemConfigEnum.COLOR.ToString(), Value = JsonConvert.SerializeObject(GetDefaultColors()) },
                    new SystemConfig { Id = SystemConfigEnum.SIZE.ToString(), Value = JsonConvert.SerializeObject(GetDefaultSizes()) }
                };

                await _context.SystemConfigs.AddRangeAsync(systemConfigs);
                await _context.SaveChangesAsync();

                _logger.Success("SystemConfig seeded successfully.");
                return ApiResult<List<SystemConfig>>.Success(systemConfigs, "SystemConfig seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding SystemConfig: {ex.Message}");
                return ApiResult<List<SystemConfig>>.Error($"An error occurred: {ex.Message}");
            }
        }
        #endregion

        #region Add Data
        //[Authorize(Roles = "admin")]
        [HttpPut("banks")]
        public async Task<IActionResult> OverwriteBanks([FromBody] List<BankDTO> banks)
        {
            return await OverwriteSystemConfig(SystemConfigEnum.BANK.ToString(), banks, "Banks overwritten successfully.");
        }

        //[Authorize(Roles = "admin")]
        [HttpPut("colors")]
        public async Task<IActionResult> OverwriteColors([FromBody] List<ColorDTO> colors)
        {
            return await OverwriteSystemConfig(SystemConfigEnum.COLOR.ToString(), colors, "Colors overwritten successfully.");
        }

        //[Authorize(Roles = "admin")]
        [HttpPut("sizes")]
        public async Task<IActionResult> OverwriteSizes([FromBody] List<SizeDTO> sizes)
        {
            return await OverwriteSystemConfig(SystemConfigEnum.SIZE.ToString(), sizes, "Sizes overwritten successfully.");
        }
        #endregion

        #region Get Data
        [HttpGet("banks")]
        [ProducesResponseType(typeof(ApiResult<List<BankDTO>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBanks()
        {
            return await GetSystemConfig<List<BankDTO>>(SystemConfigEnum.BANK.ToString(), "Fetched banks successfully.");
        }

        [HttpGet("colors")]
        [ProducesResponseType(typeof(ApiResult<List<ColorDTO>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetColors()
        {
            return await GetSystemConfig<List<ColorDTO>>(SystemConfigEnum.COLOR.ToString(), "Fetched colors successfully.");
        }

        [HttpGet("sizes")]
        [ProducesResponseType(typeof(ApiResult<List<SizeDTO>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSizes()
        {
            return await GetSystemConfig<List<SizeDTO>>(SystemConfigEnum.SIZE.ToString(), "Fetched sizes successfully.");
        }
        #endregion

        #region Helpers
        private async Task<IActionResult> OverwriteSystemConfig<T>(string configId, T newValue, string successMessage)
        {
            try
            {
                _logger.Info($"Overwriting {configId} in SystemConfig.");
                var systemConfig = await _context.SystemConfigs.FindAsync(configId);

                if (systemConfig == null)
                    return NotFound(ApiResult<object>.Error($"SystemConfig with Id '{configId}' not found."));

                systemConfig.Value = JsonConvert.SerializeObject(newValue);
                await _context.SaveChangesAsync();

                _logger.Success(successMessage);
                return Ok(ApiResult<object>.Success(newValue, successMessage));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error updating {configId}: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred: {ex.Message}"));
            }
        }

        private async Task<IActionResult> GetSystemConfig<T>(string configId, string successMessage)
        {
            try
            {
                _logger.Info($"Fetching {configId} from SystemConfig.");
                var systemConfig = await _context.SystemConfigs.FindAsync(configId);

                if (systemConfig == null || string.IsNullOrEmpty(systemConfig.Value))
                    return NotFound(ApiResult<object>.Error($"SystemConfig with Id '{configId}' not found."));

                var result = JsonConvert.DeserializeObject<T>(systemConfig.Value);
                return Ok(ApiResult<object>.Success(result, successMessage));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching {configId}: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred: {ex.Message}"));
            }
        }

        private static List<BankDTO> GetDefaultBanks() => new()
{
    new() { Id = 17, Name = "Ngân hàng TMCP Công thương Việt Nam", Code = "ICB", Bin = "970415", ShortName = "VietinBank", Logo = "https://api.vietqr.io/img/ICB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "ICBVVNVX" },
    new() { Id = 43, Name = "Ngân hàng TMCP Ngoại Thương Việt Nam", Code = "VCB", Bin = "970436", ShortName = "Vietcombank", Logo = "https://api.vietqr.io/img/VCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "BFTVVNVX" },
    new() { Id = 4, Name = "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", Code = "BIDV", Bin = "970418", ShortName = "BIDV", Logo = "https://api.vietqr.io/img/BIDV.png", TransferSupported = true, LookupSupported = true, SwiftCode = "BIDVVNVX" },
    new() { Id = 42, Name = "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", Code = "VBA", Bin = "970405", ShortName = "Agribank", Logo = "https://api.vietqr.io/img/VBA.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VBAAVNVX" },
    new() { Id = 26, Name = "Ngân hàng TMCP Phương Đông", Code = "OCB", Bin = "970448", ShortName = "OCB", Logo = "https://api.vietqr.io/img/OCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "ORCOVNVX" },
    new() { Id = 21, Name = "Ngân hàng TMCP Quân đội", Code = "MB", Bin = "970422", ShortName = "MBBank", Logo = "https://api.vietqr.io/img/MB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "MSCBVNVX" },
    new() { Id = 38, Name = "Ngân hàng TMCP Kỹ thương Việt Nam", Code = "TCB", Bin = "970407", ShortName = "Techcombank", Logo = "https://api.vietqr.io/img/TCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VTCBVNVX" },
    new() { Id = 2, Name = "Ngân hàng TMCP Á Châu", Code = "ACB", Bin = "970416", ShortName = "ACB", Logo = "https://api.vietqr.io/img/ACB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "ASCBVNVX" },
    new() { Id = 47, Name = "Ngân hàng TMCP Việt Nam Thịnh Vượng", Code = "VPB", Bin = "970432", ShortName = "VPBank", Logo = "https://api.vietqr.io/img/VPB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VPBKVNVX" },
    new() { Id = 39, Name = "Ngân hàng TMCP Tiên Phong", Code = "TPB", Bin = "970423", ShortName = "TPBank", Logo = "https://api.vietqr.io/img/TPB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "TPBVVNVX" },
    new() { Id = 36, Name = "Ngân hàng TMCP Sài Gòn Thương Tín", Code = "STB", Bin = "970403", ShortName = "Sacombank", Logo = "https://api.vietqr.io/img/STB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SGTTVNVX" },
    new() { Id = 12, Name = "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh", Code = "HDB", Bin = "970437", ShortName = "HDBank", Logo = "https://api.vietqr.io/img/HDB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "HDBCVNVX" },
    new() { Id = 44, Name = "Ngân hàng TMCP Bản Việt", Code = "VCCB", Bin = "970454", ShortName = "VietCapitalBank", Logo = "https://api.vietqr.io/img/VCCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VCBCVNVX" },
    new() { Id = 31, Name = "Ngân hàng TMCP Sài Gòn", Code = "SCB", Bin = "970429", ShortName = "SCB", Logo = "https://api.vietqr.io/img/SCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SACLVNVX" },
    new() { Id = 45, Name = "Ngân hàng TMCP Quốc tế Việt Nam", Code = "VIB", Bin = "970441", ShortName = "VIB", Logo = "https://api.vietqr.io/img/VIB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VNIBVNVX" },
    new() { Id = 35, Name = "Ngân hàng TMCP Sài Gòn - Hà Nội", Code = "SHB", Bin = "970443", ShortName = "SHB", Logo = "https://api.vietqr.io/img/SHB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SHBAVNVX" },
    new() { Id = 10, Name = "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", Code = "EIB", Bin = "970431", ShortName = "Eximbank", Logo = "https://api.vietqr.io/img/EIB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "EBVIVNVX" },
    new() { Id = 22, Name = "Ngân hàng TMCP Hàng Hải", Code = "MSB", Bin = "970426", ShortName = "MSB", Logo = "https://api.vietqr.io/img/MSB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "MCOBVNVX" },
    new() { Id = 53, Name = "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank", Code = "CAKE", Bin = "546034", ShortName = "CAKE", Logo = "https://api.vietqr.io/img/CAKE.png", TransferSupported = true, LookupSupported = true, SwiftCode = null },
    new() { Id = 54, Name = "TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank", Code = "Ubank", Bin = "546035", ShortName = "Ubank", Logo = "https://api.vietqr.io/img/UBANK.png", TransferSupported = true, LookupSupported = true, SwiftCode = null },
    new() { Id = 58, Name = "Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)", Code = "TIMO", Bin = "963388", ShortName = "Timo", Logo = "https://vietqr.net/portal-service/resources/icons/TIMO.png", TransferSupported = true, LookupSupported = false, SwiftCode = null },
    new() { Id = 57, Name = "Tổng Công ty Dịch vụ số Viettel - Chi nhánh tập đoàn công nghiệp viễn thông Quân Đội", Code = "VTLMONEY", Bin = "971005", ShortName = "ViettelMoney", Logo = "https://api.vietqr.io/img/VIETTELMONEY.png", TransferSupported = false, LookupSupported = true, SwiftCode = null },
    new() { Id = 56, Name = "VNPT Money", Code = "VNPTMONEY", Bin = "971011", ShortName = "VNPTMoney", Logo = "https://api.vietqr.io/img/VNPTMONEY.png", TransferSupported = false, LookupSupported = true, SwiftCode = null },
    new() { Id = 34, Name = "Ngân hàng TMCP Sài Gòn Công Thương", Code = "SGICB", Bin = "970400", ShortName = "SaigonBank", Logo = "https://api.vietqr.io/img/SGICB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SBITVNVX" },
    new() { Id = 3, Name = "Ngân hàng TMCP Bắc Á", Code = "BAB", Bin = "970409", ShortName = "BacABank", Logo = "https://api.vietqr.io/img/BAB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "NASCVNVX" },
    new() { Id = 30, Name = "Ngân hàng TMCP Đại Chúng Việt Nam", Code = "PVCB", Bin = "970412", ShortName = "PVcomBank", Logo = "https://api.vietqr.io/img/PVCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "WBVNVNVX" },
    new() { Id = 27, Name = "Ngân hàng Thương mại TNHH MTV Đại Dương", Code = "Oceanbank", Bin = "970414", ShortName = "Oceanbank", Logo = "https://api.vietqr.io/img/OCEANBANK.png", TransferSupported = true, LookupSupported = true, SwiftCode = "OCBKUS3M" },
    new() { Id = 24, Name = "Ngân hàng TMCP Quốc Dân", Code = "NCB", Bin = "970419", ShortName = "NCB", Logo = "https://api.vietqr.io/img/NCB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "NVBAVNVX" },
    new() { Id = 37, Name = "Ngân hàng TNHH MTV Shinhan Việt Nam", Code = "SHBVN", Bin = "970424", ShortName = "ShinhanBank", Logo = "https://api.vietqr.io/img/SHBVN.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SHBKVNVX" },
    new() { Id = 1, Name = "Ngân hàng TMCP An Bình", Code = "ABB", Bin = "970425", ShortName = "ABBANK", Logo = "https://api.vietqr.io/img/ABB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "ABBKVNVX" },
    new() { Id = 41, Name = "Ngân hàng TMCP Việt Á", Code = "VAB", Bin = "970427", ShortName = "VietABank", Logo = "https://api.vietqr.io/img/VAB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VNACVNVX" },
    new() { Id = 23, Name = "Ngân hàng TMCP Nam Á", Code = "NAB", Bin = "970428", ShortName = "NamABank", Logo = "https://api.vietqr.io/img/NAB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "NAMAVNVX" },
    new() { Id = 29, Name = "Ngân hàng TMCP Xăng dầu Petrolimex", Code = "PGB", Bin = "970430", ShortName = "PGBank", Logo = "https://api.vietqr.io/img/PGB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "PGBLVNVX" },
    new() { Id = 46, Name = "Ngân hàng TMCP Việt Nam Thương Tín", Code = "VIETBANK", Bin = "970433", ShortName = "VietBank", Logo = "https://api.vietqr.io/img/VIETBANK.png", TransferSupported = true, LookupSupported = true, SwiftCode = "VNTTVNVX" },
    new() { Id = 5, Name = "Ngân hàng TMCP Bảo Việt", Code = "BVB", Bin = "970438", ShortName = "BaoVietBank", Logo = "https://api.vietqr.io/img/BVB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "BVBVVNVX" },
    new() { Id = 33, Name = "Ngân hàng TMCP Đông Nam Á", Code = "SEAB", Bin = "970440", ShortName = "SeABank", Logo = "https://api.vietqr.io/img/SEAB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "SEAVVNVX" },
    new() { Id = 52, Name = "Ngân hàng Hợp tác xã Việt Nam", Code = "COOPBANK", Bin = "970446", ShortName = "COOPBANK", Logo = "https://api.vietqr.io/img/COOPBANK.png", TransferSupported = true, LookupSupported = true, SwiftCode = null },
    new() { Id = 20, Name = "Ngân hàng TMCP Lộc Phát Việt Nam", Code = "LPB", Bin = "970449", ShortName = "LPBank", Logo = "https://api.vietqr.io/img/LPB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "LVBKVNVX" },
    new() { Id = 19, Name = "Ngân hàng TMCP Kiên Long", Code = "KLB", Bin = "970452", ShortName = "KienLongBank", Logo = "https://api.vietqr.io/img/KLB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "KLBKVNVX" },
    new() { Id = 55, Name = "Ngân hàng Đại chúng TNHH Kasikornbank", Code = "KBank", Bin = "668888", ShortName = "KBank", Logo = "https://api.vietqr.io/img/KBANK.png", TransferSupported = true, LookupSupported = true, SwiftCode = "KASIVNVX" },
    new() { Id = 50, Name = "Ngân hàng Kookmin - Chi nhánh Hà Nội", Code = "KBHN", Bin = "970462", ShortName = "KookminHN", Logo = "https://api.vietqr.io/img/KBHN.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 60, Name = "Ngân hàng KEB Hana – Chi nhánh Thành phố Hồ Chí Minh", Code = "KEBHANAHCM", Bin = "970466", ShortName = "KEBHanaHCM", Logo = "https://api.vietqr.io/img/KEBHANAHCM.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 61, Name = "Ngân hàng KEB Hana – Chi nhánh Hà Nội", Code = "KEBHANAHN", Bin = "970467", ShortName = "KEBHANAHN", Logo = "https://api.vietqr.io/img/KEBHANAHN.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 62, Name = "Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam) ", Code = "MAFC", Bin = "977777", ShortName = "MAFC", Logo = "https://api.vietqr.io/img/MAFC.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 59, Name = "Ngân hàng Citibank, N.A. - Chi nhánh Hà Nội", Code = "CITIBANK", Bin = "533948", ShortName = "Citibank", Logo = "https://api.vietqr.io/img/CITIBANK.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 51, Name = "Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh", Code = "KBHCM", Bin = "970463", ShortName = "KookminHCM", Logo = "https://api.vietqr.io/img/KBHCM.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 63, Name = "Ngân hàng Chính sách Xã hội", Code = "VBSP", Bin = "999888", ShortName = "VBSP", Logo = "https://api.vietqr.io/img/VBSP.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 49, Name = "Ngân hàng TNHH MTV Woori Việt Nam", Code = "WVN", Bin = "970457", ShortName = "Woori", Logo = "https://api.vietqr.io/img/WVN.png", TransferSupported = true, LookupSupported = true, SwiftCode = null },
    new() { Id = 48, Name = "Ngân hàng Liên doanh Việt - Nga", Code = "VRB", Bin = "970421", ShortName = "VRB", Logo = "https://api.vietqr.io/img/VRB.png", TransferSupported = false, LookupSupported = true, SwiftCode = null },
    new() { Id = 40, Name = "Ngân hàng United Overseas - Chi nhánh TP. Hồ Chí Minh", Code = "UOB", Bin = "970458", ShortName = "UnitedOverseas", Logo = "https://api.vietqr.io/img/UOB.png", TransferSupported = false, LookupSupported = true, SwiftCode = null },
    new() { Id = 32, Name = "Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam", Code = "SCVN", Bin = "970410", ShortName = "StandardChartered", Logo = "https://api.vietqr.io/img/SCVN.png", TransferSupported = false, LookupSupported = true, SwiftCode = "SCBLVNVX" },
    new() { Id = 28, Name = "Ngân hàng TNHH MTV Public Việt Nam", Code = "PBVN", Bin = "970439", ShortName = "PublicBank", Logo = "https://api.vietqr.io/img/PBVN.png", TransferSupported = false, LookupSupported = true, SwiftCode = "VIDPVNVX" },
    new() { Id = 25, Name = "Ngân hàng Nonghyup - Chi nhánh Hà Nội", Code = "NHB HN", Bin = "801011", ShortName = "Nonghyup", Logo = "https://api.vietqr.io/img/NHB.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 18, Name = "Ngân hàng TNHH Indovina", Code = "IVB", Bin = "970434", ShortName = "IndovinaBank", Logo = "https://api.vietqr.io/img/IVB.png", TransferSupported = false, LookupSupported = true, SwiftCode = null },
    new() { Id = 16, Name = "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh", Code = "IBK - HCM", Bin = "970456", ShortName = "IBKHCM", Logo = "https://api.vietqr.io/img/IBK.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 15, Name = "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội", Code = "IBK - HN", Bin = "970455", ShortName = "IBKHN", Logo = "https://api.vietqr.io/img/IBK.png", TransferSupported = false, LookupSupported = false, SwiftCode = null },
    new() { Id = 14, Name = "Ngân hàng TNHH MTV HSBC (Việt Nam)", Code = "HSBC", Bin = "458761", ShortName = "HSBC", Logo = "https://api.vietqr.io/img/HSBC.png", TransferSupported = false, LookupSupported = true, SwiftCode = "HSBCVNVX" },
    new() { Id = 13, Name = "Ngân hàng TNHH MTV Hong Leong Việt Nam", Code = "HLBVN", Bin = "970442", ShortName = "HongLeong", Logo = "https://api.vietqr.io/img/HLBVN.png", TransferSupported = false, LookupSupported = true, SwiftCode = "HLBBVNVX" },
    new() { Id = 11, Name = "Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu", Code = "GPB", Bin = "970408", ShortName = "GPBank", Logo = "https://api.vietqr.io/img/GPB.png", TransferSupported = false, LookupSupported = true, SwiftCode = "GBNKVNVX" },
    new() { Id = 9, Name = "Ngân hàng TMCP Đông Á", Code = "DOB", Bin = "970406", ShortName = "DongABank", Logo = "https://api.vietqr.io/img/DOB.png", TransferSupported = false, LookupSupported = true, SwiftCode = "EACBVNVX" },
    new() { Id = 8, Name = "DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh", Code = "DBS", Bin = "796500", ShortName = "DBSBank", Logo = "https://api.vietqr.io/img/DBS.png", TransferSupported = false, LookupSupported = false, SwiftCode = "DBSSVNVX" },
    new() { Id = 7, Name = "Ngân hàng TNHH MTV CIMB Việt Nam", Code = "CIMB", Bin = "422589", ShortName = "CIMB", Logo = "https://api.vietqr.io/img/CIMB.png", TransferSupported = true, LookupSupported = true, SwiftCode = "CIBBVNVN" },
    new() { Id = 6, Name = "Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam", Code = "CBB", Bin = "970444", ShortName = "CBBank", Logo = "https://api.vietqr.io/img/CBB.png", TransferSupported = false, LookupSupported = true, SwiftCode = "GTBAVNVX" }
};

        private static List<ColorDTO> GetDefaultColors() => new()
        {
            new() { Name = "Red", Code = "#FF0000" },
            new() { Name = "Green", Code = "#00FF00" }
        };

        private static List<SizeDTO> GetDefaultSizes() => new()
        {
            new() { Code = "S" }, new() { Code = "M" }, new() { Code = "L" }, new() { Code = "XL" }, new() { Code = "XXL" }, new() { Code = "XXXL" }
        };
        #endregion
    }
}
