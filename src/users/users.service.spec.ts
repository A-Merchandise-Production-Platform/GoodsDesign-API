import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { Roles } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockDate = new Date();
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    gender: false,
    dateOfBirth: new Date('1990-01-01'),
    imageUrl: 'http://example.com/image.jpg',
    isActive: true,
    isDeleted: false,
    createdAt: mockDate,
    createdBy: 'admin',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
    role: Roles.CUSTOMER,
  };

  const mockUserResponse = new UserResponseDto(mockUser);

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
      email: 'test@example.com',
      password: 'password123',
      gender: false,
      dateOfBirth: '1990-01-01',
      role: Roles.CUSTOMER,
      createdBy: 'admin',
    };

    it('should create a new user', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUserResponse);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          dateOfBirth: new Date(createUserDto.dateOfBirth),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of active users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUserResponse]);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false }
      });
    });
  });

  describe('findOne', () => {
    it('should return an active user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUserResponse);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });

    it('should throw NotFoundException when user is deleted', async () => {
      const deletedUser = { ...mockUser, isDeleted: true };
      mockPrismaService.user.findFirst.mockResolvedValue(deletedUser);
      await expect(service.findOne('1')).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      gender: true,
      updatedBy: 'admin',
    };

    it('should update an active user', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const updatedUser = {
        ...mockUser,
        gender: updateUserDto.gender,
        updatedBy: updateUserDto.updatedBy,
        updatedAt: now
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      
      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(new UserResponseDto(updatedUser));
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateUserDto,
          updatedAt: now
        }
      });

      jest.useRealTimers();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });

    it('should throw NotFoundException when user is deleted', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ ...mockUser, isDeleted: true });
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const deletedUser = {
        ...mockUser,
        isDeleted: true,
        deletedAt: now,
        deletedBy: 'admin'
      };
      mockPrismaService.user.update.mockResolvedValue(deletedUser);
      
      const result = await service.remove('1', 'admin');
      expect(result).toEqual(new UserResponseDto(deletedUser));
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: now,
          deletedBy: 'admin'
        }
      });

      jest.useRealTimers();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('1', 'admin')).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });

    it('should throw NotFoundException when user is already deleted', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ ...mockUser, isDeleted: true });
      await expect(service.remove('1', 'admin')).rejects.toThrow(
        new NotFoundException('User with ID 1 not found')
      );
    });
  });
});