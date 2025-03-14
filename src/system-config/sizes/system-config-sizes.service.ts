import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateSystemConfigSizeDto, UpdateSystemConfigSizeDto } from './dto/system-config-size.dto';
import { Prisma } from '@prisma/client';

type SystemConfigSize = Prisma.SystemConfigSizeGetPayload<{}>;

@Injectable()
export class SystemConfigSizesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSystemConfigSizeDto, userId?: string): Promise<SystemConfigSize> {
    return this.prisma.systemConfigSize.create({
      data: {
        ...createDto,
        createdBy: userId,
      },
    });
  }

  async findAll(includeDeleted = false): Promise<SystemConfigSize[]> {
    return this.prisma.systemConfigSize.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string): Promise<SystemConfigSize> {
    const size = await this.prisma.systemConfigSize.findFirst({
      where: { id, isDeleted: false },
    });

    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    return size;
  }

  async update(
    id: string,
    updateDto: UpdateSystemConfigSizeDto,
    userId?: string,
  ): Promise<SystemConfigSize> {
    await this.findOne(id);

    return this.prisma.systemConfigSize.update({
      where: { id },
      data: {
        ...updateDto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId?: string): Promise<SystemConfigSize> {
    await this.findOne(id);

    return this.prisma.systemConfigSize.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async restore(id: string, userId?: string): Promise<SystemConfigSize> {
    const size = await this.prisma.systemConfigSize.findFirst({
      where: { id, isDeleted: true },
    });

    if (!size) {
      throw new NotFoundException(`Deleted size with ID ${id} not found`);
    }

    return this.prisma.systemConfigSize.update({
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
    const defaultSizes = [
      { code: 'S' },
      { code: 'M' },
      { code: 'L' },
      { code: 'XL' },
      { code: 'XXL' },
      { code: 'XXXL' },
    ];

    for (const size of defaultSizes) {
      await this.prisma.systemConfigSize.upsert({
        where: { code: size.code },
        update: {},
        create: {
          ...size,
          createdBy: userId,
        },
      });
    }
  }
}