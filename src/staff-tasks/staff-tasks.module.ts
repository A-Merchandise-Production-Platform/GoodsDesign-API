import { Module } from '@nestjs/common';
import { StaffTaskService } from './staff-tasks.service';
import { StaffTaskResolver } from './staff-tasks.resolver';
import { PrismaService } from '../prisma';

@Module({
  providers: [StaffTaskService, StaffTaskResolver, PrismaService],
  exports: [StaffTaskService],
})
export class StaffTaskModule {} 