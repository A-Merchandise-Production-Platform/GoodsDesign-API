import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CartItemEntity } from './entities/cart-items.entity';
import { UserEntity } from '../users';

describe('CartItemsService', () => {
  let service: CartItemsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cartItem: {
      count: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    systemConfigVariant: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureUserIsAuthenticated', () => {
    it('should throw UnauthorizedException when user is not provided', async () => {
      await expect(service.ensureUserIsAuthenticated(null))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return user when user is provided', async () => {
      const mockUser = { id: '1' } as UserEntity;
      const result = await service.ensureUserIsAuthenticated(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getCartItemCount', () => {
    it('should return the count of cart items for a user', async () => {
      const userId = '1';
      const expectedCount = 5;
      mockPrismaService.cartItem.count.mockResolvedValue(expectedCount);

      const result = await service.getCartItemCount(userId);
      expect(result).toBe(expectedCount);
      expect(mockPrismaService.cartItem.count).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('addDesignToCart', () => {
    const userId = '1';
    const createCartItemDto = {
      designId: 'design1',
      quantity: 2,
    };

    it('should find system config variant when not provided', async () => {
      const mockSystemConfigVariant = { id: 'variant1' };
      mockPrismaService.systemConfigVariant.findFirst.mockResolvedValue(mockSystemConfigVariant);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({
        id: '1',
        ...createCartItemDto,
        systemConfigVariantId: 'variant1',
      });

      await service.addDesignToCart(createCartItemDto, userId);
      expect(mockPrismaService.systemConfigVariant.findFirst).toHaveBeenCalledWith({
        where: { productId: createCartItemDto.designId },
      });
    });

    it('should throw NotFoundException when system config variant not found', async () => {
      mockPrismaService.systemConfigVariant.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockImplementation(() => {
        throw new NotFoundException(`System config variant with ID ${createCartItemDto.designId} not found`);
      });

      await expect(service.addDesignToCart(createCartItemDto, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should update quantity when item already exists in cart', async () => {
      const existingItem = {
        id: '1',
        userId,
        quantity: 1,
        ...createCartItemDto,
        systemConfigVariantId: 'variant1',
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(existingItem);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...existingItem,
        quantity: 3,
      });

      const result = await service.addDesignToCart(createCartItemDto, userId);
      expect(result).toBeInstanceOf(CartItemEntity);
      expect(result.quantity).toBe(3);
    });

    it('should create new cart item when it does not exist', async () => {
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({
        id: '1',
        ...createCartItemDto,
        systemConfigVariantId: 'variant1',
      });

      const result = await service.addDesignToCart(createCartItemDto, userId);
      expect(result).toBeInstanceOf(CartItemEntity);
      expect(mockPrismaService.cartItem.create).toHaveBeenCalled();
    });
  });

  describe('getUserCartItems', () => {
    it('should return user cart items sorted by id', async () => {
      const userId = '1';
      const mockCartItems = [
        { id: '2', userId, design: {}, systemConfigVariant: {} },
        { id: '1', userId, design: {}, systemConfigVariant: {} },
      ];
      mockPrismaService.cartItem.findMany.mockResolvedValue(mockCartItems);

      const result = await service.getUserCartItems(userId);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(CartItemEntity);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('getCartItemById', () => {
    it('should return cart item by id', async () => {
      const id = '1';
      const userId = '1';
      const mockCartItem = {
        id,
        userId,
        design: {},
        systemConfigVariant: {},
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);

      const result = await service.getCartItemById(id, userId);
      expect(result).toBeInstanceOf(CartItemEntity);
      expect(result.id).toBe(id);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      const id = 'nonexistent';
      const userId = '1';
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.getCartItemById(id, userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update cart item quantity', async () => {
      const id = '1';
      const userId = '1';
      const updateDto = { quantity: 5 };
      const mockCartItem = {
        id,
        userId,
        quantity: 2,
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        ...updateDto,
      });

      const result = await service.updateCartItemQuantity(id, updateDto, userId);
      expect(result).toBeInstanceOf(CartItemEntity);
      expect(result.quantity).toBe(updateDto.quantity);
    });

    it('should throw NotFoundException when cart item not found', async () => {
      const id = 'nonexistent';
      const userId = '1';
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.updateCartItemQuantity(id, { quantity: 5 }, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when updating another user\'s cart item', async () => {
      const id = '1';
      const userId = '1';
      const mockCartItem = {
        id,
        userId: '2',
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);

      await expect(service.updateCartItemQuantity(id, { quantity: 5 }, userId))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item', async () => {
      const id = '1';
      const userId = '1';
      const mockCartItem = {
        id,
        userId,
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.delete.mockResolvedValue(mockCartItem);

      const result = await service.removeCartItem(id, userId);
      expect(result).toBeInstanceOf(CartItemEntity);
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when cart item not found', async () => {
      const id = 'nonexistent';
      const userId = '1';
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.removeCartItem(id, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when removing another user\'s cart item', async () => {
      const id = '1';
      const userId = '1';
      const mockCartItem = {
        id,
        userId: '2',
      };
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);

      await expect(service.removeCartItem(id, userId))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('removeAllUserCartItems', () => {
    it('should remove all cart items for a user', async () => {
      const userId = '1';
      await service.removeAllUserCartItems(userId);
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
}); 