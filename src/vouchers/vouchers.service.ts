import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { randomBytes } from "crypto"
import { PrismaService } from "../prisma/prisma.service"
import { Roles, Voucher, VoucherType, VoucherUsage } from "@prisma/client"
import { VoucherEntity } from "./entities/voucher.entity"
import { VoucherUsageEntity } from "src/vouchers/entities/voucher-usage.entity"
import { CreateVoucherInput } from "./dto/create-voucher.input"
import { UpdateVoucherInput } from "src/vouchers/dto/update-voucher.input"
import { NotificationsService } from "src/notifications/notifications.service"

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

    async validateVoucher(id: string) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id },
            include: { usages: true }
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
                usages: true
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
                    where: {
                        userId: userId
                    }
                }
            }
        })

        const availableVouchers = vouchers.filter((voucher) => {
            if (voucher.limitedUsage) {
                const totalUsages = voucher.usages?.length || 0
                if (totalUsages >= voucher.limitedUsage) {
                    return false
                }
            }

            return true
        })

        return availableVouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllSystemVouchers() {
        const vouchers = await this.prisma.voucher.findMany({
            include: { usages: true }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllVouchersOfUser(userId: string) {
        const vouchers = await this.prisma.voucher.findMany({
            where: {
                OR: [{ isPublic: true }, { userId: userId }]
            },
            include: { usages: true }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getAllUserUsages(userId: string) {
        const usages = await this.prisma.voucherUsage.findMany({
            where: { userId },
            include: { voucher: true }
        })

        return usages.map((usage) => new VoucherUsageEntity(usage))
    }

    async getVoucherById(id: string) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id },
            include: { usages: true }
        })

        return this.toVoucherEntity(voucher)
    }

    async createVoucher(input: CreateVoucherInput) {
        const voucher = await this.prisma.voucher.create({
            data: {
                code: this.generateVoucherCode(),
                type: input.type,
                value: input.value,
                minOrderValue: input.minOrderValue,
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
                usages: true
            }
        })

        if (input.isPublic) {
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
                usages: true
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
            include: { usages: true }
        })

        return this.toVoucherEntity(voucher)
    }

    async deleteVoucher(id: string) {
        const voucher = await this.prisma.voucher.delete({
            where: { id },
            include: { usages: true }
        })

        return this.toVoucherEntity(voucher)
    }

    async updateVoucher(id: string, input: UpdateVoucherInput) {
        const voucher = await this.prisma.voucher.update({
            where: { id },
            data: input,
            include: { usages: true }
        })

        return this.toVoucherEntity(voucher)
    }

    async calculateVoucherDiscount(voucherId: string, orderValue: number) {
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

        if (voucher.minOrderValue && voucher.minOrderValue > 0) {
            if (orderValue < voucher.minOrderValue) {
                throw new BadRequestException("Order amount is less than the minimum order value")
            }
        }

        if (voucher.type === "PERCENTAGE") {
            const discount = (orderValue * voucher.value) / 100
            return orderValue - discount
        }

        if (voucher.type === "FIXED_VALUE") {
            return orderValue - voucher.value
        }

        throw new BadRequestException("Invalid voucher type")
    }

    async createVoucherUsage(voucherId: string, userId: string, orderId: string) {
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

        return this.prisma.voucherUsage.create({
            data: {
                voucherId: voucherId,
                userId: userId,
                orderId: orderId
            }
        })
    }

    async useVoucher(voucherId: string, userId: string, orderId: string, orderValue: number) {
        const finalPrice = await this.calculateVoucherDiscount(voucherId, orderValue)
        await this.createVoucherUsage(voucherId, userId, orderId)
        return finalPrice
    }
}
