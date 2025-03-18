import { Module } from '@nestjs/common';
import { SystemConfigSizeService } from './system-config-size.service';
import { SystemConfigSizeResolver } from './system-config-size.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigSizeService, SystemConfigSizeResolver],
  exports: [SystemConfigSizeService],
})
export class SystemConfigSizeModule {} 