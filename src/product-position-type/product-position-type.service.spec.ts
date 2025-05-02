import { Test, TestingModule } from '@nestjs/testing';
import { ProductPositionTypeService } from './product-position-type.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductPositionTypeEntity } from './entities/product-position-type.entity';
import { CreateProductPositionTypeDto } from './dto/create-product-position-type.dto';
import { UpdateProductPositionTypeDto } from './dto/update-product-position-type.dto';

describe('ProductPositionTypeService', () => {
  let service: ProductPositionTypeService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    productPositionType: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPositionTypeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductPositionTypeService>(ProductPositionTypeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product position type', async () => {
      const createDto: CreateProductPositionTypeDto = {
        productId: '1',
        positionName: 'Front',
        basePrice: 100,
      };

      const mockProductPositionType = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: '1',
          name: 'Test Product',
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          categoryId: '1'
        },
        designPositions: [],
      };

      mockPrismaService.productPositionType.create.mockResolvedValue(mockProductPositionType);

      const result = await service.create(createDto);
      expect(result).toBeInstanceOf(ProductPositionTypeEntity);
      expect(mockPrismaService.productPositionType.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all product position types for a product', async () => {
      const productId = '1';
      const mockProductPositionTypes = [
        {
          id: '1',
          productId,
          positionName: 'Front',
          basePrice: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            id: productId,
            name: 'Test Product',
            isActive: true,
            isDeleted: false,
            createdAt: new Date(),
            categoryId: '1'
          },
          designPositions: [],
        },
      ];

      mockPrismaService.productPositionType.findMany.mockResolvedValue(mockProductPositionTypes);

      const result = await service.findAll(productId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ProductPositionTypeEntity);
      expect(mockPrismaService.productPositionType.findMany).toHaveBeenCalledWith({
        where: { productId },
        include: {
          product: true,
          designPositions: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific product position type', async () => {
      const id = '1';
      const mockProductPositionType = {
        id,
        productId: '1',
        positionName: 'Front',
        basePrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: '1',
          name: 'Test Product',
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          categoryId: '1'
        },
        designPositions: [],
      };

      mockPrismaService.productPositionType.findUnique.mockResolvedValue(mockProductPositionType);

      const result = await service.findOne(id);
      expect(result).toBeInstanceOf(ProductPositionTypeEntity);
    });
  });

  describe('update', () => {
    it('should update a product position type', async () => {
      const id = '1';
      const updateDto: UpdateProductPositionTypeDto = {
        id,
        positionName: 'Back',
        basePrice: 150,
      };

      const mockUpdatedPositionType = {
        id,
        productId: '1',
        ...updateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: '1',
          name: 'Test Product',
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          categoryId: '1'
        },
        designPositions: [],
      };

      mockPrismaService.productPositionType.update.mockResolvedValue(mockUpdatedPositionType);

      const result = await service.update(id, updateDto);
      expect(result).toBeInstanceOf(ProductPositionTypeEntity);
    });
  });

  describe('remove', () => {
    it('should remove a product position type', async () => {
      const id = '1';
      const mockDeletedPositionType = {
        id,
        productId: '1',
        positionName: 'Front',
        basePrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: '1',
          name: 'Test Product',
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          categoryId: '1'
        },
        designPositions: [],
      };

      mockPrismaService.productPositionType.delete.mockResolvedValue(mockDeletedPositionType);

      const result = await service.remove(id);
      expect(result).toBeInstanceOf(ProductPositionTypeEntity);
      expect(mockPrismaService.productPositionType.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
}); 