import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Roles } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

  const mockUsersService = {
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
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      gender: false,
      dateOfBirth: '1990-01-01',
      role: Roles.CUSTOMER,
      createdBy: 'admin',
    };

    it('should create a user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      gender: true,
      updatedBy: 'admin',
    };

    it('should update a user', async () => {
      mockUsersService.update.mockResolvedValue({ ...mockUser, ...updateUserDto });
      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const deletedUser = { ...mockUser, isDeleted: true, deletedBy: 'admin' };
      mockUsersService.remove.mockResolvedValue(deletedUser);
      const result = await controller.remove('1', 'admin');
      expect(result).toEqual(deletedUser);
      expect(service.remove).toHaveBeenCalledWith('1', 'admin');
    });
  });
});