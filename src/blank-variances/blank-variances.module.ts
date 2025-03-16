import { Module } from '@nestjs/common';
import { BlankVariancesService } from './blank-variances.service';
import { BlankVariancesController } from './blank-variances.controller';
import { BlankVariancesResolver } from './blank-variances.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlankVariancesController],
  providers: [BlankVariancesService, BlankVariancesResolver],
})
export class BlankVariancesModule {}