using BusinessObjects;
using BusinessObjects.Entities;
using DataTransferObjects.JsonBDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public SystemConfigController(ILoggerService logger)
        {
            _logger = logger;
        }


        //   [Authorize(Roles = "admin")]
        [HttpPost("seed-system-config")]
        public async Task<ApiResult<List<SystemConfig>>> SeedSystemConfig([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding SystemConfig initiated.");

                // Kiểm tra nếu dữ liệu đã tồn tại
                var existingConfigs = await context.SystemConfigs.ToListAsync();
                if (existingConfigs.Any())
                {
                    return ApiResult<List<SystemConfig>>.Error("SystemConfig already seeded.");
                }

                // Hard code danh sách Bank
                var banks = new List<BankDTO>
        {
            new BankDTO
            {
                Id = 17,
                Name = "Ngân hàng TMCP Công thương Việt Nam",
                Code = "ICB",
                Bin = "970415",
                ShortName = "VietinBank",
                Logo = "https://api.vietqr.io/img/ICB.png",
                TransferSupported = true,
                LookupSupported = true,
                Short_Name = "VietinBank",
                Support = 3,
                IsTransfer = true,
                SwiftCode = "ICBVVNVX"
            },
            new BankDTO
            {
                Id = 43,
                Name = "Ngân hàng TMCP Ngoại Thương Việt Nam",
                Code = "VCB",
                Bin = "970436",
                ShortName = "Vietcombank",
                Logo = "https://api.vietqr.io/img/VCB.png",
                TransferSupported = true,
                LookupSupported = true,
                Short_Name = "Vietcombank",
                Support = 3,
                IsTransfer = true,
                SwiftCode = "BFTVVNVX"
            },
            new BankDTO
            {
                Id = 4,
                Name = "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
                Code = "BIDV",
                Bin = "970418",
                ShortName = "BIDV",
                Logo = "https://api.vietqr.io/img/BIDV.png",
                TransferSupported = true,
                LookupSupported = true,
                Short_Name = "BIDV",
                Support = 3,
                IsTransfer = true,
                SwiftCode = "BIDVVNVX"
            },
            new BankDTO
            {
                Id = 42,
                Name = "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
                Code = "VBA",
                Bin = "970405",
                ShortName = "Agribank",
                Logo = "https://api.vietqr.io/img/VBA.png",
                TransferSupported = true,
                LookupSupported = true,
                Short_Name = "Agribank",
                Support = 3,
                IsTransfer = true,
                SwiftCode = "VBAAVNVX"
            }
        };

                // Hard code danh sách Color
                var colors = new List<object>
        {
            new { Name = "Red", Code = "#FF0000" },
            new { Name = "Green", Code = "#00FF00" },
            new { Name = "Blue", Code = "#0000FF" },
            new { Name = "Yellow", Code = "#FFFF00" }
        };

                // Tạo danh sách SystemConfig để seed
                var systemConfigsToSeed = new List<SystemConfig>
        {
            new SystemConfig
            {
                Id = "BANK",
                Bank = JsonConvert.SerializeObject(banks),
                Color = null,
                Size = "M"
            },
            new SystemConfig
            {
                Id = "COLOR",
                Bank = null,
                Color = JsonConvert.SerializeObject(colors),
                Size = "XL"
            },
            new SystemConfig
            {
                Id = "SIZE",
                Bank = JsonConvert.SerializeObject(banks),
                Color = JsonConvert.SerializeObject(colors),
                Size = "XXL"
            }
        };

                // Thêm vào database
                await context.SystemConfigs.AddRangeAsync(systemConfigsToSeed);
                await context.SaveChangesAsync();

                _logger.Success("SystemConfig seeded successfully.");
                return ApiResult<List<SystemConfig>>.Success(systemConfigsToSeed, "SystemConfig seeded successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"Error during seeding SystemConfig: {ex.Message}");
                throw;
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("add-banks")]
        public async Task<IActionResult> AddBanks([FromBody] List<BankDTO> banksToAdd, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Adding banks to SystemConfig initiated.");

                // Lấy SystemConfig với Id là "BANK"
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "BANK");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'BANK' not found.");
                }

                // Lấy danh sách bank hiện tại từ trường Bank (JSONB)
                var existingBanks = string.IsNullOrEmpty(systemConfig.Bank)
                    ? new List<BankDTO>()
                    : JsonConvert.DeserializeObject<List<BankDTO>>(systemConfig.Bank);

                // Thêm các bank mới vào danh sách hiện tại
                existingBanks.AddRange(banksToAdd);

                // Loại bỏ các bank trùng lặp theo Id
                var distinctBanks = existingBanks
                    .GroupBy(b => b.Id)
                    .Select(g => g.First())
                    .ToList();

                // Cập nhật lại trường Bank với JSON đã được làm sạch
                systemConfig.Bank = JsonConvert.SerializeObject(distinctBanks);

                // Lưu thay đổi vào database
                await context.SaveChangesAsync();

                _logger.Success("Banks added successfully.");
                return Ok(ApiResult<object>.Success(distinctBanks, "Banks added successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error adding banks: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while adding banks: {ex.Message}"));
            }
        }

        [HttpGet("get-banks")]
        public async Task<IActionResult> GetBanks([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Fetching list of banks from SystemConfig.");

                // Lấy SystemConfig với Id là "BANK"
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "BANK");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'BANK' not found.");
                }

                // Lấy danh sách bank từ trường Bank (JSONB)
                var existingBanks = string.IsNullOrEmpty(systemConfig.Bank)
                    ? new List<BankDTO>()
                    : JsonConvert.DeserializeObject<List<BankDTO>>(systemConfig.Bank);

                _logger.Success("Fetched list of banks successfully.");
                return Ok(ApiResult<object>.Success(existingBanks, "Fetched list of banks successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching banks: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while fetching banks: {ex.Message}"));
            }
        }

    }
}
