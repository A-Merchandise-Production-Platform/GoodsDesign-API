import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto, UpdateUserDto } from "./dto"
import { Roles } from "@prisma/client"
import { UserFilter } from "./models/user.model"
import { getRolesBelowOrEqual } from "../utils/role.utils"
import { UserEntity } from "./entities/users.entity"

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private toUserEntity(user: any): UserEntity {
        return new UserEntity(user)
    }

    async create(createUserDto: CreateUserDto, currentUser: UserEntity): Promise<UserEntity> {
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                isActive: true,
                createdBy: currentUser.id,
                dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null
            }
        })
        return this.toUserEntity(user)
    }

    async findAll(user: UserEntity, filter?: UserFilter) {
        const where: any = { isDeleted: false }
        const allowedRoles = getRolesBelowOrEqual(user.role)

        // Role hierarchy filtering
        if (user) {
            where.role = {
                in: allowedRoles
            }
        }

        if (filter) {
            if (filter.email) {
                where.email = { contains: filter.email, mode: "insensitive" }
            }
            if (filter.role) {
                if (!allowedRoles.includes(filter.role)) {
                    throw new ForbiddenException("You are not authorized to access this resource")
                }
                where.role = filter.role
            }
            if (filter.isActive !== undefined) {
                where.isActive = filter.isActive
            }
        }

        // Handle sorting
        const orderBy: any[] = []
        if (filter?.sort) {
            const sortFields = Object.entries(filter.sort)
            for (const [field, order] of sortFields) {
                if (order) {
                    orderBy.push({ [field]: order.toLowerCase() })
                }
            }
        }

        // Handle pagination
        const page = filter?.pagination?.page || 1
        const limit = filter?.pagination?.limit || 10
        const skip = (page - 1) * limit

        // Get total count for pagination
        const total = await this.prisma.user.count({ where })

        // Get paginated data
        const users = await this.prisma.user.findMany({
            where,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
            skip,
            take: limit
        })

        return {
            items: users.map((user) => this.toUserEntity(user)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async findOne(id: string, currentUser: UserEntity): Promise<UserEntity> {
        const user = await this.prisma.user.findFirst({
            where: { id, isDeleted: false }
        })

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        // Check if current user has permission to view this user
        const allowedRoles = getRolesBelowOrEqual(currentUser.role)
        if (!allowedRoles.includes(user.role)) {
            throw new ForbiddenException("You are not authorized to access this resource")
        }

        return this.toUserEntity(user)
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        currentUser: UserEntity
    ): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        if (!user || user.isDeleted) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                dateOfBirth: updateUserDto.dateOfBirth
                    ? new Date(updateUserDto.dateOfBirth)
                    : undefined,
                updatedAt: new Date(),
                updatedBy: currentUser.id
            }
        })

        return this.toUserEntity(updatedUser)
    }

    async remove(id: string, currentUser: UserEntity): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        if (!user || user.isDeleted) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        const deletedUser = await this.prisma.user.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: currentUser.id
            }
        })

        return this.toUserEntity(deletedUser)
    }

    async getUserAnalytics(currentUser: UserEntity) {
        const allowedRoles = getRolesBelowOrEqual(currentUser.role)

        // Basic stats
        const [totalUsers, activeUsers, newUsersLast30Days] = await Promise.all([
            // Total users
            this.prisma.user.count({
                where: {
                    isDeleted: false,
                    role: { in: allowedRoles }
                }
            }),
            // Active users
            this.prisma.user.count({
                where: {
                    isDeleted: false,
                    isActive: true,
                    role: { in: allowedRoles }
                }
            }),
            // New users in last 30 days
            this.prisma.user.count({
                where: {
                    isDeleted: false,
                    role: { in: allowedRoles },
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ])

        // Monthly growth for last 12 months
        const last12Months = await this.prisma.user.findMany({
            where: {
                isDeleted: false,
                role: { in: allowedRoles },
                createdAt: {
                    gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
                }
            },
            select: {
                createdAt: true
            }
        })

        const monthlyGrowth = this.calculateMonthlyGrowth(last12Months)

        // Role distribution
        const roleDistribution = await this.prisma.user.groupBy({
            by: ["role"],
            where: {
                isDeleted: false,
                role: { in: allowedRoles }
            },
            _count: {
                role: true
            }
        })

        return {
            stats: {
                totalUsers,
                activeUsers,
                newUsersLast30Days
            },
            monthlyGrowth,
            roleDistribution: roleDistribution.map((item) => ({
                role: item.role,
                count: item._count.role
            }))
        }
    }

    private calculateMonthlyGrowth(
        users: { createdAt: Date }[]
    ): { month: string; users: number }[] {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]
        const currentDate = new Date()
        const monthlyData = new Map<string, number>()

        // Initialize all months with 0
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
            monthlyData.set(monthKey, 0)
        }

        // Count users per month
        users.forEach((user) => {
            const date = new Date(user.createdAt)
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
            if (monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, monthlyData.get(monthKey)! + 1)
            }
        })

        return Array.from(monthlyData.entries()).map(([month, users]) => ({
            month,
            users
        }))
    }
}
