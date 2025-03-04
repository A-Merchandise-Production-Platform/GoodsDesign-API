import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        createdBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(includeDeleted = false) {
    return this.prisma.product.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string, includeDeleted = false) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async restore(id: string, userId: string) {
    const product = await this.findOne(id, true);

    if (!product.isDeleted) {
      throw new NotFoundException(`Product with ID "${id}" is not deleted`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
        updatedBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async toggleActive(id: string, userId: string) {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
        updatedAt: new Date(),
        updatedBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  async findByCategory(categoryId: string, includeDeleted = false) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
  }
}