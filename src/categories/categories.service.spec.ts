import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
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
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCategory = {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices',
    imageUrl: 'https://example.com/image.jpg',
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
    it('should create a category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Electronics',
        description: 'Electronic devices',
        imageUrl: 'https://example.com/image.jpg',
      };
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      const result = await service.create(createDto, 'user1');

      expect(result).toEqual(mockCategory);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'user1',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted categories by default', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return all categories including deleted when specified', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll(true);

      expect(result).toEqual([mockCategory]);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);

      const result = await service.findOne('1');

      expect(result).toEqual(mockCategory);
      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: '1',
          isDeleted: false,
        },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateDto: UpdateCategoryDto = { name: 'Updated Electronics' };
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        ...updateDto,
      });

      const result = await service.update('1', updateDto, 'user1');

      expect(result).toEqual({ ...mockCategory, ...updateDto });
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateDto,
          updatedAt: expect.any(Date),
          updatedBy: 'user1',
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        isDeleted: true,
      });

      const result = await service.remove('1', 'user1');

      expect(result.isDeleted).toBe(true);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
          deletedBy: 'user1',
        },
      });
    });
  });
});