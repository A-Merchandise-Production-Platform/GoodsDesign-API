import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateSystemConfigDiscountDto } from "./dto/create-system-config-discount.dto"
import { UpdateSystemConfigDiscountDto } from "./dto/update-system-config-discount.dto"
import { SystemConfigDiscountEntity } from "./entities/system-config-discount.entity"

@Injectable()
export class SystemConfigDiscountService {
    constructor(private prisma: PrismaService) {}

    async create(createDto: CreateSystemConfigDiscountDto): Promise<SystemConfigDiscountEntity> {
        const discount = await this.prisma.systemConfigDiscount.create({
            data: createDto,
            include: {
                product: true
            }
        })

        return new SystemConfigDiscountEntity(discount)
    }

    async findAll(): Promise<SystemConfigDiscountEntity[]> {
        const discounts = await this.prisma.systemConfigDiscount.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                minQuantity: "asc"
            },
            include: {
                product: true
            }
        })

        return discounts.map((discount) => new SystemConfigDiscountEntity(discount))
    }

    async findOne(id: string): Promise<SystemConfigDiscountEntity> {
        const discount = await this.prisma.systemConfigDiscount.findUnique({
            where: { id },
            include: {
                product: true
            }
        })

        return new SystemConfigDiscountEntity(discount)
    }

    async update(
        id: string,
        updateDto: UpdateSystemConfigDiscountDto
    ): Promise<SystemConfigDiscountEntity> {
        const discount = await this.prisma.systemConfigDiscount.update({
            where: { id },
            data: updateDto,
            include: {
                product: true
            }
        })

        return new SystemConfigDiscountEntity(discount)
    }

    async remove(id: string): Promise<SystemConfigDiscountEntity> {
        const discount = await this.prisma.systemConfigDiscount.update({
            where: { id },
            data: {
                isDeleted: true
            },
            include: {
                product: true
            }
        })

        return new SystemConfigDiscountEntity(discount)
    }

    async getApplicableDiscount(productId: string, quantity: number): Promise<number> {
        const discounts = await this.prisma.systemConfigDiscount.findMany({
            where: {
                productId,
                isDeleted: false,
                isActive: true,
                minQuantity: {
                    lte: quantity
                }
            },
            orderBy: {
                discountPercent: "desc"
            },
            take: 1
        })

        return discounts.length > 0 ? discounts[0].discountPercent : 0
    }

    async getApplicableDiscountByProductId(productId: string, quantity: number): Promise<number> {
        const discounts = await this.prisma.systemConfigDiscount.findMany({
            where: {
                productId,
                isDeleted: false,
                isActive: true,
                minQuantity: {
                    lte: quantity || 0
                }
            },
            orderBy: {
                discountPercent: "desc"
            },
            take: 1
        })

        return discounts.length > 0 ? discounts[0].discountPercent : 0
    }

    async getAllDiscountByProductId(productId: string): Promise<SystemConfigDiscountEntity[]> {
        const discounts = await this.prisma.systemConfigDiscount.findMany({
            where: {
                productId,
                isDeleted: false,
                isActive: true
            },
            include: {
                product: true
            }
        })

        return discounts.map((discount) => new SystemConfigDiscountEntity(discount))
    }
}
