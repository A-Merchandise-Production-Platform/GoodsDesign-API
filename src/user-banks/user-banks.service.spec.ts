import { Test, TestingModule } from '@nestjs/testing';
import { UserBanksService } from './user-banks.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserBankEntity } from './entities/user-bank.entity';
import { CreateUserBankInput } from './dto/create-user-bank.input';
import { UpdateUserBankInput } from './dto/update-user-bank.input';
import { Roles } from '@prisma/client';
import { UserEntity } from '../users/entities/users.entity';
import { SystemConfigBankEntity } from '../system-config-bank/entities/system-config-bank.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserBanksService', () => {
  let service: UserBanksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    userBank: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser: UserEntity = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '',
    imageUrl: '',
    dateOfBirth: null,
    gender: true,
    role: Roles.CUSTOMER,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockBank: SystemConfigBankEntity = {
    id: '1',
    name: 'Test Bank',
    code: 'TEST',
    bin: '123456',
    shortName: 'TB',
    logo: 'test-logo.png',
    isActive: true,
    isDeleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBanksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserBanksService>(UserBanksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserBank', () => {
    it('should create a new user bank', async () => {
      const createInput: CreateUserBankInput = {
        bankId: mockBank.id,
        accountNumber: '1234567890',
        accountName: 'Test Account',
        isDefault: false,
      };

      const mockUserBank = new UserBankEntity({
        id: '1',
        userId: mockUser.id,
        ...createInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
        bank: mockBank,
      });

      mockPrismaService.userBank.findMany.mockResolvedValue([]);
      mockPrismaService.userBank.create.mockResolvedValue(mockUserBank);

      const result = await service.createUserBank(createInput, mockUser);
      expect(result).toBeInstanceOf(UserBankEntity);
      expect(mockPrismaService.userBank.create).toHaveBeenCalledWith({
        data: {
          ...createInput,
          userId: mockUser.id,
          isDefault: true,
        },
        include: {
          user: true,
          bank: true,
        },
      });
    });

    it('should throw error if bank does not exist', async () => {
      const createInput: CreateUserBankInput = {
        bankId: 'non-existent-bank',
        accountNumber: '1234567890',
        accountName: 'Test Account',
        isDefault: false,
      };

      mockPrismaService.userBank.findMany.mockResolvedValue([]);
      mockPrismaService.userBank.create.mockRejectedValue(new Error('Bank not found'));

      await expect(service.createUserBank(createInput, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserBanks', () => {
    it('should return all user banks for a user', async () => {
      const mockUserBanks = [
        new UserBankEntity({
          id: '1',
          userId: mockUser.id,
          bankId: mockBank.id,
          accountNumber: '1234567890',
          accountName: 'Test Account',
          isDefault: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: mockUser,
          bank: mockBank,
        }),
      ];

      mockPrismaService.userBank.findMany.mockResolvedValue(mockUserBanks);

      const result = await service.getUserBanks(mockUser);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(UserBankEntity);
      expect(mockPrismaService.userBank.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: {
          user: true,
          bank: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return empty array if no banks found', async () => {
      mockPrismaService.userBank.findMany.mockResolvedValue([]);

      const result = await service.getUserBanks(mockUser);
      expect(result).toHaveLength(0);
    });
  });

  describe('getUserBank', () => {
    it('should return a specific user bank', async () => {
      const id = '1';
      const mockUserBank = new UserBankEntity({
        id,
        userId: mockUser.id,
        bankId: mockBank.id,
        accountNumber: '1234567890',
        accountName: 'Test Account',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
        bank: mockBank,
      });

      mockPrismaService.userBank.findFirst.mockResolvedValue(mockUserBank);

      const result = await service.getUserBank(id, mockUser);
      expect(result).toBeInstanceOf(UserBankEntity);
      expect(mockPrismaService.userBank.findFirst).toHaveBeenCalledWith({
        where: { id, userId: mockUser.id },
        include: {
          user: true,
          bank: true,
        },
      });
    });

    it('should throw NotFoundException if bank not found', async () => {
      const id = 'non-existent-id';
      mockPrismaService.userBank.findFirst.mockResolvedValue(null);

      await expect(service.getUserBank(id, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if bank belongs to different user', async () => {
      const id = '1';
      const differentUser = { ...mockUser, id: '2' };
      const mockUserBank = new UserBankEntity({
        id,
        userId: mockUser.id,
        bankId: mockBank.id,
        accountNumber: '1234567890',
        accountName: 'Test Account',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
        bank: mockBank,
      });

      mockPrismaService.userBank.findFirst.mockResolvedValue(mockUserBank);

      await expect(service.getUserBank(id, differentUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUserBank', () => {
    it('should update a user bank', async () => {
      const id = '1';
      const updateInput: UpdateUserBankInput = {
        accountName: 'Updated Account',
        isDefault: true,
      };

      const mockUpdatedUserBank = new UserBankEntity({
        id,
        userId: mockUser.id,
        bankId: mockBank.id,
        accountNumber: '1234567890',
        ...updateInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
        bank: mockBank,
      });

      mockPrismaService.userBank.findFirst.mockResolvedValue(mockUpdatedUserBank);
      mockPrismaService.userBank.update.mockResolvedValue(mockUpdatedUserBank);

      const result = await service.updateUserBank(id, updateInput, mockUser);
      expect(result).toBeInstanceOf(UserBankEntity);
      expect(mockPrismaService.userBank.update).toHaveBeenCalledWith({
        where: { id },
        data: updateInput,
        include: {
          user: true,
          bank: true,
        },
      });
    });

    it('should throw NotFoundException if bank not found', async () => {
      const id = 'non-existent-id';
      const updateInput: UpdateUserBankInput = {
        accountName: 'Updated Account',
      };

      mockPrismaService.userBank.findFirst.mockResolvedValue(null);

      await expect(service.updateUserBank(id, updateInput, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUserBank', () => {
    it('should delete a user bank', async () => {
      const id = '1';
      const mockDeletedUserBank = new UserBankEntity({
        id,
        userId: mockUser.id,
        bankId: mockBank.id,
        accountNumber: '1234567890',
        accountName: 'Test Account',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
        bank: mockBank,
      });

      mockPrismaService.userBank.findFirst.mockResolvedValue(mockDeletedUserBank);
      mockPrismaService.userBank.delete.mockResolvedValue(mockDeletedUserBank);

      const result = await service.deleteUserBank(id, mockUser);
      expect(result).toBeInstanceOf(UserBankEntity);
      expect(mockPrismaService.userBank.delete).toHaveBeenCalledWith({
        where: { id },
        include: {
          user: true,
          bank: true,
        },
      });
    });

    it('should throw NotFoundException if bank not found', async () => {
      const id = 'non-existent-id';
      mockPrismaService.userBank.findFirst.mockResolvedValue(null);

      await expect(service.deleteUserBank(id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
}); 