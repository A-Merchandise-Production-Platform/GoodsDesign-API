import { Module } from '@nestjs/common';
import { SystemConfigColorsController } from './system-config-colors.controller';
import { SystemConfigColorsService } from './system-config-colors.service';
import { PrismaModule } from '../../prisma';
import { SystemConfigColorsResolver } from './system-config-colors.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [SystemConfigColorsController],
  providers: [SystemConfigColorsService],
  exports: [SystemConfigColorsService],
})
export class SystemConfigColorsModule {}