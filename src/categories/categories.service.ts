import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        createdBy: userId,
      },
    });
  }

  async findAll(includeDeleted = false) {
    return this.prisma.category.findMany({
      where: includeDeleted ? undefined : { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, includeDeleted = false) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async restore(id: string, userId: string) {
    const category = await this.findOne(id, true);

    if (!category.isDeleted) {
      throw new NotFoundException(`Category with ID "${id}" is not deleted`);
    }

    return this.prisma.category.update({
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

  async toggleActive(id: string, userId: string) {
    const category = await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }
}