import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    toggleActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  const mockCategory = {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices',
    imageUrl: 'https://example.com/image.jpg',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'user1',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  describe('create', () => {
    it('should create a category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Electronics',
        description: 'Electronic devices',
        imageUrl: 'https://example.com/image.jpg',
      };
      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createDto, 'user1');

      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(createDto, 'user1');
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll(false);

      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalledWith(false);
    });

    it('should return all categories including deleted ones', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll(true);

      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne('1', false);

      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith('1', false);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateDto: UpdateCategoryDto = { name: 'Updated Electronics' };
      const updatedCategory = { ...mockCategory, ...updateDto };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update('1', updateDto, 'user1');

      expect(result).toEqual(updatedCategory);
      expect(service.update).toHaveBeenCalledWith('1', updateDto, 'user1');
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const deletedCategory = { ...mockCategory, isDeleted: true };
      mockCategoriesService.remove.mockResolvedValue(deletedCategory);

      const result = await controller.remove('1', 'user1');

      expect(result).toEqual(deletedCategory);
      expect(service.remove).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('restore', () => {
    it('should restore a category', async () => {
      mockCategoriesService.restore.mockResolvedValue(mockCategory);

      const result = await controller.restore('1', 'user1');

      expect(result).toEqual(mockCategory);
      expect(service.restore).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('toggleActive', () => {
    it('should toggle category active status', async () => {
      const toggledCategory = { ...mockCategory, isActive: false };
      mockCategoriesService.toggleActive.mockResolvedValue(toggledCategory);

      const result = await controller.toggleActive('1', 'user1');

      expect(result).toEqual(toggledCategory);
      expect(service.toggleActive).toHaveBeenCalledWith('1', 'user1');
    });
  });
});