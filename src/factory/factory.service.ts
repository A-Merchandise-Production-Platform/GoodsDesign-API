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
        private factoryProductsService: FactoryProductsService,
        private mailService: MailService,
        private addressesService: AddressesService
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

        if (!factories) {
            throw new NotFoundException("No factories found")
        }

        return factories.map((factory) => {
            return new FactoryEntity({
                ...factory
            })
        })
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

        // Generate formatted address
        let formattedAddress = null
        try {
            const formatResult = await this.addressesService.formatAddress({
                provinceID: dto.addressInput.provinceID,
                districtID: dto.addressInput.districtID,
                wardCode: dto.addressInput.wardCode,
                street: dto.addressInput.street
            })
            formattedAddress = formatResult.text
        } catch (error) {
            this.logger.error(`Failed to format address for factory ${userId}: ${error.message}`)
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
                maxPrintingCapacity: dto.maxPrintingCapacity,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods,
                specializations: dto.specializations,
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                leadTime: dto.leadTime,
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
                maxPrintingCapacity: dto.maxPrintingCapacity || 0,
                qualityCertifications: dto.qualityCertifications,
                printingMethods: dto.printingMethods || [],
                specializations: dto.specializations || [],
                contactPersonName: dto.contactPersonName,
                contactPersonRole: dto.contactPersonRole,
                contactPhone: dto.contactPersonPhone,
                leadTime: dto.leadTime,
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
                        productionTimeInMinutes: dto.productionTimeInMinutes
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

        // Notify the factory owner
        await this.notificationsService.create({
            title: "Factory Information Updated",
            content:
                "Your factory information has been updated and is pending approval, please wait for approval",
            userId: userId
        })

        // Check if this is a new factory registration (not just an update)
        const isNewFactoryRegistration = !existingFactory || !existingFactory.isSubmitted

        // Notify all managers about the new factory registration if it's a new factory
        if (isNewFactoryRegistration) {
            // Get all managers
            const managers = await this.prisma.user.findMany({
                where: {
                    role: Roles.MANAGER
                }
            })

            // Send notification to each manager
            for (const manager of managers) {
                await this.notificationsService.create({
                    title: "New Factory Registration",
                    content: `A new factory "${updatedFactory.name}" has registered and is waiting for approval`,
                    userId: manager.id
                })
            }

            // Also send notifications to admins
            const admins = await this.prisma.user.findMany({
                where: {
                    role: Roles.ADMIN
                }
            })

            for (const admin of admins) {
                await this.notificationsService.create({
                    title: "New Factory Registration",
                    content: `A new factory "${updatedFactory.name}" has registered and is waiting for approval`,
                    userId: admin.id
                })
            }
        }

        return new FactoryEntity({
            ...updatedFactory,
            formattedAddress,
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
            throw new NotFoundException(`Factory with ID ${factoryId} not found`)
        }

        let formattedAddress = null
        if (factory.address) {
            try {
                const formatResult = await this.addressesService.formatAddress({
                    provinceID: factory.address.provinceID,
                    districtID: factory.address.districtID,
                    wardCode: factory.address.wardCode,
                    street: factory.address.street
                })
                formattedAddress = formatResult.text
            } catch (error) {
                this.logger.error(
                    `Failed to format address for factory ${factoryId}: ${error.message}`
                )
            }
        }

        return new FactoryEntity({
            ...factory,
            formattedAddress
        })
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

        let formattedAddress = null
        if (factory.address) {
            try {
                const formatResult = await this.addressesService.formatAddress({
                    provinceID: factory.address.provinceID,
                    districtID: factory.address.districtID,
                    wardCode: factory.address.wardCode,
                    street: factory.address.street
                })
                formattedAddress = formatResult.text
            } catch (error) {
                this.logger.error(
                    `Failed to format address for factory ${userId}: ${error.message}`
                )
            }
        }

        return new FactoryEntity({
            ...factory,
            formattedAddress,
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

    private getMessageForFactoryStatusChange(status: FactoryStatus, statusNote: string) {
        switch (status) {
            case FactoryStatus.APPROVED:
                return `Your factory has been approved and is now active. ${statusNote}`
            case FactoryStatus.SUSPENDED:
                return `Your factory has been suspended and is no longer active. ${statusNote}`
            case FactoryStatus.REJECTED:
                return `Your factory has been rejected. Please update your factory information and resubmit for approval. ${statusNote}`
        }
    }

    async changeFactoryStatus(dto: UpdateFactoryStatusDto, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to change factory status")
        }

        const factory = await this.prisma.factory.update({
            where: { factoryOwnerId: dto.factoryOwnerId },
            data: {
                factoryStatus: dto.status,
                // If status is REJECTED, set isSubmitted to false so factory owner can update info
                isSubmitted: dto.status === FactoryStatus.REJECTED ? false : undefined,
                statusNote: dto.statusNote
            },
            include: {
                owner: true,
                address: true
            }
        })

        // Generate formatted address if available
        let formattedAddress = null
        if (factory.address) {
            try {
                const formatResult = await this.addressesService.formatAddress({
                    provinceID: factory.address.provinceID,
                    districtID: factory.address.districtID,
                    wardCode: factory.address.wardCode,
                    street: factory.address.street
                })
                formattedAddress = formatResult.text
            } catch (error) {
                this.logger.error(
                    `Failed to format address for factory ${dto.factoryOwnerId}: ${error.message}`
                )
            }
        }

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: this.getMessageForFactoryStatusChange(dto.status, dto.statusNote),
            userId: dto.factoryOwnerId
        })

        // Only assign staff if status is not REJECTED
        if (dto.status !== FactoryStatus.REJECTED && dto.staffId) {
            await this.assignStaffToFactory(dto.factoryOwnerId, dto.staffId, user)
        }

        this.mailService.sendSingleEmail({
            from: MAIL_CONSTANT.FROM_EMAIL,
            to: factory.owner.email,
            subject: "Factory Status Changed",
            html: this.getMessageForFactoryStatusChange(dto.status, dto.statusNote)
        })

        await this.notificationsService.create({
            title: "Factory Status Changed",
            content: this.getMessageForFactoryStatusChange(dto.status, dto.statusNote),
            userId: factory.owner.id
        })

        // Only send staff notification if status is not REJECTED and staffId exists
        if (dto.status !== FactoryStatus.REJECTED && dto.staffId) {
            await this.notificationsService.create({
                title: "Factory Status Changed",
                content: `You have been assigned to a factory ${factory.name}`,
                userId: dto.staffId
            })
        }

        return new FactoryEntity({
            ...factory,
            formattedAddress
        })
    }

    async assignStaffToFactory(factoryId: string, staffId: string, user: UserEntity) {
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to assign staff to factory")
        }

        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: factoryId },
            include: { owner: true, staff: true, address: true }
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

        // Generate formatted address if available
        let formattedAddress = null
        if (factory.address) {
            try {
                const formatResult = await this.addressesService.formatAddress({
                    provinceID: factory.address.provinceID,
                    districtID: factory.address.districtID,
                    wardCode: factory.address.wardCode,
                    street: factory.address.street
                })
                formattedAddress = formatResult.text
            } catch (error) {
                this.logger.error(
                    `Failed to format address for factory ${factoryId}: ${error.message}`
                )
            }
        }

        return new FactoryEntity({
            ...factory,
            formattedAddress,
            owner: new UserEntity({
                ...factory.owner,
                id: factory.owner.id
            }),
            staff: new UserEntity(factory.staff)
        })
    }

    async changeFactoryStaff(factoryId: string, newStaffId: string, user: UserEntity) {
        // Check if the user has permission to change factory staff
        if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER)) {
            throw new ForbiddenException("You are not allowed to change factory staff")
        }

        // Check if the factory exists
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: factoryId },
            include: { owner: true, staff: true, address: true }
        })

        if (!factory) {
            throw new NotFoundException(`Factory with ID ${factoryId} not found`)
        }

        // Check if the new staff exists, is actually a staff member, and is active
        const newStaff = await this.prisma.user.findUnique({
            where: {
                id: newStaffId,
                role: Roles.STAFF,
                isActive: true
            },
            include: { staffedFactory: true }
        })

        if (!newStaff) {
            throw new NotFoundException("Staff not found or is not active")
        }

        // If the new staff is already assigned to another factory
        if (newStaff.staffedFactory && newStaff.staffedFactory.factoryOwnerId !== factoryId) {
            throw new BadRequestException("Staff is already assigned to another factory")
        }

        // If the factory already has the same staff assigned, no need to update
        if (factory.staffId === newStaffId) {
            throw new BadRequestException("This staff is already assigned to this factory")
        }

        // Update the factory with the new staff
        const updatedFactory = await this.prisma.factory.update({
            where: { factoryOwnerId: factoryId },
            data: {
                staffId: newStaffId
            },
            include: {
                owner: true,
                staff: true,
                address: true
            }
        })

        // Generate formatted address if available
        let formattedAddress = null
        if (updatedFactory.address) {
            try {
                const formatResult = await this.addressesService.formatAddress({
                    provinceID: updatedFactory.address.provinceID,
                    districtID: updatedFactory.address.districtID,
                    wardCode: updatedFactory.address.wardCode,
                    street: updatedFactory.address.street
                })
                formattedAddress = formatResult.text
            } catch (error) {
                this.logger.error(
                    `Failed to format address for factory ${factoryId}: ${error.message}`
                )
            }
        }

        // Notify the new staff
        await this.notificationsService.create({
            title: "Factory Assignment",
            content: `You have been assigned to factory: ${updatedFactory.name}`,
            userId: newStaffId
        })

        // Notify the factory owner
        await this.notificationsService.create({
            title: "Factory Staff Changed",
            content: `Your factory staff has been changed`,
            userId: factoryId
        })

        // If there was a previous staff, notify them as well
        if (factory.staffId && factory.staffId !== newStaffId) {
            await this.notificationsService.create({
                title: "Factory Assignment Removed",
                content: `You have been unassigned from factory: ${factory.name}`,
                userId: factory.staffId
            })
        }

        return new FactoryEntity({
            ...updatedFactory,
            formattedAddress,
            owner: new UserEntity({
                ...updatedFactory.owner,
                id: updatedFactory.owner.id
            }),
            staff: new UserEntity({
                ...updatedFactory.staff,
                id: updatedFactory.staff.id
            })
        })
    }
}
