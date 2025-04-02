import { Module } from '@nestjs/common';
import { FactoryOrderService } from './factory-orders.service';
import { FactoryOrderResolver } from './factory-orders.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FactoryProgressReportService } from './factory-progress-report.service';
import { FactoryProgressReportResolver } from './factory-progress-report.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    FactoryOrderService,
    FactoryOrderResolver,
    FactoryProgressReportService,
    FactoryProgressReportResolver,
  ],
  exports: [FactoryOrderService, FactoryProgressReportService],
})
export class FactoryOrdersModule {}