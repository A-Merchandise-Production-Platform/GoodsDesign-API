import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma';
import { SystemConfigBanksResolver } from './system-config-banks.resolver';
import { SystemConfigBanksService } from './system-config-banks.service';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigBanksService, SystemConfigBanksResolver],
  exports: [SystemConfigBanksService],
})
export class SystemConfigBanksModule {}