import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import {
    CreateVoucherInput,
    UpdateVoucherInput,
    GetUserVouchersInput,
    CreateVoucherForUserInput
} from "./dto"
import { Voucher } from "./entities/voucher.entity"
import { UserEntity } from "src/users/entities/users.entity"
import { randomBytes } from "crypto"

@Injectable()
export class VouchersService {
    constructor(private readonly prisma: PrismaService) {}

    private toVoucherEntity(voucher: any): Voucher {
        return new Voucher(voucher)
    }

    private generateVoucherCode(length = 8): string {
        return randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .toUpperCase()
            .slice(0, length)
    }

    async create(
        createVoucherInput: CreateVoucherInput,
        currentUser: UserEntity
    ): Promise<Voucher> {
        // Check if code already exists
        const existingVoucher = await this.prisma.voucher.findUnique({
            where: { code: createVoucherInput.code }
        })

        if (existingVoucher) {
            throw new ConflictException(
                `Voucher with code ${createVoucherInput.code} already exists`
            )
        }

        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: createVoucherInput.userId }
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${createVoucherInput.userId} not found`)
        }

        const voucher = await this.prisma.voucher.create({
            data: {
                ...createVoucherInput,
                startDate: new Date(createVoucherInput.startDate),
                endDate: new Date(createVoucherInput.endDate)
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async createVoucherForUser(
        createVoucherInput: CreateVoucherForUserInput,
        currentUser: UserEntity
    ): Promise<Voucher> {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: createVoucherInput.userId }
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${createVoucherInput.userId} not found`)
        }

        // Generate code if not provided
        const code = createVoucherInput.code || this.generateVoucherCode()

        // Check if code already exists
        const existingVoucher = await this.prisma.voucher.findUnique({
            where: { code }
        })

        if (existingVoucher) {
            // If code was auto-generated, try again
            if (!createVoucherInput.code) {
                return this.createVoucherForUser(createVoucherInput, currentUser)
            }
            throw new ConflictException(`Voucher with code ${code} already exists`)
        }

        const voucher = await this.prisma.voucher.create({
            data: {
                ...createVoucherInput,
                code,
                startDate: new Date(createVoucherInput.startDate),
                endDate: new Date(createVoucherInput.endDate)
            }
        })

        return this.toVoucherEntity(voucher)
    }

    async findAll(): Promise<Voucher[]> {
        const vouchers = await this.prisma.voucher.findMany({
            where: { isDeleted: false },
            include: { user: true },
            orderBy: { createdAt: "desc" }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getUserVouchers(getUserVouchersInput: GetUserVouchersInput): Promise<Voucher[]> {
        const { userId, activeOnly = true } = getUserVouchersInput

        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`)
        }

        const now = new Date()
        const where: any = {
            userId,
            isDeleted: false
        }

        // Only include active and valid vouchers if requested
        if (activeOnly) {
            where.isActive = true
            where.usedAt = null
            where.startDate = { lte: now }
            where.endDate = { gte: now }
        }

        const vouchers = await this.prisma.voucher.findMany({
            where,
            include: { user: true },
            orderBy: { createdAt: "desc" }
        })

        return vouchers.map((voucher) => this.toVoucherEntity(voucher))
    }

    async getMyVouchers(userId: string): Promise<Voucher[]> {
        return this.getUserVouchers({ userId, activeOnly: true })
    }

    async findOne(id: string): Promise<Voucher> {
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, isDeleted: false },
            include: { user: true }
        })

        if (!voucher) {
            throw new NotFoundException(`Voucher with ID ${id} not found`)
        }

        return this.toVoucherEntity(voucher)
    }

    async update(
        id: string,
        updateVoucherInput: UpdateVoucherInput,
        currentUser: UserEntity
    ): Promise<Voucher> {
        // Check if voucher exists
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, isDeleted: false }
        })

        if (!voucher) {
            throw new NotFoundException(`Voucher with ID ${id} not found`)
        }

        // If code is changing, check if the new code already exists
        if (updateVoucherInput.code && updateVoucherInput.code !== voucher.code) {
            const existingVoucher = await this.prisma.voucher.findUnique({
                where: { code: updateVoucherInput.code }
            })

            if (existingVoucher && existingVoucher.id !== id) {
                throw new ConflictException(
                    `Voucher with code ${updateVoucherInput.code} already exists`
                )
            }
        }

        const updatedVoucher = await this.prisma.voucher.update({
            where: { id },
            data: {
                ...updateVoucherInput,
                startDate: updateVoucherInput.startDate
                    ? new Date(updateVoucherInput.startDate)
                    : undefined,
                endDate: updateVoucherInput.endDate
                    ? new Date(updateVoucherInput.endDate)
                    : undefined,
                updatedAt: new Date()
            },
            include: { user: true }
        })

        return this.toVoucherEntity(updatedVoucher)
    }

    async remove(id: string, currentUser: UserEntity): Promise<Voucher> {
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, isDeleted: false }
        })

        if (!voucher) {
            throw new NotFoundException(`Voucher with ID ${id} not found`)
        }

        const deletedVoucher = await this.prisma.voucher.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false
            },
            include: { user: true }
        })

        return this.toVoucherEntity(deletedVoucher)
    }
}
