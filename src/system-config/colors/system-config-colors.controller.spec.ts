import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigColorsController } from './system-config-colors.controller';
import { SystemConfigColorsService } from './system-config-colors.service';
import { CreateSystemConfigColorDto, UpdateSystemConfigColorDto } from './dto/system-config-color.dto';

describe('SystemConfigColorsController', () => {
  let controller: SystemConfigColorsController;
  let service: SystemConfigColorsService;

  const mockColor = {
    id: 1,
    name: 'Red',
    code: '#FF0000',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'test-user',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockSystemConfigColorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemConfigColorsController],
      providers: [
        {
          provide: SystemConfigColorsService,
          useValue: mockSystemConfigColorsService,
        },
      ],
    }).compile();

    controller = module.get<SystemConfigColorsController>(SystemConfigColorsController);
    service = module.get<SystemConfigColorsService>(SystemConfigColorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new color', async () => {
      const createDto: CreateSystemConfigColorDto = {
        name: 'Red',
        code: '#FF0000',
      };

      mockSystemConfigColorsService.create.mockResolvedValue(mockColor);

      const result = await controller.create(createDto, 'test-user');
      expect(result).toEqual(mockColor);
      expect(mockSystemConfigColorsService.create).toHaveBeenCalledWith(createDto, 'test-user');
    });
  });

  describe('findAll', () => {
    it('should return all colors', async () => {
      mockSystemConfigColorsService.findAll.mockResolvedValue([mockColor]);

      const result = await controller.findAll(false);
      expect(result).toEqual([mockColor]);
      expect(mockSystemConfigColorsService.findAll).toHaveBeenCalledWith(false);
    });
  });

  describe('findOne', () => {
    it('should return a color by id', async () => {
      mockSystemConfigColorsService.findOne.mockResolvedValue(mockColor);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockColor);
      expect(mockSystemConfigColorsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a color', async () => {
      const updateDto: UpdateSystemConfigColorDto = {
        name: 'Dark Red',
      };

      const updatedColor = { ...mockColor, name: 'Dark Red' };
      mockSystemConfigColorsService.update.mockResolvedValue(updatedColor);

      const result = await controller.update(1, updateDto, 'test-user');
      expect(result).toEqual(updatedColor);
      expect(mockSystemConfigColorsService.update).toHaveBeenCalledWith(1, updateDto, 'test-user');
    });
  });

  describe('remove', () => {
    it('should remove a color', async () => {
      const deletedColor = { ...mockColor, isDeleted: true };
      mockSystemConfigColorsService.remove.mockResolvedValue(deletedColor);

      const result = await controller.remove(1, 'test-user');
      expect(result).toEqual(deletedColor);
      expect(mockSystemConfigColorsService.remove).toHaveBeenCalledWith(1, 'test-user');
    });
  });

  describe('restore', () => {
    it('should restore a color', async () => {
      mockSystemConfigColorsService.restore.mockResolvedValue(mockColor);

      const result = await controller.restore(1, 'test-user');
      expect(result).toEqual(mockColor);
      expect(mockSystemConfigColorsService.restore).toHaveBeenCalledWith(1, 'test-user');
    });
  });
});