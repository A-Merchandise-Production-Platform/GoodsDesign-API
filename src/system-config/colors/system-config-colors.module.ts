import { Module } from '@nestjs/common';
import { SystemConfigColorsService } from './system-config-colors.service';
import { PrismaModule } from '../../prisma';
import { SystemConfigColorsResolver } from './system-config-colors.resolver';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigColorsService, SystemConfigColorsResolver],
  exports: [SystemConfigColorsService],
})
export class SystemConfigColorsModule {}