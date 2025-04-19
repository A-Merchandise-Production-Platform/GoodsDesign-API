import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { UserBank } from "@prisma/client"
import { CreateUserBankInput } from "./dto/create-user-bank.input"
import { UpdateUserBankInput } from "./dto/update-user-bank.input"
import { UserBankEntity } from "./entities/user-bank.entity"
import { PrismaService } from "src/prisma"
import { UserEntity } from "src/users"
import { SystemConfigBankEntity } from "src/system-config-bank/entities/system-config-bank.entity"

@Injectable()
export class UserBanksService {
    constructor(private readonly prisma: PrismaService) {}

    private validateUser(user: UserEntity) {
        if (!user) {
            throw new UnauthorizedException("User not found")
        }
    }

    private transformUserBank(
            userBank: UserBank
        ) {
        return new UserBankEntity(userBank)
    }

    private getUserBankInclude() {
        return {
            user: true,
            bank: true
        }
    }

    async createUserBank(createUserBankInput: CreateUserBankInput, user: UserEntity) {
        this.validateUser(user)

        // If this is the first bank account or isDefault is true, set it as default
        const existingBanks = await this.prisma.userBank.findMany({
            where: { userId: user.id }
        })

        const isDefault = createUserBankInput.isDefault || existingBanks.length === 0

        // If setting this as default, unset any existing default
        if (isDefault) {
            await this.prisma.userBank.updateMany({
                where: { 
                    userId: user.id,
                    isDefault: true
                },
                data: { isDefault: false }
            })
        }

        const userBank = await this.prisma.userBank.create({
            data: {
                ...createUserBankInput,
                userId: user.id,
                isDefault
            },
            include: this.getUserBankInclude()
        })

        return this.transformUserBank(userBank)
    }

    async getUserBanks(user: UserEntity) {
        this.validateUser(user)

        const userBanks = await this.prisma.userBank.findMany({
            where: { userId: user.id },
            include: this.getUserBankInclude()
        })

        return userBanks.map(userBank => this.transformUserBank(userBank))
    }

    async getUserBank(id: string, user: UserEntity) {
        this.validateUser(user)

        const userBank = await this.prisma.userBank.findFirst({
            where: { id, userId: user.id },
            include: this.getUserBankInclude()
        })

        if (!userBank) {
            throw new NotFoundException(`User bank with ID ${id} not found`)
        }

        return this.transformUserBank(userBank)
    }

    async updateUserBank(id: string, updateUserBankInput: UpdateUserBankInput, user: UserEntity) {
        this.validateUser(user)

        // Check if the bank account exists and belongs to the user
        const existingBank = await this.prisma.userBank.findFirst({
            where: { id, userId: user.id }
        })

        if (!existingBank) {
            throw new NotFoundException(`User bank with ID ${id} not found`)
        }

        // If setting this as default, unset any existing default
        if (updateUserBankInput.isDefault) {
            await this.prisma.userBank.updateMany({
                where: { 
                    userId: user.id,
                    isDefault: true,
                    id: { not: id }
                },
                data: { isDefault: false }
            })
        }

        const userBank = await this.prisma.userBank.update({
            where: { id },
            data: updateUserBankInput,
            include: this.getUserBankInclude()
        })

        return this.transformUserBank(userBank)
    }

    async deleteUserBank(id: string, user: UserEntity) {
        this.validateUser(user)

        // Check if the bank account exists and belongs to the user
        const existingBank = await this.prisma.userBank.findFirst({
            where: { id, userId: user.id }
        })

        if (!existingBank) {
            throw new NotFoundException(`User bank with ID ${id} not found`)
        }

        // If this was the default bank, set another bank as default if available
        if (existingBank.isDefault) {
            const otherBanks = await this.prisma.userBank.findMany({
                where: { 
                    userId: user.id,
                    id: { not: id }
                },
                take: 1
            })

            if (otherBanks.length > 0) {
                await this.prisma.userBank.update({
                    where: { id: otherBanks[0].id },
                    data: { isDefault: true }
                })
            }
        }

        const userBank = await this.prisma.userBank.delete({
            where: { id },
            include: this.getUserBankInclude()
        })

        return this.transformUserBank(userBank)
    }
} 