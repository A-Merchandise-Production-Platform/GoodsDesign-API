import { Injectable } from "@nestjs/common"
import { CreateFactoryProductInput } from "src/factory-products/dto/create-factory-product.input"
import { UpdateFactoryProductInput } from "src/factory-products/dto/update-factory-product.input"
import { FactoryProductEntity } from "src/factory/entities/factory-product.entity"
import { PrismaService } from "src/prisma"

@Injectable()
export class FactoryProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        const factoryProducts = await this.prisma.factoryProduct.findMany({
            include: {
                factory: true,
                systemConfigVariant: true
            }
        })
        return factoryProducts.map((factoryProduct) => new FactoryProductEntity(factoryProduct))
    }

    async findOne(id: string) {
        const factoryProduct = await this.prisma.factoryProduct.findUnique({
            where: { id },
            include: {
                factory: true,
                systemConfigVariant: true
            }
        })
        return factoryProduct ? new FactoryProductEntity(factoryProduct) : null
    }

    async create(data: CreateFactoryProductInput) {
        const factoryProduct = await this.prisma.factoryProduct.create({
            data
        })
        return new FactoryProductEntity(factoryProduct)
    }

    async update(id: string, data: UpdateFactoryProductInput) {
        const { id: _, ...updateData } = data
        const factoryProduct = await this.prisma.factoryProduct.update({
            where: { id },
            data: updateData
        })
        return new FactoryProductEntity(factoryProduct)
    }

    async delete(id: string) {
        const factoryProduct = await this.prisma.factoryProduct.delete({
            where: { id }
        })
        return new FactoryProductEntity(factoryProduct)
    }
}
