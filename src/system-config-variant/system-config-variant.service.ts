import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigVariantInput } from './dto/create-system-config-variant.input';

@Injectable()
export class SystemConfigVariantService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigVariantInput: CreateSystemConfigVariantInput) {
    return this.prisma.systemConfigVariant.create({
      data: {
        name: createSystemConfigVariantInput.name,
        value: createSystemConfigVariantInput.value,
        productId: createSystemConfigVariantInput.productId,
        isActive: createSystemConfigVariantInput.isActive ?? true,
      },
      include: {
        product: true,
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

  async update(id: string, updateData: Partial<CreateSystemConfigVariantInput>) {
    return this.prisma.systemConfigVariant.update({
      where: { id },
      data: {
        name: updateData.name,
        value: updateData.value,
        isActive: updateData.isActive,
      },
      include: {
        product: true,
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