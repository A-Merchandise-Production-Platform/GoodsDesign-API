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

        await prisma.factory.create({
            data: {
                factoryOwnerId: user.id,
                name: factory.name,
                description: factory.description,
                businessLicenseUrl: factory.businessLicenseUrl,
                taxIdentificationNumber: factory.taxIdentificationNumber,
                address: factory.address,
                website: factory.website,
                yearEstablished: factory.yearEstablished,
                totalEmployees: factory.totalEmployees,
                maxPrintingCapacity: factory.maxPrintingCapacity,
                qualityCertifications: factory.qualityCertifications,
                primaryPrintingMethods: factory.primaryPrintingMethods,
                specializations: factory.specializations,
                contactPersonName: factory.contactPersonName,
                contactPersonRole: factory.contactPersonRole,
                contactPhone: factory.contactPhone,
                operationalHours: factory.operationalHours,
                leadTime: factory.leadTime,
                minimumOrderQuantity: factory.minimumOrderQuantity,
                factoryStatus: factory.factoryStatus as FactoryStatus,
                statusNote: factory.statusNote,
                contractAccepted: factory.contractAccepted,
                contractAcceptedAt: factory.contractAcceptedAt,
                reviewedBy: factory.reviewedBy,
                reviewedAt: factory.reviewedAt,
                contract: factory.contract
            }
        })
    }

    console.log("Factories seeded successfully!")
}
