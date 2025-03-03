using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.ProductDesignDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class ProductDesignService : IProductDesignService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;

        public ProductDesignService(ILoggerService logger, IMapper mapper, IUnitOfWork unitOfWork, IUserService userService)
        {
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userService = userService;
        }

        public async Task<ProductDesign> CreateProductDesign(ProductDesignCreateDTO dto)
        {
            _logger.Info("Creating a new product design...");

            try
            {
                // Kiểm tra User có tồn tại không
                var user = await _userService.GetCurrentUser(dto.UserId.ToString());
                if (user == null)
                {
                    _logger.Warn($"User with ID {dto.UserId} not found.");
                    throw new KeyNotFoundException("400 - User not found.");
                }

                // Kiểm tra BlankVariance có tồn tại không
                var blankVariance = await _unitOfWork.BlankVarianceRepository.GetByIdAsync(dto.BlankVarianceId);
                if (blankVariance == null)
                {
                    _logger.Warn($"BlankVariance with ID {dto.BlankVarianceId} not found.");
                    throw new KeyNotFoundException("400 - BlankVariance not found.");
                }

                // Map DTO sang entity
                var productDesign = _mapper.Map<ProductDesign>(dto);
                var result = await _unitOfWork.ProductDesignGenericRepository.AddAsync(productDesign);
                await _unitOfWork.SaveChangesAsync();

                _logger.Success("Product design created successfully.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error while creating product design: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductDesign> GetById(Guid id)
        {
            _logger.Info($"Fetching product design with ID: {id}");

            try
            {
                var productDesign = await _unitOfWork.ProductDesignGenericRepository.GetByIdAsync(id);
                if (productDesign == null)
                {
                    _logger.Warn($"Product design with ID {id} not found.");
                    throw new KeyNotFoundException("404 - Product design not found.");
                }

                return productDesign;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error fetching product design: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductDesignDTO> PatchProductDesignAsync(Guid id, ProductDesignUpdateDTO dto)
        {
            _logger.Info($"Patching product design with ID: {id}");

            // 1. Lấy ProductDesign hiện có
            var existingPD = await _unitOfWork.ProductDesignGenericRepository.GetByIdAsync(id);
            if (existingPD == null)
            {
                _logger.Warn($"ProductDesign with ID {id} not found.");
                throw new KeyNotFoundException("404 - ProductDesign not found.");
            }

            // 2. Xử lý thủ công những field có logic riêng

            // -- (A) Kiểm tra & cập nhật UserId
            //if (existingPD.UserId.HasValue)
            //{
            //    var user = await _userService.GetCurrentUser(dto.UserId.Value.ToString());
            //    if (user == null) throw new KeyNotFoundException("400 - User not found.");
            //    existingPD.UserId = dto.UserId.Value;
            //}

            //// -- (B) Kiểm tra & cập nhật BlankVarianceId
            //if (existingPD.BlankVarianceId.HasValue)
            //{
            //    var blankVariance = await _unitOfWork.BlankVarianceRepository.GetByIdAsync(dto.BlankVarianceId.Value);
            //    if (blankVariance == null) throw new KeyNotFoundException("400 - BlankVariance not found.");
            //    existingPD.BlankVarianceId = dto.BlankVarianceId.Value;
            //}

            // 3. Dùng reflection để cập nhật các field còn lại
            //    (bỏ qua UserId, BlankVarianceId vì đã xử lý trên)
            var patchDtoType = typeof(ProductDesignUpdateDTO);
            var productDesignType = typeof(ProductDesign);

            // Danh sách property tên “đặc biệt” (đã xử lý thủ công)
            var specialProps = new HashSet<string> { nameof(dto.UserId), nameof(dto.BlankVarianceId) };

            foreach (var prop in patchDtoType.GetProperties())
            {
                if (specialProps.Contains(prop.Name)) continue; // bỏ qua field đặc biệt

                // Lấy value từ DTO
                var value = prop.GetValue(dto);
                if (value is null) continue; // null => ko update

                // Tìm property tương ứng bên ProductDesign
                var entityProp = productDesignType.GetProperty(prop.Name);
                if (entityProp != null && entityProp.CanWrite)
                {
                    // Gán value
                    // Ví dụ: existingPD.Saved3DPreviewUrl = dto.Saved3DPreviewUrl
                    entityProp.SetValue(existingPD, value);
                }
            }

            // 4. Lưu DB
            await _unitOfWork.ProductDesignGenericRepository.Update(existingPD);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"ProductDesign with ID {id} patched via reflection successfully.");
            return _mapper.Map<ProductDesignDTO>(existingPD);
        }

        public async Task<bool> DeleteProductDesignAsync(Guid id)
        {
            _logger.Info($"Deleting product design with ID: {id}");

            // Lấy design
            var existingPD = await _unitOfWork.ProductDesignGenericRepository.GetByIdAsync(id);
            if (existingPD == null)
            {
                _logger.Warn($"Product design with ID {id} not found.");
                throw new KeyNotFoundException("404 - Product design not found.");
            }

            // Hard remove (bạn có thể đổi thành soft remove tùy ý)
            var removed = await _unitOfWork.ProductDesignGenericRepository.HardRemove(x => x.Id == id);
            if (!removed)
            {
                _logger.Error("Failed to delete product design.");
                throw new Exception("500 - Failed to delete product design.");
            }

            await _unitOfWork.SaveChangesAsync();
            _logger.Success($"Product design with ID {id} deleted successfully.");
            return true;
        }


          public async Task<ProductDesignDTO> DuplicateProductDesignAsync(Guid sourceDesignId)
        {
            _logger.Info($"Duplicating product design with ID: {sourceDesignId}");

            // Lấy ProductDesign cũ, kèm DesignPositions nếu muốn copy
            var oldDesign = await _unitOfWork.ProductDesignGenericRepository
                .GetByIdAsync(sourceDesignId, x => x.DesignPositions);

            if (oldDesign == null)
            {
                _logger.Warn($"Product design with ID {sourceDesignId} not found.");
                throw new KeyNotFoundException("404 - Product design not found.");
            }

            // Tạo ProductDesign mới và copy các field cần thiết
            var newDesign = new ProductDesign
            {
                UserId = oldDesign.UserId,
                BlankVarianceId = oldDesign.BlankVarianceId,
                Saved3DPreviewUrl = oldDesign.Saved3DPreviewUrl,
                IsFinalized = oldDesign.IsFinalized,
                IsPublic = oldDesign.IsPublic,
                IsTemplate = oldDesign.IsTemplate,
                CreatedAt = DateTime.UtcNow // Ngày tạo mới
            };

            // Copy DesignPositions
            if (oldDesign.DesignPositions != null && oldDesign.DesignPositions.Any())
            {
                newDesign.DesignPositions = new List<DesignPosition>();
                foreach (var oldPos in oldDesign.DesignPositions)
                {
                    var newPos = new DesignPosition
                    {
                        ProductPositionTypeId = oldPos.ProductPositionTypeId,
                        DesignJSON = oldPos.DesignJSON
                        // EF sẽ tự gán ProductDesignId khi save
                    };
                    newDesign.DesignPositions.Add(newPos);
                }
            }

            // Lưu vào DB
            await _unitOfWork.ProductDesignGenericRepository.AddAsync(newDesign);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success($"Duplicated product design from ID {sourceDesignId} to new ID {newDesign.Id}.");

            // Trả về DTO
            return _mapper.Map<ProductDesignDTO>(newDesign);
        }

    }
}
