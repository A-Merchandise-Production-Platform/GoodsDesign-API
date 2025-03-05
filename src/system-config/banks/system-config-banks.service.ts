import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateSystemConfigBankDto, UpdateSystemConfigBankDto } from './dto/system-config-bank.dto';
import { Prisma } from '@prisma/client';

type SystemConfigBank = Prisma.SystemConfigBankGetPayload<{}>;

@Injectable()
export class SystemConfigBanksService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSystemConfigBankDto, userId?: string): Promise<SystemConfigBank> {
    return this.prisma.systemConfigBank.create({
      data: {
        ...createDto,
        createdBy: userId,
      },
    });
  }

  async findAll(includeDeleted = false): Promise<SystemConfigBank[]> {
    return this.prisma.systemConfigBank.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<SystemConfigBank> {
    const bank = await this.prisma.systemConfigBank.findFirst({
      where: { id, isDeleted: false },
    });

    if (!bank) {
      throw new NotFoundException(`Bank with ID ${id} not found`);
    }

    return bank;
  }

  async update(
    id: number,
    updateDto: UpdateSystemConfigBankDto,
    userId?: string,
  ): Promise<SystemConfigBank> {
    await this.findOne(id);

    return this.prisma.systemConfigBank.update({
      where: { id },
      data: {
        ...updateDto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async remove(id: number, userId?: string): Promise<SystemConfigBank> {
    await this.findOne(id);

    return this.prisma.systemConfigBank.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async restore(id: number, userId?: string): Promise<SystemConfigBank> {
    const bank = await this.prisma.systemConfigBank.findFirst({
      where: { id, isDeleted: true },
    });

    if (!bank) {
      throw new NotFoundException(`Deleted bank with ID ${id} not found`);
    }

    return this.prisma.systemConfigBank.update({
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
}