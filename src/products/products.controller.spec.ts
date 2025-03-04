import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCategory: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    toggleActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  const mockCategory = {
    id: 'category1',
    name: 'Electronics',
    description: 'Electronic devices',
    imageUrl: 'https://example.com/category.jpg',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'user1',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockProduct = {
    id: '1',
    name: 'Modern Chair',
    description: 'A comfortable modern chair',
    imageUrl: 'https://example.com/chair.jpg',
    model3DUrl: 'https://example.com/chair.glb',
    categoryId: 'category1',
    category: mockCategory,
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
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'Modern Chair',
        description: 'A comfortable modern chair',
        imageUrl: 'https://example.com/chair.jpg',
        model3DUrl: 'https://example.com/chair.glb',
        categoryId: 'category1',
      };
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto, 'user1');

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createDto, 'user1');
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockProductsService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll(false);

      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalledWith(false);
    });

    it('should return all products including deleted ones', async () => {
      mockProductsService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll(true);

      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findByCategory', () => {
    it('should return all products for a specific category', async () => {
      mockProductsService.findByCategory.mockResolvedValue([mockProduct]);

      const result = await controller.findByCategory('category1', false);

      expect(result).toEqual([mockProduct]);
      expect(service.findByCategory).toHaveBeenCalledWith('category1', false);
    });

    it('should return all products including deleted ones for a specific category', async () => {
      mockProductsService.findByCategory.mockResolvedValue([mockProduct]);

      const result = await controller.findByCategory('category1', true);

      expect(result).toEqual([mockProduct]);
      expect(service.findByCategory).toHaveBeenCalledWith('category1', true);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1', false);

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('1', false);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Chair' };
      const updatedProduct = { ...mockProduct, ...updateDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateDto, 'user1');

      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateDto, 'user1');
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const deletedProduct = { ...mockProduct, isDeleted: true };
      mockProductsService.remove.mockResolvedValue(deletedProduct);

      const result = await controller.remove('1', 'user1');

      expect(result).toEqual(deletedProduct);
      expect(service.remove).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('restore', () => {
    it('should restore a product', async () => {
      mockProductsService.restore.mockResolvedValue(mockProduct);

      const result = await controller.restore('1', 'user1');

      expect(result).toEqual(mockProduct);
      expect(service.restore).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('toggleActive', () => {
    it('should toggle product active status', async () => {
      const toggledProduct = { ...mockProduct, isActive: false };
      mockProductsService.toggleActive.mockResolvedValue(toggledProduct);

      const result = await controller.toggleActive('1', 'user1');

      expect(result).toEqual(toggledProduct);
      expect(service.toggleActive).toHaveBeenCalledWith('1', 'user1');
    });
  });
});