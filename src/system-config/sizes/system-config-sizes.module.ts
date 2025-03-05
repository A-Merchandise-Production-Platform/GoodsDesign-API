import { Module } from '@nestjs/common';
import { SystemConfigSizesController } from './system-config-sizes.controller';
import { SystemConfigSizesService } from './system-config-sizes.service';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [SystemConfigSizesController],
  providers: [SystemConfigSizesService],
  exports: [SystemConfigSizesService],
})
export class SystemConfigSizesModule {}