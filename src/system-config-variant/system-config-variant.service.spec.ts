import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigVariantService } from './system-config-variant.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SystemConfigVariantEntity } from './entities/system-config-variant.entity';
import { UpdateSystemConfigVariantInput } from './dto/update-system-config-variant.input';

describe('SystemConfigVariantService', () => {
  let service: SystemConfigVariantService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    systemConfigVariant: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigVariantService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SystemConfigVariantService>(SystemConfigVariantService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new system config variant', async () => {
      const createInput = {
        productId: '1',
        color: 'Red',
        size: 'M',
        model: 'Model1',
        price: 100,
      };

      const mockVariant = {
        id: '1',
        ...createInput,
        isActive: true,
        isDeleted: false,
        product: { id: '1' },
        productDesigns: [],
      };

      mockPrismaService.systemConfigVariant.create.mockResolvedValue(mockVariant);

      const result = await service.create(createInput);
      expect(result).toBeDefined();
      expect(mockPrismaService.systemConfigVariant.create).toHaveBeenCalledWith({
        data: {
          ...createInput,
          isActive: true,
          isDeleted: false,
        },
        include: {
          product: true,
          productDesigns: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all active system config variants', async () => {
      const mockVariants = [
        {
          id: '1',
          productId: '1',
          color: 'Red',
          size: 'M',
          model: 'Model1',
          price: 100,
          isActive: true,
          isDeleted: false,
          product: { id: '1' },
          productDesigns: [],
        },
      ];

      mockPrismaService.systemConfigVariant.findMany.mockResolvedValue(mockVariants);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockPrismaService.systemConfigVariant.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: false,
        },
        include: {
          product: true,
          productDesigns: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific system config variant', async () => {
      const variantId = '1';
      const mockVariant = {
        id: variantId,
        productId: '1',
        color: 'Red',
        size: 'M',
        model: 'Model1',
        price: 100,
        isActive: true,
        isDeleted: false,
        product: { id: '1' },
        productDesigns: [],
      };

      mockPrismaService.systemConfigVariant.findUnique.mockResolvedValue(mockVariant);

      const result = await service.findOne(variantId);
      expect(result).toBeDefined();
      expect(mockPrismaService.systemConfigVariant.findUnique).toHaveBeenCalledWith({
        where: { id: variantId },
        include: {
          product: true,
          productDesigns: true,
        },
      });
    });

    it('should throw NotFoundException when variant is not found', async () => {
      const variantId = '1';
      mockPrismaService.systemConfigVariant.findUnique.mockResolvedValue(null);

      await expect(service.findOne(variantId))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when variant is deleted', async () => {
      const variantId = '1';
      const mockVariant = {
        id: variantId,
        isDeleted: true,
      };

      mockPrismaService.systemConfigVariant.findUnique.mockResolvedValue(mockVariant);

      await expect(service.findOne(variantId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProduct', () => {
    it('should return variants for a specific product', async () => {
      const productId = '1';
      const mockVariants = [
        {
          id: '1',
          productId,
          color: 'Red',
          size: 'M',
          model: 'Model1',
          price: 100,
          isActive: true,
          isDeleted: false,
          product: { id: productId },
          productDesigns: [],
        },
      ];

      mockPrismaService.systemConfigVariant.findMany.mockResolvedValue(mockVariants);

      const result = await service.findByProduct(productId);
      expect(result).toHaveLength(1);
      expect(mockPrismaService.systemConfigVariant.findMany).toHaveBeenCalledWith({
        where: {
          productId,
          isDeleted: false,
        },
        include: {
          product: true,
          productDesigns: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a variant', async () => {
      const variantId = '1';
      const updateInput: UpdateSystemConfigVariantInput = {
        id: variantId,
        size: 'L',
        color: 'Red',
        model: '2023',
        isActive: true
      };

      const mockUpdatedVariant = {
        id: variantId,
        productId: '1',
        ...updateInput,
        isDeleted: false,
      };

      mockPrismaService.systemConfigVariant.update.mockResolvedValue(mockUpdatedVariant);

      const result = await service.update(variantId, updateInput);
      expect(result).toBeInstanceOf(SystemConfigVariantEntity);
      expect(mockPrismaService.systemConfigVariant.update).toHaveBeenCalledWith({
        where: { id: variantId },
        data: updateInput,
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a system config variant', async () => {
      const variantId = '1';
      const mockDeletedVariant = {
        id: variantId,
        isDeleted: true,
      };

      mockPrismaService.systemConfigVariant.update.mockResolvedValue(mockDeletedVariant);

      const result = await service.remove(variantId);
      expect(result).toBeDefined();
      expect(mockPrismaService.systemConfigVariant.update).toHaveBeenCalledWith({
        where: { id: variantId },
        data: { isDeleted: true },
      });
    });
  });

  describe('getDistinctVariantAttributes', () => {
    it('should return distinct variant attributes for a product', async () => {
      const productId = '1';
      const mockVariants = [
        { color: 'Red', size: 'M', model: 'Model1' },
        { color: 'Blue', size: 'L', model: 'Model2' },
        { color: 'Red', size: 'S', model: 'Model1' },
      ];

      mockPrismaService.systemConfigVariant.findMany.mockResolvedValue(mockVariants);

      const result = await service.getDistinctVariantAttributes(productId);
      expect(result).toEqual({
        colors: ['Red', 'Blue'],
        sizes: ['M', 'L', 'S'],
        models: ['Model1', 'Model2'],
      });
      expect(mockPrismaService.systemConfigVariant.findMany).toHaveBeenCalledWith({
        where: {
          productId,
          isDeleted: false,
        },
        select: {
          color: true,
          size: true,
          model: true,
        },
      });
    });
  });
}); 