import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigSizesService } from './system-config-sizes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSystemConfigSizeDto, UpdateSystemConfigSizeDto } from './dto/system-config-size.dto';

describe('SystemConfigSizesService', () => {
  let service: SystemConfigSizesService;
  let prismaService: PrismaService;

  const mockSize = {
    id: '1',
    name: 'Test Size',
    code: 'TST',
    createdAt: new Date(),
    createdBy: 'test-user',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockPrismaService = {
    systemConfigSize: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigSizesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SystemConfigSizesService>(SystemConfigSizesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new size', async () => {
      const createDto: CreateSystemConfigSizeDto = {
        code: 'TST',
      };

      mockPrismaService.systemConfigSize.create.mockResolvedValue(mockSize);

      const result = await service.create(createDto, 'test-user');
      expect(result).toEqual(mockSize);
      expect(mockPrismaService.systemConfigSize.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'test-user',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted sizes by default', async () => {
      mockPrismaService.systemConfigSize.findMany.mockResolvedValue([mockSize]);

      const result = await service.findAll();
      expect(result).toEqual([mockSize]);
      expect(mockPrismaService.systemConfigSize.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { id: 'asc' },
      });
    });

    it('should include deleted sizes when includeDeleted is true', async () => {
      mockPrismaService.systemConfigSize.findMany.mockResolvedValue([mockSize]);

      const result = await service.findAll(true);
      expect(result).toEqual([mockSize]);
      expect(mockPrismaService.systemConfigSize.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a size if found', async () => {
      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(mockSize);

      const result = await service.findOne('1');
      expect(result).toEqual(mockSize);
    });

    it('should throw NotFoundException if size not found', async () => {
      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a size', async () => {
      const updateDto: UpdateSystemConfigSizeDto = {
      };

      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(mockSize);
      mockPrismaService.systemConfigSize.update.mockResolvedValue({
        ...mockSize,
        name: 'Updated Size',
      });

      const result = await service.update('1', updateDto, 'test-user');
      expect(mockPrismaService.systemConfigSize.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateDto,
          updatedAt: expect.any(Date),
          updatedBy: 'test-user',
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a size', async () => {
      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(mockSize);
      mockPrismaService.systemConfigSize.update.mockResolvedValue({
        ...mockSize,
        isDeleted: true,
      });

      const result = await service.remove('1', 'test-user');
      expect(result.isDeleted).toBe(true);
      expect(mockPrismaService.systemConfigSize.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
          deletedBy: 'test-user',
        },
      });
    });
  });

  describe('restore', () => {
    it('should restore a deleted size', async () => {
      const deletedSize = { ...mockSize, isDeleted: true };
      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(deletedSize);
      mockPrismaService.systemConfigSize.update.mockResolvedValue({
        ...deletedSize,
        isDeleted: false,
      });

      const result = await service.restore('1', 'test-user');
      expect(result.isDeleted).toBe(false);
      expect(mockPrismaService.systemConfigSize.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: expect.any(Date),
          updatedBy: 'test-user',
        },
      });
    });

    it('should throw NotFoundException if deleted size not found', async () => {
      mockPrismaService.systemConfigSize.findFirst.mockResolvedValue(null);

      await expect(service.restore('1', 'test-user')).rejects.toThrow(NotFoundException);
    });
  });
});