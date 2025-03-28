import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigVariantInput } from './dto/create-system-config-variant.input';
import { UpdateSystemConfigVariantInput } from './dto/update-system-config-variant.input';

@Injectable()
export class SystemConfigVariantService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigVariantInput: CreateSystemConfigVariantInput) {
    return this.prisma.systemConfigVariant.create({
      data: {
        productId: createSystemConfigVariantInput.productId,
        size: createSystemConfigVariantInput.size,
        color: createSystemConfigVariantInput.color,
        model: createSystemConfigVariantInput.model,
      },
    });
  }

  async findAll() {
    return this.prisma.systemConfigVariant.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        product: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.systemConfigVariant.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.systemConfigVariant.findMany({
      where: {
        productId,
        isDeleted: false,
        isActive: true,
      },
      include: {
        product: true,
      },
    });
  }

  async update(id: string, updateSystemConfigVariantInput: UpdateSystemConfigVariantInput) {
    return this.prisma.systemConfigVariant.update({
      where: { id },
      data: {
        size: updateSystemConfigVariantInput.size,
        color: updateSystemConfigVariantInput.color,
        model: updateSystemConfigVariantInput.model,
        isActive: updateSystemConfigVariantInput.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.systemConfigVariant.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
      include: {
        product: true,
      },
    });
  }
} 