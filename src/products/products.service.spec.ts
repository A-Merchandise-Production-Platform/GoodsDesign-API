import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCategory = {
    id: 'category1',
    name: 'Electronics',
    description: 'Electronic devices',
    imageUrl: 'https://example.com/category.jpg',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'user1',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockProduct = {
    id: '1',
    name: 'Modern Chair',
    description: 'A comfortable modern chair',
    imageUrl: 'https://example.com/chair.jpg',
    model3DUrl: 'https://example.com/chair.glb',
    categoryId: 'category1',
    category: mockCategory,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'user1',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'Modern Chair',
        description: 'A comfortable modern chair',
        imageUrl: 'https://example.com/chair.jpg',
        model3DUrl: 'https://example.com/chair.glb',
        categoryId: 'category1',
      };
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDto, 'user1');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'user1',
        },
        include: {
          category: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted products by default', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      });
    });

    it('should return all products including deleted when specified', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll(true);

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      });
    });
  });

  describe('findByCategory', () => {
    it('should return all products for a specific category', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findByCategory('category1');

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          categoryId: 'category1',
          isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: '1',
          isDeleted: false,
        },
        include: {
          category: true,
        },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Chair' };
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        ...updateDto,
      });

      const result = await service.update('1', updateDto, 'user1');

      expect(result).toEqual({ ...mockProduct, ...updateDto });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateDto,
          updatedAt: expect.any(Date),
          updatedBy: 'user1',
        },
        include: {
          category: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        isDeleted: true,
      });

      const result = await service.remove('1', 'user1');

      expect(result.isDeleted).toBe(true);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
          deletedBy: 'user1',
        },
        include: {
          category: true,
        },
      });
    });
  });

  describe('restore', () => {
    it('should restore a deleted product', async () => {
      const deletedProduct = { ...mockProduct, isDeleted: true };
      mockPrismaService.product.findFirst.mockResolvedValue(deletedProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...deletedProduct,
        isDeleted: false,
      });

      const result = await service.restore('1', 'user1');

      expect(result.isDeleted).toBe(false);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: expect.any(Date),
          updatedBy: 'user1',
        },
        include: {
          category: true,
        },
      });
    });
  });

  describe('toggleActive', () => {
    it('should toggle product active status', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        isActive: false,
      });

      const result = await service.toggleActive('1', 'user1');

      expect(result.isActive).toBe(false);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isActive: false,
          updatedAt: expect.any(Date),
          updatedBy: 'user1',
        },
        include: {
          category: true,
        },
      });
    });
  });
});