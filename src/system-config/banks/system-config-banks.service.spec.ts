import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigBanksService } from './system-config-banks.service';
import { PrismaService } from '../prisma';
import { NotFoundException } from '@nestjs/common';
import { CreateSystemConfigBankDto, UpdateSystemConfigBankDto } from './dto/system-config-bank.dto';

describe('SystemConfigBanksService', () => {
  let service: SystemConfigBanksService;
  let prismaService: PrismaService;

  const mockBank = {
    id: 1,
    name: 'Test Bank',
    code: 'TST',
    bin: '123456',
    shortName: 'TestBank',
    logo: 'https://test.com/logo.png',
    transferSupported: true,
    lookupSupported: true,
    support: 1,
    isTransfer: true,
    swiftCode: 'TESTCODE',
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
    systemConfigBank: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigBanksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SystemConfigBanksService>(SystemConfigBanksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bank', async () => {
      const createDto: CreateSystemConfigBankDto = {
        name: 'Test Bank',
        code: 'TST',
        bin: '123456',
        shortName: 'TestBank',
        logo: 'https://test.com/logo.png',
        transferSupported: true,
        lookupSupported: true,
        support: 1,
        isTransfer: true,
        swiftCode: 'TESTCODE',
      };

      mockPrismaService.systemConfigBank.create.mockResolvedValue(mockBank);

      const result = await service.create(createDto, 'test-user');
      expect(result).toEqual(mockBank);
      expect(mockPrismaService.systemConfigBank.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          createdBy: 'test-user',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted banks by default', async () => {
      mockPrismaService.systemConfigBank.findMany.mockResolvedValue([mockBank]);

      const result = await service.findAll();
      expect(result).toEqual([mockBank]);
      expect(mockPrismaService.systemConfigBank.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { id: 'asc' },
      });
    });

    it('should include deleted banks when includeDeleted is true', async () => {
      mockPrismaService.systemConfigBank.findMany.mockResolvedValue([mockBank]);

      const result = await service.findAll(true);
      expect(result).toEqual([mockBank]);
      expect(mockPrismaService.systemConfigBank.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a bank if found', async () => {
      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(mockBank);

      const result = await service.findOne(1);
      expect(result).toEqual(mockBank);
    });

    it('should throw NotFoundException if bank not found', async () => {
      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a bank', async () => {
      const updateDto: UpdateSystemConfigBankDto = {
        name: 'Updated Bank',
      };

      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(mockBank);
      mockPrismaService.systemConfigBank.update.mockResolvedValue({
        ...mockBank,
        name: 'Updated Bank',
      });

      const result = await service.update(1, updateDto, 'test-user');
      expect(result.name).toBe('Updated Bank');
      expect(mockPrismaService.systemConfigBank.update).toHaveBeenCalledWith({
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
    it('should soft delete a bank', async () => {
      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(mockBank);
      mockPrismaService.systemConfigBank.update.mockResolvedValue({
        ...mockBank,
        isDeleted: true,
      });

      const result = await service.remove(1, 'test-user');
      expect(result.isDeleted).toBe(true);
      expect(mockPrismaService.systemConfigBank.update).toHaveBeenCalledWith({
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
    it('should restore a deleted bank', async () => {
      const deletedBank = { ...mockBank, isDeleted: true };
      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(deletedBank);
      mockPrismaService.systemConfigBank.update.mockResolvedValue({
        ...deletedBank,
        isDeleted: false,
      });

      const result = await service.restore(1, 'test-user');
      expect(result.isDeleted).toBe(false);
      expect(mockPrismaService.systemConfigBank.update).toHaveBeenCalledWith({
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

    it('should throw NotFoundException if deleted bank not found', async () => {
      mockPrismaService.systemConfigBank.findFirst.mockResolvedValue(null);

      await expect(service.restore(1, 'test-user')).rejects.toThrow(NotFoundException);
    });
  });
});