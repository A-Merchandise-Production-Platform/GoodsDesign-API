import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigColorsService } from './system-config-colors.service';
import { PrismaService } from '../../prisma';
import { NotFoundException } from '@nestjs/common';
import { CreateSystemConfigColorDto, UpdateSystemConfigColorDto } from './dto/system-config-color.dto';

describe('SystemConfigColorsService', () => {
  let service: SystemConfigColorsService;
  let prismaService: PrismaService;

  const mockColor = {
    id: 1,
    name: 'Red',
    code: '#FF0000',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'test-user',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockPrismaService = {
    systemConfigColor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigColorsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SystemConfigColorsService>(SystemConfigColorsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new color', async () => {
      const createDto: CreateSystemConfigColorDto = {
        name: 'Red',
        code: '#FF0000',
      };

      mockPrismaService.systemConfigColor.create.mockResolvedValue(mockColor);

      const result = await service.create(createDto, 'test-user');
      expect(result).toEqual(mockColor);
      expect(mockPrismaService.systemConfigColor.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'test-user',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted colors by default', async () => {
      mockPrismaService.systemConfigColor.findMany.mockResolvedValue([mockColor]);

      const result = await service.findAll();
      expect(result).toEqual([mockColor]);
      expect(mockPrismaService.systemConfigColor.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { id: 'asc' },
      });
    });

    it('should include deleted colors when includeDeleted is true', async () => {
      mockPrismaService.systemConfigColor.findMany.mockResolvedValue([mockColor]);

      const result = await service.findAll(true);
      expect(result).toEqual([mockColor]);
      expect(mockPrismaService.systemConfigColor.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a color if found', async () => {
      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(mockColor);

      const result = await service.findOne(1);
      expect(result).toEqual(mockColor);
    });

    it('should throw NotFoundException if color not found', async () => {
      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a color', async () => {
      const updateDto: UpdateSystemConfigColorDto = {
        name: 'Dark Red',
      };

      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(mockColor);
      mockPrismaService.systemConfigColor.update.mockResolvedValue({
        ...mockColor,
        name: 'Dark Red',
      });

      const result = await service.update(1, updateDto, 'test-user');
      expect(result.name).toBe('Dark Red');
      expect(mockPrismaService.systemConfigColor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          updatedAt: expect.any(Date),
          updatedBy: 'test-user',
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a color', async () => {
      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(mockColor);
      mockPrismaService.systemConfigColor.update.mockResolvedValue({
        ...mockColor,
        isDeleted: true,
      });

      const result = await service.remove(1, 'test-user');
      expect(result.isDeleted).toBe(true);
      expect(mockPrismaService.systemConfigColor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
          deletedBy: 'test-user',
        },
      });
    });
  });

  describe('restore', () => {
    it('should restore a deleted color', async () => {
      const deletedColor = { ...mockColor, isDeleted: true };
      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(deletedColor);
      mockPrismaService.systemConfigColor.update.mockResolvedValue({
        ...deletedColor,
        isDeleted: false,
      });

      const result = await service.restore(1, 'test-user');
      expect(result.isDeleted).toBe(false);
      expect(mockPrismaService.systemConfigColor.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: expect.any(Date),
          updatedBy: 'test-user',
        },
      });
    });

    it('should throw NotFoundException if deleted color not found', async () => {
      mockPrismaService.systemConfigColor.findFirst.mockResolvedValue(null);

      await expect(service.restore(1, 'test-user')).rejects.toThrow(NotFoundException);
    });
  });

  describe('seed', () => {
    it('should seed default colors', async () => {
      mockPrismaService.systemConfigColor.upsert.mockResolvedValue(mockColor);

      await service.seed('test-user');
      expect(mockPrismaService.systemConfigColor.upsert).toHaveBeenCalledTimes(2);
    });
  });
});