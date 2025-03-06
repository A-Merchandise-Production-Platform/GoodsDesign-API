import { Module } from '@nestjs/common';
import { SystemConfigBanksController } from './system-config-banks.controller';
import { SystemConfigBanksService } from './system-config-banks.service';
import { PrismaModule } from '../../prisma';
import { SystemConfigBanksResolver } from './system-config-banks.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [SystemConfigBanksController],
  providers: [SystemConfigBanksService, SystemConfigBanksResolver],
  exports: [SystemConfigBanksService],
})
export class SystemConfigBanksModule {}