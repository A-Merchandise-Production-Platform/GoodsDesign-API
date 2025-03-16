import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateSystemConfigColorDto, UpdateSystemConfigColorDto } from './dto/system-config-color.dto';
import { Prisma } from '@prisma/client';

type SystemConfigColor = Prisma.SystemConfigColorGetPayload<{}>;

@Injectable()
export class SystemConfigColorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSystemConfigColorDto, userId?: string): Promise<SystemConfigColor> {
    return this.prisma.systemConfigColor.create({
      data: {
        ...createDto,
        createdBy: userId,
      },
    });
  }

  async findAll(includeDeleted = false): Promise<SystemConfigColor[]> {
    return this.prisma.systemConfigColor.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string): Promise<SystemConfigColor> {
    const color = await this.prisma.systemConfigColor.findFirst({
      where: { id, isDeleted: false },
    });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    return color;
  }

  async update(
    id: string,
    updateDto: UpdateSystemConfigColorDto,
    userId?: string,
  ): Promise<SystemConfigColor> {
    await this.findOne(id);

    return this.prisma.systemConfigColor.update({
      where: { id },
      data: {
        ...updateDto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId?: string): Promise<SystemConfigColor> {
    await this.findOne(id);

    return this.prisma.systemConfigColor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async restore(id: string, userId?: string): Promise<SystemConfigColor> {
    const color = await this.prisma.systemConfigColor.findFirst({
      where: { id, isDeleted: true },
    });

    if (!color) {
      throw new NotFoundException(`Deleted color with ID ${id} not found`);
    }

    return this.prisma.systemConfigColor.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async seed(userId?: string): Promise<void> {
    const defaultColors = [
      { name: 'Red', code: '#FF0000' },
      { name: 'Green', code: '#00FF00' },
    ];

    for (const color of defaultColors) {
      await this.prisma.systemConfigColor.upsert({
        where: { code: color.code },
        update: {},
        create: {
          ...color,
          createdBy: userId,
        },
      });
    }
  }
}