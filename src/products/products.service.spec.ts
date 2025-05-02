import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductEntity } from './entities/products.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;
  let categoryService: CategoriesService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCategoryService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoryService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: '1',
      };
      const userId = '1';

      const mockCategory = {
        id: '1',
        isActive: true,
      };

      const mockProduct = {
        id: '1',
        ...createProductDto,
        createdBy: userId,
        category: mockCategory,
      };

      mockCategoryService.findOne.mockResolvedValue(mockCategory);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto, userId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.id).toBe('1');
    });

    it('should throw BadRequestException for non-existent category', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: 'nonexistent',
      };
      const userId = '1';

      mockCategoryService.findOne.mockResolvedValue(null);

      await expect(service.create(createProductDto, userId))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for inactive category', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: '1',
      };
      const userId = '1';

      const mockCategory = {
        id: '1',
        isActive: false,
      };

      mockCategoryService.findOne.mockResolvedValue(mockCategory);

      await expect(service.create(createProductDto, userId))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all active products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          isDeleted: false,
          category: { id: '1', name: 'Category 1' },
          variants: [],
          positionTypes: [],
          discounts: [],
        },
        {
          id: '2',
          name: 'Product 2',
          isDeleted: false,
          category: { id: '1', name: 'Category 1' },
          variants: [],
          positionTypes: [],
          discounts: [],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ProductEntity);
    });

    it('should return all products including deleted ones', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          isDeleted: true,
          category: { id: '1', name: 'Category 1' },
          variants: [],
          positionTypes: [],
          discounts: [],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ProductEntity);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isDeleted: false,
        category: { id: '1', name: 'Category 1' },
        variants: [],
        discounts: [],
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.findOne(productId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.id).toBe(productId);
    });

    it('should throw NotFoundException for non-existent product', async () => {
      const productId = 'nonexistent';
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.findOne(productId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '1';
      const updateProductDto = {
        name: 'Updated Product',
        price: 200,
      };
      const userId = '1';

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isDeleted: false,
        category: { id: '1', name: 'Category 1' },
      };

      const updatedProduct = {
        ...mockProduct,
        ...updateProductDto,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateProductDto, userId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toBe(updateProductDto.name);
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      const productId = '1';
      const userId = '1';

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isDeleted: false,
        category: { id: '1', name: 'Category 1' },
      };

      const deletedProduct = {
        ...mockProduct,
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(deletedProduct);

      const result = await service.remove(productId, userId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.isDeleted).toBe(true);
    });
  });

  describe('restore', () => {
    it('should restore a deleted product', async () => {
      const productId = '1';
      const userId = '1';

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isDeleted: true,
        category: { id: '1', name: 'Category 1' },
      };

      const restoredProduct = {
        ...mockProduct,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(restoredProduct);

      const result = await service.restore(productId, userId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.isDeleted).toBe(false);
    });

    it('should throw NotFoundException when restoring non-deleted product', async () => {
      const productId = '1';
      const userId = '1';

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isDeleted: false,
        category: { id: '1', name: 'Category 1' },
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      await expect(service.restore(productId, userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('should toggle product active status', async () => {
      const productId = '1';
      const userId = '1';

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isActive: true,
        category: { id: '1', name: 'Category 1' },
      };

      const updatedProduct = {
        ...mockProduct,
        isActive: false,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.toggleActive(productId, userId);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.isActive).toBe(false);
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const categoryId = '1';
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          categoryId,
          isDeleted: false,
          category: { id: categoryId, name: 'Category 1' },
        },
        {
          id: '2',
          name: 'Product 2',
          categoryId,
          isDeleted: false,
          category: { id: categoryId, name: 'Category 1' },
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findByCategory(categoryId);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ProductEntity);
      expect(result[0].categoryId).toBe(categoryId);
    });
  });
}); 