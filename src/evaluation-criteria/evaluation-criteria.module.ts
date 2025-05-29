import { Module } from '@nestjs/common';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { EvaluationCriteriaResolver } from './evaluation-criteria.resolver';
import { PrismaModule } from '@/prisma';

@Module({
    imports: [PrismaModule],
  providers: [EvaluationCriteriaService, EvaluationCriteriaResolver],
})
export class EvaluationCriteriaModule {} 