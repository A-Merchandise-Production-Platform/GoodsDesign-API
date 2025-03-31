import { Module } from '@nestjs/common';
import { StaffTaskService } from './staff-tasks.service';
import { StaffTaskResolver } from './staff-tasks.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckQualityService } from './check-quality.service';
import { CheckQualityResolver } from './check-quality.resolver';

@Module({
  imports: [PrismaModule],
  providers: [StaffTaskService, StaffTaskResolver, CheckQualityService, CheckQualityResolver],
  exports: [StaffTaskService, CheckQualityService],
})
export class StaffTasksModule {} 