import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Roles, User } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let redisService: RedisService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockRedisService = {
    setRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
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
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
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
      name: 'Test User',
      gender: false,
      dateOfBirth: '1990-01-01',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const userId = '123';
      const token = 'jwt-token';

      const newAccessToken = 'access-token';
      const newRefreshToken = 'refresh-token';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({
        id: userId,
        email: registerDto.email,
        role: Roles.CUSTOMER,
        password: hashedPassword,
      } as User);
      mockJwtService.signAsync.mockResolvedValueOnce(newAccessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(newRefreshToken);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        user: {
          id: userId,
          email: registerDto.email,
          role: Roles.CUSTOMER,
          password: hashedPassword,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      expect(redisService.setRefreshToken).toHaveBeenCalledWith(userId, newRefreshToken);
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
        user: {
          id: userId,
          email: loginDto.email,
          password: hashedPassword,
          role: Roles.CUSTOMER,
        },
        accessToken: token,
        refreshToken: undefined,
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

  describe('refreshTokens', () => {
    const refreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };
    const userId = '123';

    it('should refresh tokens successfully', async () => {
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';
      
      mockJwtService.verifyAsync.mockResolvedValueOnce({ userId });
      mockRedisService.getRefreshToken.mockResolvedValueOnce(refreshTokenDto.refreshToken);
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        role: Roles.CUSTOMER,
      });
      mockJwtService.signAsync.mockResolvedValueOnce(newAccessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(newRefreshToken);

      const result = await service.refreshTokens(refreshTokenDto, { id: userId } as User);

      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        role: Roles.CUSTOMER,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      expect(redisService.setRefreshToken).toHaveBeenCalledWith(userId, newRefreshToken);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValueOnce(new Error());

      await expect(service.refreshTokens(refreshTokenDto, { id: userId } as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValueOnce({ userId });
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.refreshTokens(refreshTokenDto, { id: userId } as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    const userId = '123';

    it('should logout successfully', async () => {
      mockRedisService.removeRefreshToken.mockResolvedValueOnce(undefined);

      const result = await service.logout(userId);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockRedisService.removeRefreshToken).toHaveBeenCalledWith(userId);
    });
  });
});
