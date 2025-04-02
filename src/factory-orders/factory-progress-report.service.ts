import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFactoryProgressReportDto } from './dto/create-factory-progress-report.dto';
import { FactoryProgressReport } from './entity/factory-progress-report.entity';

@Injectable()
export class FactoryProgressReportService {
  private logger = new Logger(FactoryProgressReportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFactoryProgressReportDto): Promise<FactoryProgressReport> {
    try {
      const report = await this.prisma.factoryProgressReport.create({
        data: {
          factoryOrderId: dto.factoryOrderId,
          completedQty: dto.completedQty,
          estimatedCompletion: dto.estimatedCompletion,
          notes: dto.notes,
          photoUrls: dto.photoUrls,
        },
        include: {
          factoryOrder: true,
        },
      });

      return new FactoryProgressReport(report);
    } catch (error) {
      this.logger.error(`Error creating progress report: ${error.message}`);
      throw error;
    }
  }

  async findByFactoryOrder(factoryOrderId: string): Promise<FactoryProgressReport[]> {
    try {
      const reports = await this.prisma.factoryProgressReport.findMany({
        where: {
          factoryOrderId,
        },
        include: {
          factoryOrder: true,
        },
        orderBy: {
          reportDate: 'desc',
        },
      });

      return reports.map(report => new FactoryProgressReport(report));
    } catch (error) {
      this.logger.error(`Error finding progress reports: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<FactoryProgressReport> {
    try {
      const report = await this.prisma.factoryProgressReport.findUnique({
        where: { id },
        include: {
          factoryOrder: true,
        },
      });

      if (!report) {
        throw new Error('Progress report not found');
      }

      return new FactoryProgressReport(report);
    } catch (error) {
      this.logger.error(`Error finding progress report: ${error.message}`);
      throw error;
    }
  }
} 