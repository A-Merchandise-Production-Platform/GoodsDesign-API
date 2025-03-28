import { Injectable } from "@nestjs/common"
import { CreateBlankVarianceDto } from "src/blank-variances/dto/create-blank-variance.dto"
import { UpdateBlankVarianceDto } from "src/blank-variances/dto/update-blank-variance.dto"
import { PrismaService } from "../prisma/prisma.service"
import { BlankVariancesEntity } from "./entities/blank-variances.entity"

@Injectable()
export class BlankVariancesService {
    constructor(private prisma: PrismaService) {}

    async create(createBlankVarianceInput: CreateBlankVarianceDto): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.create({
            data: {
                productId: createBlankVarianceInput.productId,
                systemVariantId: createBlankVarianceInput.systemVariantId,
                blankPrice: createBlankVarianceInput.blankPrice,
            },
            include: {
                product: true,
                systemVariant: true,
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }

    async findAll(): Promise<BlankVariancesEntity[]> {
        const blankVariances = await this.prisma.blankVariance.findMany({
            include: {
                product: true,
                systemVariant: true,
            }
        })
        return blankVariances.map((variance) => new BlankVariancesEntity(variance))
    }

    async findOne(id: string): Promise<BlankVariancesEntity | null> {
        const blankVariance = await this.prisma.blankVariance.findUnique({
            where: { id },
            include: {
                product: true,
                systemVariant: true,
            }
        })
        return blankVariance ? new BlankVariancesEntity(blankVariance) : null
    }

    async update(id: string, updateBlankVarianceInput: UpdateBlankVarianceDto): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.update({
            where: { id },
            data: {
                systemVariantId: updateBlankVarianceInput.systemVariantId,
                blankPrice: updateBlankVarianceInput.blankPrice,
            },
            include: {
                product: true,
                systemVariant: true,
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }

    async remove(id: string): Promise<BlankVariancesEntity> {
        const blankVariance = await this.prisma.blankVariance.delete({
            where: { id },
            include: {
                product: true,
                systemVariant: true,
            }
        })
        return new BlankVariancesEntity(blankVariance)
    }
}
