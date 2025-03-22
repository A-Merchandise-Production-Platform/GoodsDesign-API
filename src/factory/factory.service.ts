import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { Roles } from "@prisma/client"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { ProductEntity } from "src/products/entities/products.entity"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto"

@Injectable()
export class FactoryService {
    constructor(private prisma: PrismaService) {}

    async updateFactoryInfo(userId: string, dto: UpdateFactoryInfoDto) {
        // First, check if the user is a factory owner
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { factory: true }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        if (user.role !== Roles.FACTORYOWNER) {
            throw new ForbiddenException("Only factory owners can update factory information")
        }

        // Check if the factory already exists for this user
        const existingFactory = user.factory

        // Check if the factory is already submitted for approval
        if (existingFactory && existingFactory.isSubmitted) {
            throw new BadRequestException(
                "Factory information has already been submitted for approval and cannot be updated"
            )
        }

        // Set isSubmitted to true if submit flag is provided
        const isSubmitted = dto.submit === true

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
                addressId: dto.addressId,
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
                isSubmitted: isSubmitted
            },
            create: {
                factoryOwnerId: userId,
                name: dto.name || "New Factory",
                description: dto.description,
                businessLicenseUrl: dto.businessLicenseUrl,
                taxIdentificationNumber: dto.taxIdentificationNumber,
                addressId: dto.addressId,
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
                isSubmitted: isSubmitted
            },
            include: {
                address: true,
                products: true,
                orders: true
            }
        })

        return new FactoryEntity({
            ...updatedFactory,
            contract: updatedFactory.contract ? JSON.stringify(updatedFactory.contract) : null,
            products: updatedFactory.products.map(
                (product) =>
                    new ProductEntity({
                        ...product
                    })
            )
        })
    }

    async getMyFactory(userId: string) {
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: userId },
            include: {
                address: true,
                products: true,
                orders: true
            }
        })

        return factory
            ? new FactoryEntity({
                  ...factory,
                  contract: factory.contract ? JSON.stringify(factory.contract) : null,
                  products: factory.products.map(
                      (product) =>
                          new ProductEntity({
                              ...product
                          })
                  )
              })
            : null
    }
}
