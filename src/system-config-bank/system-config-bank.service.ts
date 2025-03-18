import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigBankDto } from './dto/create-system-config-bank.dto';
import { UpdateSystemConfigBankDto } from './dto/update-system-config-bank.dto';
import { SystemConfigBankEntity } from './entities/system-config-bank.entity';

@Injectable()
export class SystemConfigBankService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigBankDto: CreateSystemConfigBankDto): Promise<SystemConfigBankEntity> {
    return this.prisma.systemConfigBank.create({
      data: createSystemConfigBankDto,
    });
  }

  async findAll(): Promise<SystemConfigBankEntity[]> {
    return this.prisma.systemConfigBank.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  async findOne(id: string): Promise<SystemConfigBankEntity> {
    return this.prisma.systemConfigBank.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSystemConfigBankDto: UpdateSystemConfigBankDto): Promise<SystemConfigBankEntity> {
    return this.prisma.systemConfigBank.update({
      where: { id },
      data: updateSystemConfigBankDto,
    });
  }

  async remove(id: string): Promise<SystemConfigBankEntity> {
    return this.prisma.systemConfigBank.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
} 