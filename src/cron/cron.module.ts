import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [CronService],
})
export class CronModule {}