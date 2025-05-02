import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../users/entities/users.entity';
import { FactoryEntity } from '../factory/entities/factory.entity';
import { Roles, FactoryStatus } from '@prisma/client';
import { AuthResponseDto } from './dto';
import { TokenType } from '../dynamic-modules';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let notificationsService: NotificationsService;
  let mailService: MailService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    factory: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockRedisService = {
    setRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockMailService = {
    sendSingleEmail: jest.fn(),
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
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await require('bcrypt').hash(password, 10);

      const mockUser = {
        id: '1',
        email,
        password: hashedPassword,
        isDeleted: false,
        isActive: true,
        ownedFactory: null,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException for non-existent email', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: '1',
        email,
        password: await require('bcrypt').hash('wrongpassword', 10),
        isDeleted: false,
        isActive: true,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.validateUser(email, 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: loginDto.email,
        password: await require('bcrypt').hash(loginDto.password, 10),
        isDeleted: false,
        isActive: true,
        ownedFactory: null,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('mockToken');
      mockRedisService.setRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(loginDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.accessToken).toBe('mockToken');
      expect(result.refreshToken).toBe('mockToken');
    });
  });

  describe('register', () => {
    it('should register a new customer', async () => {
      const registerDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
        isFactoryOwner: false,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        ...registerDto,
        role: Roles.CUSTOMER,
        isActive: true,
      });
      mockJwtService.signAsync.mockResolvedValue('mockToken');
      mockRedisService.setRefreshToken.mockResolvedValue(undefined);
      mockNotificationsService.create.mockResolvedValue(undefined);

      const result = await service.register(registerDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.user.role).toBe(Roles.CUSTOMER);
    });

    it('should register a new factory owner', async () => {
      const registerDto = {
        email: 'factory@example.com',
        name: 'Factory Owner',
        password: 'password123',
        isFactoryOwner: true,
      };

      const mockUser = {
        id: '1',
        ...registerDto,
        role: Roles.FACTORYOWNER,
        isActive: true,
      };

      const mockFactory = {
        id: '1',
        factoryOwnerId: '1',
        name: "Factory Owner's Factory",
        factoryStatus: FactoryStatus.PENDING_APPROVAL,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.factory.create.mockResolvedValue(mockFactory);
      mockJwtService.signAsync.mockResolvedValue('mockToken');
      mockRedisService.setRefreshToken.mockResolvedValue(undefined);
      mockNotificationsService.create.mockResolvedValue(undefined);
      mockMailService.sendSingleEmail.mockResolvedValue(undefined);

      const result = await service.register(registerDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.user.role).toBe(Roles.FACTORYOWNER);
      expect(result.user.ownedFactory).toBeInstanceOf(FactoryEntity);
    });

    it('should throw BadRequestException for existing email', async () => {
      const registerDto = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
        isFactoryOwner: false,
      };

      mockPrismaService.user.findFirst.mockResolvedValue({
        id: '1',
        email: registerDto.email,
      });

      await expect(service.register(registerDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshTokenDto = {
        refreshToken: 'validRefreshToken',
      };

      const currentUser = new UserEntity({
        id: '1',
        email: 'test@example.com',
        role: Roles.CUSTOMER,
      });

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        isDeleted: false,
        ownedFactory: null,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockRedisService.getRefreshToken.mockResolvedValue('validRefreshToken');
      mockJwtService.signAsync.mockResolvedValue('newToken');
      mockRedisService.setRefreshToken.mockResolvedValue(undefined);

      const result = await service.refreshToken(refreshTokenDto, currentUser);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.accessToken).toBe('newToken');
      expect(result.refreshToken).toBe('newToken');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshTokenDto = {
        refreshToken: 'invalidRefreshToken',
      };

      const currentUser = new UserEntity({
        id: '1',
        email: 'test@example.com',
        role: Roles.CUSTOMER,
      });

      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.refreshToken(refreshTokenDto, currentUser))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = '1';
      mockRedisService.removeRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout(userId);
      expect(result).toBe('Logged out successfully');
      expect(mockRedisService.removeRefreshToken).toHaveBeenCalledWith(userId);
    });
  });
}); 