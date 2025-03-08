import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./dto"
import { User, Roles } from "@prisma/client"
import { UserFilter } from "./models/user.model"
import { getRolesBelowOrEqual } from "../utils/role.utils"

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private toUserResponse(user: User): UserResponseDto {
        return new UserResponseDto(user)
    }

    async create(createUserDto: CreateUserDto, currentUser: User): Promise<UserResponseDto> {
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                isActive: true,
                createdBy: currentUser.id,
                dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null
            }
        })
        return this.toUserResponse(user)
    }

    async findAll(user: User, filter?: UserFilter) {
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
            items: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async findOne(id: string, currentUser: User): Promise<UserResponseDto> {
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

        return this.toUserResponse(user)
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        currentUser: User
    ): Promise<UserResponseDto> {
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

        return this.toUserResponse(updatedUser)
    }

    async remove(id: string, currentUser: User): Promise<UserResponseDto> {
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

        return this.toUserResponse(deletedUser)
    }
}
