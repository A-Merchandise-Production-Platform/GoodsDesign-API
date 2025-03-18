import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigColorDto } from './dto/create-system-config-color.dto';
import { UpdateSystemConfigColorDto } from './dto/update-system-config-color.dto';
import { SystemConfigColorEntity } from './entities/system-config-color.entity';

@Injectable()
export class SystemConfigColorService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigColorDto: CreateSystemConfigColorDto): Promise<SystemConfigColorEntity> {
    return this.prisma.systemConfigColor.create({
      data: createSystemConfigColorDto,
    });
  }

  async findAll(): Promise<SystemConfigColorEntity[]> {
    return this.prisma.systemConfigColor.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  async findOne(id: string): Promise<SystemConfigColorEntity> {
    return this.prisma.systemConfigColor.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSystemConfigColorDto: UpdateSystemConfigColorDto): Promise<SystemConfigColorEntity> {
    return this.prisma.systemConfigColor.update({
      where: { id },
      data: updateSystemConfigColorDto,
    });
  }

  async remove(id: string): Promise<SystemConfigColorEntity> {
    return this.prisma.systemConfigColor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
} 