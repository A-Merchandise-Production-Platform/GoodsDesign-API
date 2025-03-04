import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Roles, User } from '@prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      gender: false,
      dateOfBirth: '1990-01-01',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const userId = '123';
      const token = 'jwt-token';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({
        id: userId,
        email: registerDto.email,
        role: Roles.CUSTOMER,
        password: hashedPassword,
      } as User);
      mockJwtService.signAsync.mockResolvedValueOnce(token);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        id: userId,
        email: registerDto.email,
        role: Roles.CUSTOMER,
        accessToken: token,
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
          role: Roles.CUSTOMER,
          isActive: true,
        },
      });
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '123' } as User);

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const userId = '123';
      const hashedPassword = 'hashedPassword';
      const token = 'jwt-token';

      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: userId,
        email: loginDto.email,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      } as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockJwtService.signAsync.mockResolvedValueOnce(token);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        id: userId,
        email: loginDto.email,
        role: Roles.CUSTOMER,
        accessToken: token,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: '123',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
