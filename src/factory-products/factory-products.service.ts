import { Injectable, NotFoundException } from "@nestjs/common"
import { Factory, FactoryProduct, SystemConfigVariant, User } from "@prisma/client"
import { CreateFactoryProductInput } from "src/factory-products/dto/create-factory-product.input"
import { UpdateFactoryProductInput } from "src/factory-products/dto/update-factory-product.input"
import { FactoryProductEntity } from "src/factory-products/entities/factory-product.entity"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { PrismaService } from "src/prisma"
import { SystemConfigVariantEntity } from "src/system-config-variant/entities/system-config-variant.entity"

@Injectable()
export class FactoryProductsService {
    constructor(private readonly prisma: PrismaService) {}

    private mapFactoryProductToEntity(
        factoryProduct: FactoryProduct & {
            factory: Factory & { owner: User; staff: User }
            systemConfigVariant: SystemConfigVariant
        }
    ) {
        return new FactoryProductEntity({
            ...factoryProduct,
            factory: new FactoryEntity({
                ...factoryProduct.factory,
                owner: factoryProduct.factory.owner,
                staff: factoryProduct.factory.staff
            }),
            systemConfigVariant: new SystemConfigVariantEntity({
                ...factoryProduct.systemConfigVariant,
                id: factoryProduct.systemConfigVariant.id
            })
        })
    }

    private factoryProductInclude = {
        factory: {
            include: {
                owner: true,
                staff: true
            }
        },
        systemConfigVariant: true
    }
    async findAll() {
        const factoryProducts = await this.prisma.factoryProduct.findMany({
            include: this.factoryProductInclude
        })
        return factoryProducts.map(this.mapFactoryProductToEntity)
    }

    async findOne(factoryId: string, systemConfigVariantId: string) {
        const factoryProduct = await this.prisma.factoryProduct.findUnique({
            where: {
                factoryProductId: {
                    factoryId,
                    systemConfigVariantId
                }
            },
            include: this.factoryProductInclude
        })

        if (!factoryProduct) {
            throw new NotFoundException(`Factory product not found`)
        }

        return this.mapFactoryProductToEntity(factoryProduct)
    }

    async create(data: CreateFactoryProductInput) {
        const factoryProduct = await this.prisma.factoryProduct.create({
            data,
            include: {
                factory: {
                    include: {
                        owner: true,
                        staff: true
                    }
                },
                systemConfigVariant: true
            }
        })
        return this.mapFactoryProductToEntity(factoryProduct)
    }

    async update(
        factoryId: string,
        systemConfigVariantId: string,
        data: UpdateFactoryProductInput
    ) {
        const factoryProduct = await this.prisma.factoryProduct.update({
            where: {
                factoryProductId: {
                    factoryId,
                    systemConfigVariantId
                }
            },
            data,
            include: this.factoryProductInclude
        })
        return this.mapFactoryProductToEntity(factoryProduct)
    }

    async delete(factoryId: string, systemConfigVariantId: string) {
        const factoryProduct = await this.prisma.factoryProduct.delete({
            where: {
                factoryProductId: {
                    factoryId,
                    systemConfigVariantId
                }
            },
            include: this.factoryProductInclude
        })
        return this.mapFactoryProductToEntity(factoryProduct)
    }
}
