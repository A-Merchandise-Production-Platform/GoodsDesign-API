import { Module } from '@nestjs/common';
import { SystemConfigBanksController } from './system-config-banks.controller';
import { SystemConfigBanksService } from './system-config-banks.service';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [SystemConfigBanksController],
  providers: [SystemConfigBanksService],
  exports: [SystemConfigBanksService],
})
export class SystemConfigBanksModule {}