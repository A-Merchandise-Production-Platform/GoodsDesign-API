import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { Roles } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      gender: false,
      dateOfBirth: '1990-01-01',
    };

    const mockResponse = {
      id: '123',
      email: registerDto.email,
      role: Roles.CUSTOMER,
      accessToken: 'jwt-token',
    };

    it('should register a new user', async () => {
      mockAuthService.register.mockResolvedValueOnce(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto: AuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      id: '123',
      email: loginDto.email,
      role: Roles.CUSTOMER,
      accessToken: 'jwt-token',
    };

    it('should login user', async () => {
      mockAuthService.login.mockResolvedValueOnce(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    const mockResponse = {
      id: '123',
      email: 'test@example.com',
      role: Roles.CUSTOMER,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    it('should refresh tokens', async () => {
      mockAuthService.refreshTokens.mockResolvedValueOnce(mockResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockResponse);
      expect(authService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe('logout', () => {
    const userId = '123';
    const mockResponse = { message: 'Logged out successfully' };

    it('should logout user', async () => {
      mockAuthService.logout.mockResolvedValueOnce(mockResponse);

      const result = await controller.logout(userId);

      expect(result).toEqual(mockResponse);
      expect(authService.logout).toHaveBeenCalledWith(userId);
    });
  });
});
