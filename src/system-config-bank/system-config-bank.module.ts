import { Module } from '@nestjs/common';
import { SystemConfigBankService } from './system-config-bank.service';
import { SystemConfigBankResolver } from './system-config-bank.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigBankService, SystemConfigBankResolver],
  exports: [SystemConfigBankService],
})
export class SystemConfigBankModule {} 