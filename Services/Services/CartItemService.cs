using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.CartDTOs;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class CartItemService : ICartItemService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILoggerService _logger;
        private readonly IClaimsService _claimsService; // Lấy thông tin UserId từ đây

        public CartItemService(IMapper mapper, IUnitOfWork unitOfWork, ILoggerService logger, IClaimsService claimsService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _claimsService = claimsService;
        }

        public async Task<CartDTO> GetCartByUserId(Guid userId)
        {
            _logger.Info($"Retrieving cart for user ID: {userId}");

            var cartItems = await _unitOfWork.CartItemGenericRepository.GetAllAsync(
                ci => ci.UserId == userId,
                ci => ci.Product
            );

            var cartItemDTOs = cartItems.Select(ci => _mapper.Map<CartItemDTO>(ci)).ToList();

            return new CartDTO
            {
                UserId = userId,
                Items = cartItemDTOs
            };
        }

        // Thêm sản phẩm vào giỏ hàng
        public async Task<CartItemDTO> AddCartItem(CartItemCreateDTO cartItemDTO, Guid userId)
        {
            //var userId = _claimsService.GetCurrentUserId;
            _logger.Info($"Adding cart item for user {userId}");

            var product = await _unitOfWork.ProductGenericRepository.GetByIdAsync(cartItemDTO.ProductId);
            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {cartItemDTO.ProductId} not found.");
            }

            // Kiểm tra nếu đã tồn tại sản phẩm trong giỏ hàng
            var existingCartItem = await _unitOfWork.CartItemGenericRepository.GetQueryable()
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == cartItemDTO.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += cartItemDTO.Quantity;
                //  existingCartItem.UnitPrice = product.Price; // Cập nhật giá mới
                await _unitOfWork.CartItemGenericRepository.Update(existingCartItem);
                await _unitOfWork.SaveChangesAsync();
                _logger.Success("Cart item existing updated successfully.");

                return _mapper.Map<CartItemDTO>(existingCartItem);

            }

            var newCartItem = new CartItem
            {
                UserId = userId,
                ProductId = product.Id,
                Quantity = cartItemDTO.Quantity,
                UnitPrice = cartItemDTO.UnitPrice
            };

            newCartItem = await _unitOfWork.CartItemGenericRepository.AddAsync(newCartItem);


            await _unitOfWork.SaveChangesAsync();
            _logger.Success("Cart item added successfully.");

            return _mapper.Map<CartItemDTO>(newCartItem);
        }


        // Xóa sản phẩm khỏi giỏ hàng
        public async Task<bool> RemoveCartItem(Guid productId)
        {
            var userId = _claimsService.GetCurrentUserId;
            _logger.Info($"Removing cart item for user {userId}");

            var cartItem = await _unitOfWork.CartItemGenericRepository.GetQueryable()
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException($"Cart item with ProductId {productId} not found for user {userId}.");
            }

            await _unitOfWork.CartItemGenericRepository.SoftRemove(cartItem);
            await _unitOfWork.SaveChangesAsync();

            _logger.Success("Cart item removed successfully.");
            return true;
        }

        // Lấy giỏ hàng của người dùng hiện tại
        public async Task<CartDTO> GetCart(Guid userId)
        {
            _logger.Info($"Fetching cart for user {userId}");

            var cartItems = await _unitOfWork.CartItemGenericRepository.GetQueryable()
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
            .ToListAsync();



            var cartDTO = new CartDTO
            {
                UserId = userId,
                Items = _mapper.Map<List<CartItemDTO>>(cartItems)

            };

            return cartDTO;
        }

        public async Task<bool> ClearUserCart(Guid userId)
        {
            return await _unitOfWork.CartItemGenericRepository.HardRemove(ci => ci.UserId == userId);

        }
    }
}
