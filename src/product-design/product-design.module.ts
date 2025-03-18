import { Module } from '@nestjs/common';
import { ProductDesignService } from './product-design.service';
import { ProductDesignResolver } from './product-design.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductDesignResolver, ProductDesignService],
  exports: [ProductDesignService],
})
export class ProductDesignModule {} 