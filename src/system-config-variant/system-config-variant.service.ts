import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateSystemConfigVariantInput } from "./dto/create-system-config-variant.input"
import { UpdateSystemConfigVariantInput } from "./dto/update-system-config-variant.input"

@Injectable()
export class SystemConfigVariantService {
    constructor(private prisma: PrismaService) {}

    async create(createSystemConfigVariantInput: CreateSystemConfigVariantInput) {
        try {
            // Check if variant with same size and color exists
            const existingVariant = await this.prisma.systemConfigVariant.findFirst({
                where: {
                    productId: createSystemConfigVariantInput.productId,
                    size: createSystemConfigVariantInput.size?.toUpperCase(),
                    color: createSystemConfigVariantInput.color,
                    isDeleted: false
                }
            })

            if (existingVariant) {
                throw new BadRequestException(
                    `A variant with size ${createSystemConfigVariantInput.size} and color ${createSystemConfigVariantInput.color} already exists for this product`
                )
            }

            return await this.prisma.systemConfigVariant.create({
                data: {
                    ...createSystemConfigVariantInput,
                    size: createSystemConfigVariantInput.size.toUpperCase(),
                    isActive: true,
                    isDeleted: false
                },
                include: {
                    product: true,
                    productDesigns: true
                }
            })
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            throw new Error(`Failed to create system config variant: ${error.message}`)
        }
    }

    async findAll() {
        try {
            return await this.prisma.systemConfigVariant.findMany({
                where: {
                    isDeleted: false,
                    isActive: true
                },
                include: {
                    product: true,
                    productDesigns: true
                }
            })
        } catch (error) {
            throw new Error(`Failed to fetch system config variants: ${error.message}`)
        }
    }

    async findOne(id: string) {
        try {
            const variant = await this.prisma.systemConfigVariant.findUnique({
                where: { id },
                include: {
                    product: true,
                    productDesigns: true
                }
            })

            if (!variant || variant.isDeleted) {
                throw new NotFoundException(`System config variant with ID ${id} not found`)
            }

            return variant
        } catch (error) {
            throw new Error(`Failed to fetch system config variant: ${error.message}`)
        }
    }

    async findByProduct(productId: string) {
        return this.prisma.systemConfigVariant.findMany({
            where: {
                productId,
                isDeleted: false,
                isActive: true
            },
            include: {
                product: true,
                productDesigns: true
            }
        })
    }

    async update(id: string, updateSystemConfigVariantInput: UpdateSystemConfigVariantInput) {
        return this.prisma.systemConfigVariant.update({
            where: { id },
            data: updateSystemConfigVariantInput
        })
    }

    async remove(id: string) {
        return this.prisma.systemConfigVariant.update({
            where: { id },
            data: { isDeleted: true, isActive: false }
        })
    }

    async getDistinctVariantAttributes(productId: string) {
        try {
            const variants = await this.prisma.systemConfigVariant.findMany({
                where: {
                    productId,
                    isDeleted: false
                },
                select: {
                    color: true,
                    size: true,
                    model: true
                }
            })

            return {
                colors: [...new Set(variants.map((v) => v.color).filter(Boolean))],
                sizes: [...new Set(variants.map((v) => v.size).filter(Boolean))],
                models: [...new Set(variants.map((v) => v.model).filter(Boolean))]
            }
        } catch (error) {
            throw new Error(`Failed to fetch distinct variant attributes: ${error.message}`)
        }
    }
}
