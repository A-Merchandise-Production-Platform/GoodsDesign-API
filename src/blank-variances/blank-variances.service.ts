import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlankVariance, Prisma } from '@prisma/client';

@Injectable()
export class BlankVariancesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BlankVarianceCreateInput): Promise<BlankVariance> {
    return this.prisma.blankVariance.create({ data });
  }

  async findAll(): Promise<BlankVariance[]> {
    return this.prisma.blankVariance.findMany();
  }

  async findOne(id: string): Promise<BlankVariance | null> {
    return this.prisma.blankVariance.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.BlankVarianceUpdateInput): Promise<BlankVariance> {
    return this.prisma.blankVariance.update({ where: { id }, data });
  }

  async remove(id: string): Promise<BlankVariance> {
    return this.prisma.blankVariance.delete({ where: { id } });
  }
}