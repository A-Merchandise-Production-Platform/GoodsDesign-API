import { Module } from '@nestjs/common';
import { SystemConfigColorService } from './system-config-color.service';
import { SystemConfigColorResolver } from './system-config-color.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemConfigColorService, SystemConfigColorResolver],
  exports: [SystemConfigColorService],
})
export class SystemConfigColorModule {} 