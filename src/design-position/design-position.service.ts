import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDesignPositionDto } from './dto/update-design-position.dto';
import { DesignPositionEntity } from './entities/design-position.entity';

@Injectable()
export class DesignPositionService {
  constructor(private prisma: PrismaService) {}

  async findAll(designId?: string): Promise<DesignPositionEntity[]> {
    return this.prisma.designPosition.findMany({
      where: designId ? { designId } : undefined,
      include: {
        design: {
          include: {
            systemConfigVariant: true
          }
        },
        positionType: true,
      },
    });
  }

  async findOne(designId, productPositionTypeId): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.findUnique({
      where: { 
        designPositionId: {
          designId,
          productPositionTypeId
        }
      },
      include: {
        design: {
          include: {
            systemConfigVariant: true
          }
        },
        positionType: true,
      },
    });
  }

  async update(designId, productPositionTypeId, updateDesignPositionDto: UpdateDesignPositionDto): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.update({
      where: {
        designPositionId: {
          designId,
          productPositionTypeId
        }
       },
      data: updateDesignPositionDto,
      include: {
        design: {
          include: {
            systemConfigVariant: true
          }
        },
        positionType: true,
      },
    });
  }
} 