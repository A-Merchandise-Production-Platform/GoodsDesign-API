import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigSizesController } from './system-config-sizes.controller';
import { SystemConfigSizesService } from './system-config-sizes.service';
import { CreateSystemConfigSizeDto, UpdateSystemConfigSizeDto } from './dto/system-config-size.dto';

describe('SystemConfigSizesController', () => {
  let controller: SystemConfigSizesController;
  let service: SystemConfigSizesService;

  const mockSize = {
    id: 1,
    code: 'M',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'test-user',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockSystemConfigSizesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemConfigSizesController],
      providers: [
        {
          provide: SystemConfigSizesService,
          useValue: mockSystemConfigSizesService,
        },
      ],
    }).compile();

    controller = module.get<SystemConfigSizesController>(SystemConfigSizesController);
    service = module.get<SystemConfigSizesService>(SystemConfigSizesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new size', async () => {
      const createDto: CreateSystemConfigSizeDto = {
        code: 'M',
      };

      mockSystemConfigSizesService.create.mockResolvedValue(mockSize);

      const result = await controller.create(createDto, 'test-user');
      expect(result).toEqual(mockSize);
      expect(mockSystemConfigSizesService.create).toHaveBeenCalledWith(createDto, 'test-user');
    });
  });

  describe('findAll', () => {
    it('should return all sizes', async () => {
      mockSystemConfigSizesService.findAll.mockResolvedValue([mockSize]);

      const result = await controller.findAll(false);
      expect(result).toEqual([mockSize]);
      expect(mockSystemConfigSizesService.findAll).toHaveBeenCalledWith(false);
    });
  });

  describe('findOne', () => {
    it('should return a size by id', async () => {
      mockSystemConfigSizesService.findOne.mockResolvedValue(mockSize);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockSize);
      expect(mockSystemConfigSizesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a size', async () => {
      const updateDto: UpdateSystemConfigSizeDto = {
        code: 'L',
      };

      const updatedSize = { ...mockSize, code: 'L' };
      mockSystemConfigSizesService.update.mockResolvedValue(updatedSize);

      const result = await controller.update('1', updateDto, 'test-user');
      expect(result).toEqual(updatedSize);
      expect(mockSystemConfigSizesService.update).toHaveBeenCalledWith(1, updateDto, 'test-user');
    });
  });

  describe('remove', () => {
    it('should remove a size', async () => {
      const deletedSize = { ...mockSize, isDeleted: true };
      mockSystemConfigSizesService.remove.mockResolvedValue(deletedSize);

      const result = await controller.remove('1', 'test-user');
      expect(result).toEqual(deletedSize);
      expect(mockSystemConfigSizesService.remove).toHaveBeenCalledWith(1, 'test-user');
    });
  });

  describe('restore', () => {
    it('should restore a size', async () => {
      mockSystemConfigSizesService.restore.mockResolvedValue(mockSize);

      const result = await controller.restore('1', 'test-user');
      expect(result).toEqual(mockSize);
      expect(mockSystemConfigSizesService.restore).toHaveBeenCalledWith(1, 'test-user');
    });
  });
});