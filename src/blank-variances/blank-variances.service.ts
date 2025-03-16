import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { Prisma } from "@prisma/client"
import { BlankVariancesEntity } from "./entities/blank-variances.entity"

@Injectable()
export class BlankVariancesService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.BlankVarianceCreateInput): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.create({
            data,
            include: {
                product: true
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }

    async findAll(): Promise<BlankVariancesEntity[]> {
        const blankVariances = await this.prisma.blankVariance.findMany({
            include: {
                product: true
            }
        })
        return blankVariances.map((variance) => new BlankVariancesEntity(variance))
    }

    async findOne(id: string): Promise<BlankVariancesEntity | null> {
        const blankVariance = await this.prisma.blankVariance.findUnique({
            where: { id },
            include: {
                product: true
            }
        })
        return blankVariance ? new BlankVariancesEntity(blankVariance) : null
    }

    async update(id: string, data: Prisma.BlankVarianceUpdateInput): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.update({
            where: { id },
            data,
            include: {
                product: true
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }

    async remove(id: string): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.delete({
            where: { id },
            include: {
                product: true
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }
}
