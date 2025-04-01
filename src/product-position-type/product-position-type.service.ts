import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductPositionTypeDto } from './dto/create-product-position-type.dto';
import { UpdateProductPositionTypeDto } from './dto/update-product-position-type.dto';
import { ProductPositionTypeEntity } from './entities/product-position-type.entity';

@Injectable()
export class ProductPositionTypeService {
  constructor(private prisma: PrismaService) {}

  async create(createProductPositionTypeDto: CreateProductPositionTypeDto): Promise<ProductPositionTypeEntity> {
    const data = await this.prisma.productPositionType.create({
      data: createProductPositionTypeDto,
      include: {
        product: true,
        designPositions: true,
      },
    });
    return new ProductPositionTypeEntity(data);
  }

  async findAll(productId: string): Promise<ProductPositionTypeEntity[]> {
    const data = await this.prisma.productPositionType.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
        designPositions: true,
      },
    });
    return data.map(item => new ProductPositionTypeEntity(item));
  }

  async findOne(id: string): Promise<ProductPositionTypeEntity> {
    const data = await this.prisma.productPositionType.findUnique({
      where: { id },
      include: {
        product: true,
        designPositions: true,
      },
    });
    return new ProductPositionTypeEntity(data);
  }

  async update(id: string, updateProductPositionTypeDto: UpdateProductPositionTypeDto): Promise<ProductPositionTypeEntity> {
    const data = await this.prisma.productPositionType.update({
      where: { id },
      data: updateProductPositionTypeDto,
      include: {
        product: true,
        designPositions: true,
      },
    });
    return new ProductPositionTypeEntity(data);
  }

  async remove(id: string): Promise<ProductPositionTypeEntity> {
    const data = await this.prisma.productPositionType.delete({
      where: { id },
      include: {
        product: true,
        designPositions: true,
      },
    });
    return new ProductPositionTypeEntity(data);
  }
} 