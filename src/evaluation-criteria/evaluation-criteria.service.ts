import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationCriteriaInput } from './dto/create-evaluation-criteria.input';
import { UpdateEvaluationCriteriaInput } from './dto/update-evaluation-criteria.input';
import { EvaluationCriteriaEntity } from './entities/evaluation-criteria.entity';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluationCriteriaInput: CreateEvaluationCriteriaInput) {
    const r = await this.prisma.evaluationCriteria.create({
      data: createEvaluationCriteriaInput,
      include: {
        product: true,
      },
    });
    return new EvaluationCriteriaEntity(r);
  }

  async findAll() {
    const r = await this.prisma.evaluationCriteria.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        product: true,
      },
    });
    return r.map((item) => new EvaluationCriteriaEntity(item));
  }

  async findOne(id: string) {
    const r = await this.prisma.evaluationCriteria.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    return new EvaluationCriteriaEntity(r);
  }

  async findByProduct(productId: string) {
    const r = await this.prisma.evaluationCriteria.findMany({
      where: {
        productId,
        isDeleted: false,
      },
      include: {
        product: true,
      },
    });
    return r.map((item) => new EvaluationCriteriaEntity(item));
  }

  async update(updateEvaluationCriteriaInput: UpdateEvaluationCriteriaInput) {
    const { id, ...data } = updateEvaluationCriteriaInput;
    const r = await this.prisma.evaluationCriteria.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    });
    return new EvaluationCriteriaEntity(r);
  }

  async remove(id: string) {
    const r = await this.prisma.evaluationCriteria.update({
      where: { id },
      data: {
        isDeleted: true,
      },
      include: {
        product: true,
      },
    });
    return new EvaluationCriteriaEntity(r);
  }
} 