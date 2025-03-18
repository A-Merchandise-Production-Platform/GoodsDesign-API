import { Module } from '@nestjs/common';
import { ProductPositionTypeService } from './product-position-type.service';
import { ProductPositionTypeResolver } from './product-position-type.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductPositionTypeService, ProductPositionTypeResolver],
  exports: [ProductPositionTypeService],
})
export class ProductPositionTypeModule {} 