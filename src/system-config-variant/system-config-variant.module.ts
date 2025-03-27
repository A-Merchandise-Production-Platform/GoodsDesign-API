import { Module } from '@nestjs/common';
import { SystemConfigVariantService } from './system-config-variant.service';
import { SystemConfigVariantResolver } from './system-config-variant.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigVariantResolver, SystemConfigVariantService],
  exports: [SystemConfigVariantService],
})
export class SystemConfigVariantModule {} 