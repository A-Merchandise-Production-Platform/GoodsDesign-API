import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDesignPositionDto } from './dto/create-design-position.dto';
import { UpdateDesignPositionDto } from './dto/update-design-position.dto';
import { DesignPositionEntity } from './entities/design-position.entity';

@Injectable()
export class DesignPositionService {
  constructor(private prisma: PrismaService) {}

  async create(createDesignPositionDto: CreateDesignPositionDto): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.create({
      data: createDesignPositionDto,
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

  async findOne(id: string): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.findUnique({
      where: { id },
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

  async update(id: string, updateDesignPositionDto: UpdateDesignPositionDto): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.update({
      where: { id },
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

  async remove(id: string): Promise<DesignPositionEntity> {
    return this.prisma.designPosition.delete({
      where: { id },
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