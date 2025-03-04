import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { Roles } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    gender: false,
    dateOfBirth: new Date('1990-01-01'),
    imageUrl: 'http://example.com/image.jpg',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'admin',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
    role: Roles.CUSTOMER,
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      gender: false,
      dateOfBirth: '1990-01-01',
      role: Roles.CUSTOMER,
      createdBy: 'admin',
    };

    it('should create a new user', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      gender: true,
      updatedBy: 'admin',
    };

    it('should update a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, ...updateUserDto });
      
      const result = await service.update('1', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.update('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, isDeleted: true });
      
      const result = await service.remove('1', 'admin');
      expect(result.isDeleted).toBeTruthy();
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('1', 'admin')).rejects.toThrow(NotFoundException);
    });
  });
});