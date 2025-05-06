import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { randomBytes } from "crypto"
import { PrismaService } from "../prisma/prisma.service"
import { Prisma, PrismaClient, Roles, Voucher, VoucherType, VoucherUsage } from "@prisma/client"
import { VoucherEntity } from "./entities/voucher.entity"
import { VoucherUsageEntity } from "src/vouchers/entities/voucher-usage.entity"
import { CreateVoucherInput } from "./dto/create-voucher.input"
import { UpdateVoucherInput } from "src/vouchers/dto/update-voucher.input"
import { NotificationsService } from "src/notifications/notifications.service"
import { DefaultArgs } from "@prisma/client/runtime/library"

@Injectable()
export class VouchersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) {}

    private generateVoucherCode(length = 8): string {
        return randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .toUpperCase()
            .slice(0, length)
    }

    private toVoucherEntity(voucher: Voucher & { usages: VoucherUsage[] }) {
        return new VoucherEntity({
            ...voucher,
            usages: voucher.usages.map((usage) => new VoucherUsageEntity(usage))
        })
    }

    checkVoucherValueType(value: number): VoucherType {
        if (value < 0) {
            throw new BadRequestException("Voucher value cannot be negative")
        }

        if (value >= 0 && value <= 100) {
            return VoucherType.PERCENTAGE
        }

        if (value >= 1000) {
            return VoucherType.FIXED_VALUE
        }

        throw new BadRequestException("Invalid voucher value")
    }

    validateVoucherValueAndType(value: number, type: VoucherType) {
        if (type === VoucherType.PERCENTAGE) {
            if (value < 0 || value > 100) {
                return false
            }
        }

        if (type === VoucherType.FIXED_VALUE) {
            if (value < 1000) {
                return false
            }
        }

        return true
    }

    async validateVoucher(id: string) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id },
            include: {
                usages: true
            }
        })

        if (!voucher) {
            throw new NotFoundException("Voucher not found")
        }

        if (!voucher.isActive) {
            throw new BadRequestException("Voucher is not active")
        }

        if (voucher.isDeleted) {
            throw new BadRequestException("Voucher is deleted")
        }

        if (voucher.limitedUsage && voucher.usages.length >= voucher.limitedUsage) {
            throw new BadRequestException("Voucher is out of stock")
        }

        return this.toVoucherEntity(voucher)
    }

    async getAllPublicVouchers() {
        const vouchers = await this.prisma.voucher.findMany({
            where: {
                isActive: true,
                isDeleted: false,
                isPublic: true
            },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAvailableVouchersForUser(userId: string) {
        const vouchers = await this.prisma.voucher.findMany({
            where: {
                isActive: true,
                isDeleted: false,
                OR: [{ isPublic: true }, { userId: userId }]
            },
            include: {
                usages: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const availableVouchers = vouchers.filter((voucher) => {
            if (voucher.limitedUsage) {
                const totalUsages = voucher.usages?.length || 0
                if (totalUsages >= voucher.limitedUsage) {
                    return false
                }
            }

            const userUsages = voucher.usages.filter((usage) => usage.userId === userId)

            if (userUsages.length > 0) {
                return false
            }

            return true
        })

        return availableVouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllSystemVouchers() {
        const vouchers = await this.prisma.voucher.findMany({
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllVouchersOfUser(userId: string) {
        const vouchers = await this.prisma.voucher.findMany({
            where: {
                OR: [{ isPublic: true }, { userId: userId }]
            },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllUserUsages(userId: string) {
        const usages = await this.prisma.voucherUsage.findMany({
            where: { userId },
            include: { voucher: true },
            orderBy: {
                usedAt: "desc"
            }
        })

        return usages.map((usage) => new VoucherUsageEntity(usage))
    }

    async getVoucherById(id: string) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async createVoucher(input: CreateVoucherInput) {
        if (!this.validateVoucherValueAndType(input.value, input.type)) {
            throw new BadRequestException("Invalid voucher value")
        }

        const voucher = await this.prisma.voucher.create({
            data: {
                code: this.generateVoucherCode(),
                type: input.type,
                value: input.value,
                minOrderValue: input.minOrderValue,
                maxDiscountValue: input.maxDiscountValue,
                description: input.description,
                isPublic: input.isPublic,
                limitedUsage: input.limitedUsage,
                isDeleted: false,
                userId: input.userId,
                usages: {
                    create: []
                }
            },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        if (!input.isPublic) {
            await this.notificationsService.createForUsersByRoles({
                title: "Goods Design has given you a voucher",
                content: `You have received a voucher from Goods Design. Please check it out.`,
                url: `/profile/voucher`,
                roles: [Roles.CUSTOMER]
            })
        }

        return this.toVoucherEntity(voucher)
    }

    async createVoucherForUser(userId: string, input: CreateVoucherInput) {
        const voucher = await this.prisma.voucher.create({
            data: {
                code: this.generateVoucherCode(),
                type: input.type,
                value: input.value,
                minOrderValue: input.minOrderValue,
                maxDiscountValue: input.maxDiscountValue,
                description: input.description,
                isPublic: false,
                limitedUsage: input.limitedUsage,
                isDeleted: false,
                userId: userId,
                usages: {
                    create: []
                }
            },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        await this.notificationsService.create({
            userId,
            title: "Voucher created",
            content: `Voucher ${voucher.code} created successfully`,
            url: `/profile/voucher`
        })

        return this.toVoucherEntity(voucher)
    }

    async disableVoucher(id: string) {
        const voucher = await this.prisma.voucher.update({
            where: { id },
            data: { isActive: false },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async deleteVoucher(id: string) {
        const voucher = await this.prisma.voucher.delete({
            where: { id },
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async updateVoucher(id: string, input: UpdateVoucherInput) {
        const voucher = await this.prisma.voucher.update({
            where: { id },
            data: input,
            include: {
                usages: {
                    include: {
                        user: true,
                        order: true
                    }
                }
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async calculateVoucherDiscount(voucherId: string, orderValue: number) {
        const voucher = await this.validateVoucher(voucherId)

        // Validate voucher can be used
        if (voucher.limitedUsage && voucher.usages.length >= voucher.limitedUsage) {
            throw new BadRequestException("Voucher is out of stock")
        }

        if (!voucher.isActive) {
            throw new BadRequestException("Voucher is not active")
        }

        if (voucher.isDeleted) {
            throw new BadRequestException("Voucher is deleted")
        }

        console.log("voucher", voucher)

        // Check minimum order value
        if (voucher.minOrderValue && orderValue < voucher.minOrderValue) {
            throw new BadRequestException("Order amount is less than the minimum order value")
        }

        // Calculate discount based on voucher type
        let discountAmount = 0

        if (voucher.type === VoucherType.PERCENTAGE) {
            // Calculate percentage discount
            discountAmount = (orderValue * voucher.value) / 100

            // Apply maximum discount cap if it exists
            if (voucher.maxDiscountValue) {
                discountAmount = Math.min(discountAmount, voucher.maxDiscountValue)
            }
        } else if (voucher.type === VoucherType.FIXED_VALUE) {
            discountAmount = voucher.value

            // Make sure discount doesn't exceed order value
            discountAmount = Math.min(discountAmount, orderValue)
        } else {
            throw new BadRequestException("Invalid voucher type")
        }

        console.log("discountAmount", discountAmount)

        // Calculate final price after discount
        const finalPrice = orderValue - discountAmount

        console.log("finalPrice", finalPrice)

        return {
            originalPrice: orderValue,
            discountAmount: discountAmount,
            finalPrice: finalPrice
        }
    }

    async calculateVoucherDiscountWithoutValidation(voucherId: string, orderValue: number) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id: voucherId }
        })

        if (!voucher) {
            throw new NotFoundException("Voucher not found")
        }

        let finalPrice = orderValue

        if (voucher.type === VoucherType.PERCENTAGE) {
            const discountAmount = (orderValue * voucher.value) / 100
            // If maxDiscountValue is set, use it as the maximum discount amount
            if (voucher.maxDiscountValue && discountAmount > voucher.maxDiscountValue) {
                finalPrice = orderValue - voucher.maxDiscountValue
            } else {
                finalPrice = orderValue - discountAmount
            }
        } else if (voucher.type === VoucherType.FIXED_VALUE) {
            finalPrice = orderValue - voucher.value
        }

        // Ensure final price is not negative
        finalPrice = Math.max(0, finalPrice)

        return {
            originalPrice: orderValue,
            discountAmount: orderValue - finalPrice,
            finalPrice: finalPrice
        }
    }

    async createVoucherUsage(
        voucherId: string,
        userId: string,
        orderId: string,
        tx: Prisma.TransactionClient
    ) {
        const voucher = await this.validateVoucher(voucherId)

        if (voucher.limitedUsage && voucher.usages.length >= voucher.limitedUsage) {
            throw new BadRequestException("Voucher is out of stock")
        }

        if (!voucher.isActive) {
            throw new BadRequestException("Voucher is not active")
        }

        if (voucher.isDeleted) {
            throw new BadRequestException("Voucher is deleted")
        }

        // Check if user has already used this voucher
        const userUsages = voucher.usages.filter((usage) => usage.userId === userId)
        if (userUsages.length > 0) {
            throw new BadRequestException("You have already used this voucher")
        }

        try {
            const voucherUsage = await tx.voucherUsage.create({
                data: {
                    voucherId: voucherId,
                    userId: userId,
                    orderId: orderId
                }
            })

            return voucherUsage
        } catch (error) {
            console.error(`Error creating voucher usage:`, error)
            throw new BadRequestException("Failed to create voucher usage")
        }
    }
}
