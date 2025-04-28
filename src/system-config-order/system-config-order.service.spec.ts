import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigOrderService } from './system-config-order.service';
import { PrismaService } from '../prisma/prisma.service';
import { SystemConfigOrderEntity } from './entities/system-config-order.entity';
import { UpdateSystemConfigOrderDto } from './dto/update-system-config-order.dto';

describe('SystemConfigOrderService', () => {
  let service: SystemConfigOrderService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    systemConfigOrder: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemConfigOrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SystemConfigOrderService>(SystemConfigOrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return the system configuration', async () => {
      const mockConfig = {
        id: '1',
        type: 'SYSTEM_CONFIG_ORDER',
        checkQualityTimesDays: 1,
        shippingDays: 2,
        reduceLegitPointIfReject: 10,
        limitReworkTimes: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.systemConfigOrder.findFirst.mockResolvedValue(mockConfig);

      const result = await service.findOne();
      expect(result).toBeInstanceOf(SystemConfigOrderEntity);
      expect(result.id).toBe(mockConfig.id);
      expect(result.type).toBe(mockConfig.type);
      expect(mockPrismaService.systemConfigOrder.findFirst).toHaveBeenCalled();
    });

    it('should throw an error when configuration is not found', async () => {
      mockPrismaService.systemConfigOrder.findFirst.mockResolvedValue(null);

      await expect(service.findOne())
        .rejects.toThrow('System configuration not found');
    });
  });

  describe('update', () => {
    it('should update the system configuration', async () => {
      const updateDto: UpdateSystemConfigOrderDto = {
        checkQualityTimesDays: 2,
        shippingDays: 3,
        reduceLegitPointIfReject: 15,
        limitReworkTimes: 4,
      };

      const mockUpdatedConfig = {
        id: '1',
        type: 'SYSTEM_CONFIG_ORDER',
        ...updateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.systemConfigOrder.update.mockResolvedValue(mockUpdatedConfig);

      const result = await service.update(updateDto);
      expect(result).toBeInstanceOf(SystemConfigOrderEntity);
      expect(result.id).toBe(mockUpdatedConfig.id);
      expect(result.type).toBe(mockUpdatedConfig.type);
      expect(result.checkQualityTimesDays).toBe(updateDto.checkQualityTimesDays);
      expect(mockPrismaService.systemConfigOrder.update).toHaveBeenCalledWith({
        where: {
          type: 'SYSTEM_CONFIG_ORDER',
        },
        data: updateDto,
      });
    });
  });
}); 