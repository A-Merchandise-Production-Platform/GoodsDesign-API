import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemConfigVariantInput } from './dto/create-system-config-variant.input';
import { UpdateSystemConfigVariantInput } from './dto/update-system-config-variant.input';

@Injectable()
export class SystemConfigVariantService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemConfigVariantInput: CreateSystemConfigVariantInput) {
    try {
      return await this.prisma.systemConfigVariant.create({
        data: {
          ...createSystemConfigVariantInput,
          isActive: true,
          isDeleted: false,
        },
        include: {
          product: true,
          blankVariances: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create system config variant: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.systemConfigVariant.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          product: true,
          blankVariances: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch system config variants: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const variant = await this.prisma.systemConfigVariant.findUnique({
        where: { id },
        include: {
          product: true,
          blankVariances: true,
        },
      });

      if (!variant || variant.isDeleted) {
        throw new NotFoundException(`System config variant with ID ${id} not found`);
      }

      return variant;
    } catch (error) {
      throw new Error(`Failed to fetch system config variant: ${error.message}`);
    }
  }

  async findByProduct(productId: string) {
    return this.prisma.systemConfigVariant.findMany({
      where: {
        productId,
        isDeleted: false,
      },
      include: {
        product: true,
        blankVariances: true,
      },
    });
  }

  async update(id: string, updateSystemConfigVariantInput: UpdateSystemConfigVariantInput) {
    return this.prisma.systemConfigVariant.update({
      where: { id },
      data: updateSystemConfigVariantInput,
    });
  }

  async remove(id: string) {
    return this.prisma.systemConfigVariant.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getDistinctVariantAttributes(productId: string) {
    try {
      const variants = await this.prisma.systemConfigVariant.findMany({
        where: {
          productId,
          isDeleted: false,
        },
        select: {
          color: true,
          size: true,
          model: true,
        },
      });

      return {
        colors: [...new Set(variants.map(v => v.color).filter(Boolean))],
        sizes: [...new Set(variants.map(v => v.size).filter(Boolean))],
        models: [...new Set(variants.map(v => v.model).filter(Boolean))],
      };
    } catch (error) {
      throw new Error(`Failed to fetch distinct variant attributes: ${error.message}`);
    }
  }
} 