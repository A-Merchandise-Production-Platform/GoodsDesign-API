import { Test, TestingModule } from '@nestjs/testing';
import { DesignPositionService } from './design-position.service';
import { PrismaService } from '../prisma/prisma.service';
import { DesignPositionEntity } from './entities/design-position.entity';
import { UpdateDesignPositionDto } from './dto/update-design-position.dto';

describe('DesignPositionService', () => {
  let service: DesignPositionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    designPosition: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignPositionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DesignPositionService>(DesignPositionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all design positions when no designId is provided', async () => {
      const mockDesignPositions = [
        {
          designId: '1',
          productPositionTypeId: '1',
          design: { systemConfigVariant: {} },
          positionType: {},
        },
      ];
      mockPrismaService.designPosition.findMany.mockResolvedValue(mockDesignPositions);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(DesignPositionEntity);
      expect(mockPrismaService.designPosition.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          design: {
            include: {
              systemConfigVariant: true,
            },
          },
          positionType: true,
        },
      });
    });

    it('should return design positions for a specific design', async () => {
      const designId = '1';
      const mockDesignPositions = [
        {
          designId,
          productPositionTypeId: '1',
          design: { systemConfigVariant: {} },
          positionType: {},
        },
      ];
      mockPrismaService.designPosition.findMany.mockResolvedValue(mockDesignPositions);

      const result = await service.findAll(designId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(DesignPositionEntity);
      expect(mockPrismaService.designPosition.findMany).toHaveBeenCalledWith({
        where: { designId },
        include: {
          design: {
            include: {
              systemConfigVariant: true,
            },
          },
          positionType: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a design position by designId and productPositionTypeId', async () => {
      const designId = '1';
      const productPositionTypeId = '1';
      const mockDesignPosition = {
        designId,
        productPositionTypeId,
        design: { systemConfigVariant: {} },
        positionType: {},
      };
      mockPrismaService.designPosition.findUnique.mockResolvedValue(mockDesignPosition);

      const result = await service.findOne(designId, productPositionTypeId);
      expect(result).toBeInstanceOf(DesignPositionEntity);
      expect(mockPrismaService.designPosition.findUnique).toHaveBeenCalledWith({
        where: {
          designPositionId: {
            designId,
            productPositionTypeId,
          },
        },
        include: {
          design: {
            include: {
              systemConfigVariant: true,
            },
          },
          positionType: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a design position', async () => {
      const designId = '1';
      const productPositionTypeId = '1';
      const updateDto: UpdateDesignPositionDto = {
        designId,
        productPositionTypeId,
        designJSON: { key: 'value' },
      };

      const mockUpdatedDesignPosition = {
        id: '1',
        ...updateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        design: {
          id: designId,
          userId: '1',
          systemConfigVariantId: '1',
          thumbnailUrl: 'test.jpg',
          isFinalized: true,
          isPublic: false,
          isTemplate: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        productPositionType: {
          id: productPositionTypeId,
          productId: '1',
          positionName: 'Front',
          basePrice: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrismaService.designPosition.update.mockResolvedValue(mockUpdatedDesignPosition);

      const result = await service.update(designId, productPositionTypeId, updateDto);
      expect(result).toBeInstanceOf(DesignPositionEntity);
      expect(mockPrismaService.designPosition.update).toHaveBeenCalledWith({
        where: {
          designId_productPositionTypeId: {
            designId,
            productPositionTypeId,
          },
        },
        data: updateDto,
        include: {
          design: true,
          productPositionType: true,
        },
      });
    });
  });
}); 