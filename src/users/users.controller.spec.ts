import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { Roles } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      gender: false,
      role: Roles.CUSTOMER,
    };

    const mockResponse: UserResponseDto = {
      id: '1',
      email: createUserDto.email,
      gender: createUserDto.gender,
      role: createUserDto.role,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
    };

    it('should create a user', async () => {
      mockUserService.create.mockResolvedValueOnce(mockResponse);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    const mockUsers: UserResponseDto[] = [
      {
        id: '1',
        email: 'test@example.com',
        gender: false,
        role: Roles.CUSTOMER,
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
      },
    ];

    it('should return an array of users', async () => {
      mockUserService.findAll.mockResolvedValueOnce(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const mockUser: UserResponseDto = {
      id: '1',
      email: 'test@example.com',
      gender: false,
      role: Roles.CUSTOMER,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
    };

    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValueOnce(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      gender: true,
    };

    const mockUser: UserResponseDto = {
      id: '1',
      email: 'test@example.com',
      gender: true,
      role: Roles.CUSTOMER,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
    };

    it('should update a user', async () => {
      mockUserService.update.mockResolvedValueOnce(mockUser);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    const mockUser: UserResponseDto = {
      id: '1',
      email: 'test@example.com',
      gender: false,
      role: Roles.CUSTOMER,
      isActive: false,
      isDeleted: true,
      createdAt: new Date(),
    };

    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValueOnce(mockUser);

      const result = await controller.remove('1', 'admin');
      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith('1', 'admin');
    });
  });
});