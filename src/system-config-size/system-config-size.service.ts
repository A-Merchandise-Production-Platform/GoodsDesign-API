import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigSizeDto } from './dto/create-system-config-size.dto';
import { UpdateSystemConfigSizeDto } from './dto/update-system-config-size.dto';
import { SystemConfigSizeEntity } from './entities/system-config-size.entity';

@Injectable()
export class SystemConfigSizeService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigSizeDto: CreateSystemConfigSizeDto): Promise<SystemConfigSizeEntity> {
    return this.prisma.systemConfigSize.create({
      data: createSystemConfigSizeDto,
    });
  }

  async findAll(): Promise<SystemConfigSizeEntity[]> {
    return this.prisma.systemConfigSize.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  async findOne(id: string): Promise<SystemConfigSizeEntity> {
    return this.prisma.systemConfigSize.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSystemConfigSizeDto: UpdateSystemConfigSizeDto): Promise<SystemConfigSizeEntity> {
    return this.prisma.systemConfigSize.update({
      where: { id },
      data: updateSystemConfigSizeDto,
    });
  }

  async remove(id: string): Promise<SystemConfigSizeEntity> {
    return this.prisma.systemConfigSize.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
} 