import { PrismaClient, FactoryStatus } from "@prisma/client"
import { factoriesData } from "../data/factories.data"

export async function seedFactories(prisma: PrismaClient) {
    console.log("Seeding factories...")

    for (const factory of factoriesData) {
        const user = await prisma.user.findUnique({
            where: { id: factory.factoryOwnerId }
        })

        if (!user) {
            console.log(
                `User with ID ${factory.factoryOwnerId} not found. Skipping factory creation.`
            )
            continue
        }

        await prisma.factory.upsert({
            where: {
                factoryOwnerId: user.id
            },
            update: {},
            create: {
                owner: {
                    connect: {
                        id: user.id
                    }
                },
                name: factory.name,
                description: factory.description,
                businessLicenseUrl: factory.businessLicenseUrl,
                taxIdentificationNumber: factory.taxIdentificationNumber,
                address: {
                    create: {
                        formattedAddress: factory.address.formattedAddress,
                        provinceID: factory.address.provinceID,
                        districtID: factory.address.districtID,
                        wardCode: factory.address.wardCode,
                        street: factory.address.street,
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                },
                website: factory.website,
                establishedDate: new Date(factory.yearEstablished, 0, 1),
                maxPrintingCapacity: factory.maxPrintingCapacity,
                qualityCertifications: factory.qualityCertifications,
                printingMethods: factory.primaryPrintingMethods.split(", "),
                specializations:
                    typeof factory.specializations === "string"
                        ? factory.specializations.split(", ")
                        : [],
                contactPersonName: factory.contactPersonName,
                contactPersonRole: factory.contactPersonRole,
                contactPhone: factory.contactPhone,
                leadTime: factory.leadTime,
                factoryStatus: factory.factoryStatus as FactoryStatus,
                statusNote: factory.statusNote,
                contractAccepted: factory.contractAccepted,
                contractAcceptedAt: factory.contractAcceptedAt,
                reviewedBy: factory.reviewedBy,
                reviewedAt: factory.reviewedAt,
                contractUrl: factory.contractUrl,
                staff: factory?.staffId ? {
                    connect: {
                        id: factory.staffId
                    }
                } : undefined
            }
        })
    }

    console.log("Factories seeded successfully!")
}
