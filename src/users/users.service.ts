import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { getRolesBelowOrEqual } from "../utils/role.utils"
import { CreateUserDto, UpdateUserDto } from "./dto"
import { UserEntity } from "./entities/users.entity"
import { Roles } from "@prisma/client"
import { UpdateProfileDto } from "src/users/dto/update-profile.dto"
import { UpdatePhoneNumberDto } from "src/users/dto/update-phone-number.dto"

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private toUserEntity(user: any): UserEntity {
        return new UserEntity(user)
    }

    async create(createUserDto: CreateUserDto, currentUser: UserEntity): Promise<UserEntity> {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: createUserDto.email }, { phoneNumber: createUserDto.phoneNumber }]
            }
        })

        if (existingUser) {
            throw new ConflictException("User already exists with this email or phone number    ")
        }

        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                imageUrl:
                    createUserDto.imageUrl ||
                    `https://api.dicebear.com/9.x/thumbs/svg?seed=${createUserDto.name}`,
                isActive: true,
                createdBy: currentUser.id,
                dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null
            }
        })
        return this.toUserEntity(user)
    }

    async findAll(user: UserEntity) {
        const where: any = { isDeleted: false }
        const allowedRoles = getRolesBelowOrEqual(user.role)

        // Role hierarchy filtering
        if (user) {
            where.role = {
                in: allowedRoles
            }
        }
        const users = await this.prisma.user.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            }
        })

        return users.map((user) => this.toUserEntity(user))
    }

    async findAllStaff(user: UserEntity) {
        if (!user || user.role !== "MANAGER") {
            throw new ForbiddenException("You are not authorized to access this resource")
        }

        const users = await this.prisma.user.findMany({
            where: {
                role: {
                    in: ["STAFF", "ADMIN"]
                },
                isActive: true,
                isDeleted: false
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return users.map((user) => this.toUserEntity(user))
    }

    async findOne(id: string, currentUser: UserEntity): Promise<UserEntity> {
        const user = await this.prisma.user.findFirst({
            where: { id, isDeleted: false },
            include: {
                staffedFactory: true,
                ownedFactory: true
            }
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

    async getAvailableStaffForFactory(user: UserEntity) {
        if (!user || (user.role !== Roles.MANAGER && user.role !== Roles.ADMIN)) {
            throw new ForbiddenException("You are not authorized to access this resource")
        }

        const staff = await this.prisma.user.findMany({
            where: {
                role: Roles.STAFF,
                isActive: true,
                isDeleted: false,
                staffedFactory: null
            }
        })

        return staff.map((staff) => this.toUserEntity(staff))
    }

    async updateProfile(id: string, updateProfileDto: UpdateProfileDto, currentUser: UserEntity) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        if (id !== currentUser.id) {
            throw new ForbiddenException("You are not authorized to update this profile")
        }

        if (!user || user.isDeleted) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateProfileDto,
                dateOfBirth: updateProfileDto.dateOfBirth
                    ? new Date(updateProfileDto.dateOfBirth)
                    : null,
                updatedAt: new Date(),
                updatedBy: currentUser.id
            }
        })

        return this.toUserEntity(updatedUser)
    }

    async updatePhoneNumber(
        id: string,
        updatePhoneNumberDto: UpdatePhoneNumberDto,
        currentUser: UserEntity
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        if (!user || user.isDeleted) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                phoneNumber: updatePhoneNumberDto.phoneNumber,
                updatedAt: new Date(),
                updatedBy: currentUser.id
            }
        })

        return this.toUserEntity(updatedUser)
    }
}
