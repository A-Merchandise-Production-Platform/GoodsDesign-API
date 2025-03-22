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

        // Create address first
        const address = await prisma.address.create({
            data: {
                provinceID: 1, // Example default values
                districtID: 1,
                wardCode: "00001",
                street: factory.address,
                userId: user.id
            }
        })

        await prisma.factory.upsert({
            where: {
                factoryOwnerId: user.id
            },
            update: {},
            create: {
                owner: {
                    connect: { id: user.id }
                },
                name: factory.name,
                description: factory.description,
                businessLicenseUrl: factory.businessLicenseUrl,
                taxIdentificationNumber: factory.taxIdentificationNumber,
                address: {
                    connect: { id: address.id }
                },
                website: factory.website,
                establishedDate: new Date(factory.yearEstablished, 0, 1), // Convert year to datetime
                totalEmployees: factory.totalEmployees,
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
