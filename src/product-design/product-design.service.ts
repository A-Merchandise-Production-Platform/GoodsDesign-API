import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { UpdateProductDesignDto } from './dto/update-product-design.dto';
import { ProductDesignEntity } from './entities/product-design.entity';

@Injectable()
export class ProductDesignService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDesignDto: CreateProductDesignDto): Promise<ProductDesignEntity> {
    return this.prisma.productDesign.create({
      data: {
        ...createProductDesignDto,
        userId: createProductDesignDto?.userId
      },
      include: {
        user: true,
        blankVariant: {
          include: {
            product: true,
            systemVariant: true,
          },
        },
        designPositions: {
          include: {
            positionType: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string): Promise<ProductDesignEntity[]> {
    return this.prisma.productDesign.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
        blankVariant: {
          include: {
            product: true,
            systemVariant: true,
          },
        },
        designPositions: {
          include: {
            positionType: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<ProductDesignEntity> {
    return this.prisma.productDesign.findUnique({
      where: { id },
      include: {
        user: true,
        blankVariant: {
          include: {
            product: true,
            systemVariant: true,
          },
        },
        designPositions: {
          include: {
            positionType: true,
          },
        },
      },
    });
  }

  async update(id: string, updateProductDesignDto: UpdateProductDesignDto): Promise<ProductDesignEntity> {
    return this.prisma.productDesign.update({
      where: { id },
      data: updateProductDesignDto,
      include: {
        user: true,
        blankVariant: {
          include: {
            product: true,
            systemVariant: true,
          },
        },
        designPositions: {
          include: {
            positionType: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<ProductDesignEntity> {
    return this.prisma.productDesign.delete({
      where: { id },
      include: {
        user: true,
        blankVariant: {
          include: {
            product: true,
            systemVariant: true,
          },
        },
        designPositions: {
          include: {
            positionType: true,
          },
        },
      },
    });
  }
} 