import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CategoryEntity } from './entities/categories.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };
      const userId = '1';

      const mockCategory = {
        id: '1',
        ...createCategoryDto,
        createdBy: userId,
        isActive: true,
      };

      mockPrismaService.category.create.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.create(createCategoryDto, userId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.id).toBe('1');
      expect(result.isActive).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return all active categories', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Category 1',
          isDeleted: false,
          products: [],
        },
        {
          id: '2',
          name: 'Category 2',
          isDeleted: false,
          products: [],
        },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(CategoryEntity);
    });

    it('should return all categories including deleted ones', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Category 1',
          isDeleted: true,
          products: [],
        },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.findAll(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(CategoryEntity);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = '1';
      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isDeleted: false,
        products: [],
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.findOne(categoryId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.id).toBe(categoryId);
    });

    it('should throw NotFoundException for non-existent category', async () => {
      const categoryId = 'nonexistent';
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne(categoryId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '1';
      const updateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      const userId = '1';

      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isDeleted: false,
        products: [],
      };

      const updatedCategory = {
        ...mockCategory,
        ...updateCategoryDto,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.update(categoryId, updateCategoryDto, userId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.name).toBe(updateCategoryDto.name);
    });
  });

  describe('remove', () => {
    it('should soft delete a category', async () => {
      const categoryId = '1';
      const userId = '1';

      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isDeleted: false,
        products: [],
      };

      const deletedCategory = {
        ...mockCategory,
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue(deletedCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.remove(categoryId, userId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.isDeleted).toBe(true);
    });
  });

  describe('restore', () => {
    it('should restore a deleted category', async () => {
      const categoryId = '1';
      const userId = '1';

      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isDeleted: true,
        products: [],
      };

      const restoredCategory = {
        ...mockCategory,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue(restoredCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.restore(categoryId, userId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.isDeleted).toBe(false);
    });

    it('should throw NotFoundException when restoring non-deleted category', async () => {
      const categoryId = '1';
      const userId = '1';

      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isDeleted: false,
        products: [],
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);

      await expect(service.restore(categoryId, userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('should toggle category active status', async () => {
      const categoryId = '1';
      const userId = '1';

      const mockCategory = {
        id: categoryId,
        name: 'Test Category',
        isActive: true,
        products: [],
      };

      const updatedCategory = {
        ...mockCategory,
        isActive: false,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.toggleActive(categoryId, userId);
      expect(result).toBeInstanceOf(CategoryEntity);
      expect(result.isActive).toBe(false);
    });
  });
}); 