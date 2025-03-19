import { Module } from '@nestjs/common';
import { DesignPositionService } from './design-position.service';
import { DesignPositionResolver } from './design-position.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DesignPositionResolver, DesignPositionService],
  exports: [DesignPositionService],
})
export class DesignPositionModule {} 