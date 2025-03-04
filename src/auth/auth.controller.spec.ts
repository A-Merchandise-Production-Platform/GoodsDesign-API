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
});
