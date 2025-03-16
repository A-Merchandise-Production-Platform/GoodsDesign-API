import { Test, TestingModule } from "@nestjs/testing"
import { UsersService } from "./users.service"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto, UpdateUserDto } from "./dto"
import { NotFoundException } from "@nestjs/common"
import { Roles } from "@prisma/client"
import { UserEntity } from "./entities/users.entity"

describe("UsersService", () => {
    let service: UsersService
    let prismaService: PrismaService

    const mockDate = new Date()
    const mockUser = {
        id: "1",
        name: "John Doe",
        email: "test@example.com",
        password: "hashedPassword123",
        gender: false,
        dateOfBirth: new Date("1990-01-01"),
        imageUrl: "http://example.com/image.jpg",
        isActive: true,
        isDeleted: false,
        createdAt: mockDate,
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        role: Roles.CUSTOMER
    }

    const mockUserEntity = new UserEntity({
        ...mockUser,
        dateOfBirth: mockUser.dateOfBirth
    })
    const mockCurrentUser = new UserEntity({
        ...mockUser,
        dateOfBirth: mockUser.dateOfBirth
    })

    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            count: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                }
            ]
        }).compile()

        service = module.get<UsersService>(UsersService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("create", () => {
        const createUserDto: CreateUserDto = {
            name: "John Doe",
            email: "test@example.com",
            password: "password123",
            gender: false,
            dateOfBirth: "1990-01-01",
            role: Roles.CUSTOMER
        }

        it("should create a new user", async () => {
            mockPrismaService.user.create.mockResolvedValue({
                ...mockUser,
                dateOfBirth: new Date(createUserDto.dateOfBirth)
            })
            const result = await service.create(createUserDto, mockCurrentUser)
            expect(result).toEqual(mockUserEntity)
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    ...createUserDto,
                    isActive: true,
                    createdBy: mockCurrentUser.id,
                    dateOfBirth: new Date(createUserDto.dateOfBirth)
                }
            })
        })
    })

    describe("findAll", () => {
        it("should return an array of active users", async () => {
            mockPrismaService.user.count.mockResolvedValue(1)
            mockPrismaService.user.findMany.mockResolvedValue([mockUser])
            const result = await service.findAll(mockCurrentUser)
            expect(result.items).toEqual([mockUserEntity])
            expect(prismaService.user.findMany).toHaveBeenCalledWith({
                where: {
                    isDeleted: false,
                    role: {
                        in: [Roles.CUSTOMER]
                    }
                },
                orderBy: undefined,
                skip: 0,
                take: 10
            })
        })
    })

    describe("findOne", () => {
        it("should return an active user", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser)
            const result = await service.findOne("1", mockCurrentUser)
            expect(result).toEqual(mockUserEntity)
            expect(prismaService.user.findFirst).toHaveBeenCalledWith({
                where: { id: "1", isDeleted: false }
            })
        })

        it("should throw NotFoundException when user not found", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(null)
            await expect(service.findOne("1", mockCurrentUser)).rejects.toThrow(
                new NotFoundException("User with ID 1 not found")
            )
        })

        it("should throw NotFoundException when user is deleted", async () => {
            const deletedUser = { ...mockUser, isDeleted: true }
            mockPrismaService.user.findFirst.mockResolvedValue(deletedUser)
            await expect(service.findOne("1", mockCurrentUser)).rejects.toThrow(
                new NotFoundException("User with ID 1 not found")
            )
        })
    })

    describe("update", () => {
        const updateUserDto: UpdateUserDto = {
            name: "Updated Name"
        }

        it("should update a user", async () => {
            const updatedUser = {
                ...mockUser,
                ...updateUserDto,
                dateOfBirth: mockUser.dateOfBirth
            }
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
            mockPrismaService.user.update.mockResolvedValue(updatedUser)

            const result = await service.update("1", updateUserDto, mockCurrentUser)
            expect(result).toEqual(new UserEntity(updatedUser))
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: {
                    ...updateUserDto,
                    updatedAt: expect.any(Date),
                    updatedBy: mockCurrentUser.id
                }
            })
        })
    })

    describe("remove", () => {
        it("should soft delete a user", async () => {
            const deletedUser = {
                ...mockUser,
                isDeleted: true,
                deletedAt: new Date(),
                dateOfBirth: mockUser.dateOfBirth
            }
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
            mockPrismaService.user.update.mockResolvedValue(deletedUser)

            const result = await service.remove("1", mockCurrentUser)
            expect(result).toEqual(new UserEntity(deletedUser))
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: {
                    isDeleted: true,
                    deletedAt: expect.any(Date),
                    deletedBy: mockCurrentUser.id
                }
            })
        })
    })
})
