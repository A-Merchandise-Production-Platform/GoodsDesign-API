using BusinessObjects;
using BusinessObjects.Entities;
using DataTransferObjects.JsonBDTOs;
using Microsoft.AspNetCore.Authorization;
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

        #region Seed SystemConfig
        [HttpPost("seed-system-config")]
        public async Task<ApiResult<List<SystemConfig>>> SeedSystemConfig([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Seeding SystemConfig initiated.");

                var existingConfigs = await context.SystemConfigs.ToListAsync();
                if (existingConfigs.Any())
                {
                    return ApiResult<List<SystemConfig>>.Error("SystemConfig already seeded.");
                }

                var banks = new List<BankDTO>
                {
                    new BankDTO
                    {
                        Id = 17, Name = "Ngân hàng TMCP Công thương Việt Nam", Code = "ICB",
                        Bin = "970415", ShortName = "VietinBank",
                        Logo = "https://api.vietqr.io/img/ICB.png",
                        TransferSupported = true, LookupSupported = true,
                        Support = 3, IsTransfer = true, SwiftCode = "ICBVVNVX"
                    },
                    new BankDTO
                    {
                        Id = 43, Name = "Ngân hàng TMCP Ngoại Thương Việt Nam", Code = "VCB",
                        Bin = "970436", ShortName = "Vietcombank",
                        Logo = "https://api.vietqr.io/img/VCB.png",
                        TransferSupported = true, LookupSupported = true,
                        Support = 3, IsTransfer = true, SwiftCode = "BFTVVNVX"
                    }
                };

                var colors = new List<object>
                {
                    new { Name = "Red", Code = "#FF0000" },
                    new { Name = "Green", Code = "#00FF00" }
                };

                var systemConfigsToSeed = new List<SystemConfig>
                {
                    new SystemConfig
                    {
                        Id = "BANK", Bank = JsonConvert.SerializeObject(banks),
                        Color = null, Size = "M"
                    },
                    new SystemConfig
                    {
                        Id = "COLOR", Bank = null,
                        Color = JsonConvert.SerializeObject(colors), Size = "L"
                    },
                    new SystemConfig
                    {
                        Id = "SIZE", Bank = null,
                        Color = null, Size = "XL"
                    }
                };

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
        #endregion

        #region Add Data
        [Authorize(Roles = "admin")]
        [HttpPost("add-banks")]
        public async Task<IActionResult> AddBanks([FromBody] List<BankDTO> banksToAdd, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Adding banks to SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "BANK");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'BANK' not found.");
                }

                var existingBanks = string.IsNullOrEmpty(systemConfig.Bank)
                    ? new List<BankDTO>()
                    : JsonConvert.DeserializeObject<List<BankDTO>>(systemConfig.Bank);

                existingBanks.AddRange(banksToAdd);
                var distinctBanks = existingBanks.GroupBy(b => b.Id).Select(g => g.First()).ToList();

                systemConfig.Bank = JsonConvert.SerializeObject(distinctBanks);
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

        [Authorize(Roles = "admin")]
        [HttpPost("add-colors")]
        public async Task<IActionResult> AddColors([FromBody] List<object> colorsToAdd, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Adding colors to SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "COLOR");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'COLOR' not found.");
                }

                var existingColors = string.IsNullOrEmpty(systemConfig.Color)
                    ? new List<object>()
                    : JsonConvert.DeserializeObject<List<object>>(systemConfig.Color);

                existingColors.AddRange(colorsToAdd);
                var distinctColors = existingColors.Distinct().ToList();

                systemConfig.Color = JsonConvert.SerializeObject(distinctColors);
                await context.SaveChangesAsync();

                _logger.Success("Colors added successfully.");
                return Ok(ApiResult<object>.Success(distinctColors, "Colors added successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error adding colors: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while adding colors: {ex.Message}"));
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("add-sizes")]
        public async Task<IActionResult> AddSize([FromBody] string sizeToAdd, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Adding size to SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "SIZE");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'SIZE' not found.");
                }

                systemConfig.Size = sizeToAdd;
                await context.SaveChangesAsync();

                _logger.Success("Size added successfully.");
                return Ok(ApiResult<string>.Success(sizeToAdd, "Size added successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error adding size: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while adding size: {ex.Message}"));
            }
        }
        #endregion

        #region Get Data
        [ProducesResponseType(typeof(List<SystemConfig>), StatusCodes.Status200OK)]
        [HttpGet("get-banks")]
        public async Task<IActionResult> GetBanks([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Fetching list of banks from SystemConfig.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "BANK");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'BANK' not found.");
                }

                var existingBanks = string.IsNullOrEmpty(systemConfig.Bank)
                    ? new List<BankDTO>()
                    : JsonConvert.DeserializeObject<List<BankDTO>>(systemConfig.Bank);

                return Ok(ApiResult<object>.Success(existingBanks, "Fetched list of banks successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching banks: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while fetching banks: {ex.Message}"));
            }
        }

        [HttpGet("get-colors")]
        public async Task<IActionResult> GetColors([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Fetching list of colors from SystemConfig.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "COLOR");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'COLOR' not found.");
                }

                var existingColors = string.IsNullOrEmpty(systemConfig.Color)
                    ? new List<object>()
                    : JsonConvert.DeserializeObject<List<object>>(systemConfig.Color);

                return Ok(ApiResult<object>.Success(existingColors, "Fetched list of colors successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching colors: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while fetching colors: {ex.Message}"));
            }
        }

        [HttpGet("get-sizes")]
        public async Task<IActionResult> GetSizes([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Fetching size from SystemConfig.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "SIZE");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'SIZE' not found.");
                }

                return Ok(ApiResult<object>.Success(systemConfig.Size, "Fetched size successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error fetching size: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while fetching size: {ex.Message}"));
            }
        }
        #endregion

        #region Delete Data
        [Authorize(Roles = "admin")]
        [HttpDelete("delete-banks")]
        public async Task<IActionResult> DeleteBanks([FromBody] List<int> bankIdsToDelete, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Deleting banks from SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "BANK");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'BANK' not found.");
                }

                var existingBanks = string.IsNullOrEmpty(systemConfig.Bank)
                    ? new List<BankDTO>()
                    : JsonConvert.DeserializeObject<List<BankDTO>>(systemConfig.Bank);

                var updatedBanks = existingBanks.Where(b => !bankIdsToDelete.Contains(b.Id)).ToList();
                systemConfig.Bank = JsonConvert.SerializeObject(updatedBanks);

                await context.SaveChangesAsync();
                return Ok(ApiResult<object>.Success(updatedBanks, "Banks deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error deleting banks: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while deleting banks: {ex.Message}"));
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-colors")]
        public async Task<IActionResult> DeleteColors([FromBody] List<string> colorsToDelete, [FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Deleting colors from SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "COLOR");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'COLOR' not found.");
                }

                var existingColors = string.IsNullOrEmpty(systemConfig.Color)
                    ? new List<object>()
                    : JsonConvert.DeserializeObject<List<object>>(systemConfig.Color);

                var updatedColors = existingColors.Where(c => !colorsToDelete.Contains(c.ToString())).ToList();
                systemConfig.Color = JsonConvert.SerializeObject(updatedColors);

                await context.SaveChangesAsync();
                return Ok(ApiResult<object>.Success(updatedColors, "Colors deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error deleting colors: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while deleting colors: {ex.Message}"));
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-size")]
        public async Task<IActionResult> DeleteSize([FromServices] GoodsDesignDbContext context)
        {
            try
            {
                _logger.Info("Deleting size from SystemConfig initiated.");
                var systemConfig = await context.SystemConfigs.FirstOrDefaultAsync(sc => sc.Id == "SIZE");
                if (systemConfig == null)
                {
                    throw new KeyNotFoundException("SystemConfig with Id 'SIZE' not found.");
                }

                systemConfig.Size = null;

                await context.SaveChangesAsync();
                return Ok(ApiResult<object>.Success(null, "Size deleted successfully."));
            }
            catch (Exception ex)
            {
                _logger.Error($"Error deleting size: {ex.Message}");
                return StatusCode(500, ApiResult<object>.Error($"An error occurred while deleting size: {ex.Message}"));
            }
        }
        #endregion
    }
}
