import { Module } from '@nestjs/common';
import { SystemConfigSizesService } from './system-config-sizes.service';
import { PrismaModule } from '../../prisma';
import { SystemConfigSizesResolver } from './system-config-sizes.resolver';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigSizesService, SystemConfigSizesResolver],
  exports: [SystemConfigSizesService],
})
export class SystemConfigSizesModule {}