import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException
} from "@nestjs/common"
import { FactoryStatus, OrderStatus, Roles } from "@prisma/client"
import { AddressesService } from "src/addresses/addresses.service"
import { AddressEntity } from "src/addresses/entities/address.entity"
import { UpdateFactoryStatusDto } from "src/factory/dto/update-factory-status"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { NotificationsService } from "src/notifications/notifications.service"
import { UserEntity } from "src/users/entities/users.entity"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto"
import { FactoryProductEntity } from "src/factory-products/entities/factory-product.entity"
import { FactoryProductsService } from "src/factory-products/factory-products.service"
import { MAIL_CONSTANT, MailService } from "src/mail"

@Injectable()
export class FactoryService {
    private logger = new Logger(FactoryService.name)

    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private addressesService: AddressesService,
        private factoryProductsService: FactoryProductsService,
        private mailService: MailService
    ) {}

    async getAllFactories() {
        const factories = await this.prisma.factory.findMany({
            include: {
                address: true,
                products: true,
                orders: true,
                owner: true,
                staff: true
            }
        })

        console.log(factories)

        return factories.map((factory) => new FactoryEntity(factory))
    }

    async updateFactoryInfo(userId: string, dto: UpdateFactoryInfoDto) {
        // First, check if the user is a factory owner
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { ownedFactory: true }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        if (user.role !== Roles.FACTORYOWNER) {
            throw new ForbiddenException("Only factory owners can update factory information")
        }

        if (userId !== user.ownedFactory.factoryOwnerId) {
            throw new ForbiddenException("You are not allowed to update this factory")
        }

        // Check if the factory already exists for this user
        const existingFactory = user.ownedFactory

        // Check if the factory is in a state that allows updates
        if (existingFactory && existingFactory.factoryStatus === "SUSPENDED") {
            throw new BadRequestException(
                "Factory information cannot be updated while in PENDING_APPROVAL or SUSPENDED status"
            )
        }

        // Check if the factory is already submitted for approval
        if (existingFactory && existingFactory.isSubmitted) {
            throw new BadRequestException(
                "Factory information has already been submitted for approval and cannot be updated"
            )
        }

        // Set isSubmitted to true if submit flag is provided
        const isSubmitted = true

        let address: AddressEntity

        if (existingFactory.addressId) {
            address = await this.addressesService.updateAddress(
                existingFactory.addressId,
                dto.addressInput,
                new UserEntity({ ...user, ownedFactory: null })
            )
        } else {
            address = await this.addressesService.createAddress(
                dto.addressInput,
                new UserEntity({ ...user, ownedFactory: null })
            )
        }

        // Update or create factory information
        const updatedFactory = await this.prisma.factory.upsert({
            where: {
                factoryOwnerId: userId
            },
            update: {
                name: dto.name,
                description: dto.description,
                businessLicenseUrl: dto.businessLicenseUrl,
                taxIdentificationNumber: dto.taxIdentificationNumber,
                addressId: address.id,
                website: dto.website,
                establishedDate: dto.establishedDate,
                totalEmployees: dto.totalEmployees,
                maxPrintingCapacity: dto.maxPrintingCapacity,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods,
                specializations: dto.specializations,
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                operationalHours: dto.operationalHours,
                leadTime: dto.leadTime,
                minimumOrderQuantity: dto.minimumOrderQuantity,
                isSubmitted: isSubmitted,
                factoryStatus: "PENDING_APPROVAL"
            },
            create: {
                factoryOwnerId: userId,
                name: dto.name || "New Factory",
                description: dto.description,
                businessLicenseUrl: dto.businessLicenseUrl,
                taxIdentificationNumber: dto.taxIdentificationNumber,
                addressId: address.id,
                website: dto.website,
                establishedDate: dto.establishedDate || new Date(),
                totalEmployees: dto.totalEmployees || 0,
                maxPrintingCapacity: dto.maxPrintingCapacity || 0,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods || [],
                specializations: dto.specializations || [],
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                operationalHours: dto.operationalHours || "9AM-5PM",
                leadTime: dto.leadTime,
                minimumOrderQuantity: dto.minimumOrderQuantity || 0,
                isSubmitted: isSubmitted,
                factoryStatus: "PENDING_APPROVAL"
            },
            include: {
                address: true,
                products: true,
                orders: true,
                staff: true,
                owner: true
            }
        })

        // Handle system config variants if provided
        if (dto.systemConfigVariantIds && dto.systemConfigVariantIds.length > 0) {
            // Get existing factory products
            const existingProducts = await this.prisma.factoryProduct.findMany({
                where: {
                    factoryId: userId
                }
            })

            // Create new factory products for new variants
            for (const variantId of dto.systemConfigVariantIds) {
                if (!existingProducts.some((p) => p.systemConfigVariantId === variantId)) {
                    await this.factoryProductsService.create({
                        factoryId: userId,
                        systemConfigVariantId: variantId,
                        productionCapacity: updatedFactory.maxPrintingCapacity,
                        productionTimeInMinutes: updatedFactory.leadTime || 1
                    })
                }
            }

            // Remove factory products for variants that are no longer selected
            const variantsToRemove = existingProducts.filter(
                (p) => !dto.systemConfigVariantIds.includes(p.systemConfigVariantId)
            )

            for (const product of variantsToRemove) {
                await this.factoryProductsService.delete(
                    product.factoryId,
                    product.systemConfigVariantId
                )
            }
        }

        await this.notificationsService.create({
            title: "Factory Information Updated",
            content:
                "Your factory information has been updated and is pending approval, please wait for approval",
            userId: userId
        })

        return new FactoryEntity({
            ...updatedFactory,
            address: updatedFactory?.address
                ? new AddressEntity({
                      ...updatedFactory.address,
                      id: updatedFactory.address.id
                  })
                : null,
            products: updatedFactory.products
                ? updatedFactory.products.map(
                      (product) =>
                          new FactoryProductEntity({
                              ...product,
                              factoryId: updatedFactory.factoryOwnerId,
                              systemConfigVariantId: product.systemConfigVariantId
                          })
                  )
                : [],
            owner: new UserEntity({
                ...updatedFactory.owner,
                id: updatedFactory.owner.id
            }),
            staff: updatedFactory.staff
                ? new UserEntity({
                      ...updatedFactory.staff,
                      id: updatedFactory.staff.id
                  })
                : null
        })
    }

    async getFactoryById(factoryId: string) {
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: factoryId },
            include: {
                address: true,
                products: {
                    include: {
                        systemConfigVariant: true
                    }
                },
                orders: true,
                owner: true,
                staff: true
            }
        })

        if (!factory) {
            throw new NotFoundException("Factory not found")
        }

        return new FactoryEntity(factory)
    }

    async getMyFactory(userId: string) {
        if (!userId) {
            throw new BadRequestException("User ID is required")
        }

        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: userId },
            include: {
                address: true,
                products: true,
                orders: true,
                owner: true,
                staff: true
            }
        })

        if (!factory) return null

        return new FactoryEntity({
            ...factory,
            address: factory?.address
                ? new AddressEntity({
                      ...factory.address,
                      id: factory?.address?.id
                  })
                : null,
            products: factory?.products
                ? factory.products.map(
                      (product) =>
                          new FactoryProductEntity({
                              ...product,
                              factoryId: factory.factoryOwnerId,
                              systemConfigVariantId: product.systemConfigVariantId
                          })
                  )
                : [],
            owner: new UserEntity({
                ...factory.owner,
                id: factory.owner.id
            }),
            staff: factory?.staff
                ? new UserEntity({
                      ...factory.staff,
                      id: factory.staff.id
                  })
                : null
        })
    }

    private getMessageForFactoryStatusChange(status: FactoryStatus) {
        switch (status) {
            case FactoryStatus.APPROVED:
                return "Your factory has been approved and is now active"
            case FactoryStatus.SUSPENDED:
                return "Your factory has been suspended and is no longer active"
            case FactoryStatus.REJECTED:
                return "Your factory has been rejected by system"
        }
    }

    async changeFactoryStatus(dto: UpdateFactoryStatusDto, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to change factory status")
        }

        const factory = await this.prisma.factory.update({
            where: { factoryOwnerId: dto.factoryOwnerId },
            data: { factoryStatus: dto.status },
            include: { owner: true }
        })

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: this.getMessageForFactoryStatusChange(dto.status),
            userId: dto.factoryOwnerId
        })

        await this.assignStaffToFactory(dto.factoryOwnerId, dto.staffId, user)

        this.mailService.sendSingleEmail({
            from: MAIL_CONSTANT.FROM_EMAIL,
            to: factory.owner.email,
            subject: "Factory Status Changed",
            html: this.getMessageForFactoryStatusChange(dto.status)
        })

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: `Your factory status has been changed to ${dto.status}`,
            userId: factory.owner.id
        })

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: `You have been assigned to a factory ${factory.name}`,
            userId: dto.staffId
        })

        return new FactoryEntity(factory)
    }

    async assignStaffToFactory(factoryId: string, staffId: string, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to assign staff to factory")
        }

        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: factoryId },
            include: { owner: true, staff: true }
        })

        if (!factory) {
            throw new NotFoundException("Factory not found")
        }

        const staff = await this.prisma.user.findUnique({
            where: { id: staffId, role: Roles.STAFF },
            include: { staffedFactory: true }
        })

        if (!staff) {
            throw new NotFoundException("Staff not found")
        }

        if (staff.staffedFactory) {
            throw new BadRequestException("Staff already assigned to a factory")
        }

        await this.prisma.factory.update({
            where: { factoryOwnerId: factoryId },
            data: {
                staffId: staffId
            }
        })

        return new FactoryEntity({
            ...factory,
            owner: new UserEntity({
                ...factory.owner,
                id: factory.owner.id
            }),
            staff: new UserEntity(factory.staff)
        })
    }
}
