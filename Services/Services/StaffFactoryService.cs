using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.FactoryDTOs;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

public class StaffFactoryService : IStaffFactoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILoggerService _logger;
    private readonly IUserService _userService; // nếu muốn kiểm tra user
    private readonly IMapper _mapper;
    // private readonly IFactoryService _factoryService; // nếu muốn kiểm tra factory

    public StaffFactoryService(
        IUnitOfWork unitOfWork,
        ILoggerService logger,
        IUserService userService,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// Assign staff (User) vào FactoryOwner (Factory).
    /// </summary>
    public async Task<StaffFactoryDTO> AssignStaffAsync(Guid staffUserId, Guid factoryOwnerId)
    {
        _logger.Info("Assigning staff to factory...");

        // (1) Kiểm tra user có tồn tại không
        var user = await _userService.GetCurrentUser(staffUserId.ToString());
        if (user == null)
        {
            _logger.Warn($"User (staff) with ID {staffUserId} not found.");
            throw new KeyNotFoundException("User (staff) not found.");
        }

        // (2) Kiểm tra factoryOwner (Factory) có tồn tại không
        var factoryOwner = await _unitOfWork.FactoryRepository.GetByIdAsync(factoryOwnerId);
        if (factoryOwner == null)
        {
            _logger.Warn($"Factory owner with ID {factoryOwnerId} not found.");
            throw new KeyNotFoundException("Factory owner not found.");
        }

        // (3) Tạo StaffFactory record
        var staffFactory = new StaffFactory
        {
            UserId = staffUserId,
            FactoryOwnerId = factoryOwnerId,
        };

        var result = await _unitOfWork.StaffFactoryGenericRepository.AddAsync(staffFactory);
        await _unitOfWork.SaveChangesAsync();

        _logger.Success($"Assigned staff (UserId={staffUserId}) to FactoryOwner (Id={factoryOwnerId}).");
        return _mapper.Map<StaffFactoryDTO>(result);
    }
}
