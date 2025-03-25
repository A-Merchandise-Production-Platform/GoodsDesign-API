import { PrismaClient } from "@prisma/client"
import {
    seedBanks,
    seedColors,
    seedSizes,
    seedUsers,
    seedCategories,
    seedProducts,
    seedTasks,
    seedProductPositionTypes,
    seedBlankVariances,
    seedProductDesigns,
    seedCustomerOrders,
    seedDesignPositions,
    seedPayments,
    seedStaffTasks,
    seedCheckQualities,
    seedFavoriteDesigns,
    seedFactories,
    seedFactoryProducts,
    seedFactoryOrders,
    seedFactoryOrderDetails,
    seedCartItems,
    seedDiscounts
} from "./seeds"

const prisma = new PrismaClient()

async function cleanDatabase() {
    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== "_prisma_migrations")
        .map((name) => `"public"."${name}"`)
        .join(", ")

    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    } catch (error) {
        console.log({ error })
    }
}

async function main() {
    try {
        console.log("Cleaning database...")
        await cleanDatabase()
        console.log("Database cleaned!")

        // Seed system configurations first
        await seedBanks(prisma)
        await seedColors(prisma)
        await seedSizes(prisma)

        // Seed users first as they are referenced by many other tables
        await seedUsers(prisma)

        // Seed categories and products
        await seedCategories(prisma)
        await seedProducts(prisma)
        await seedProductPositionTypes(prisma)
        await seedBlankVariances(prisma)

        await seedDiscounts(prisma)

        // Seed factories and their products
        await seedFactories(prisma)
        await seedFactoryProducts(prisma)

        // Seed designs and related data
        await seedProductDesigns(prisma)
        await seedDesignPositions(prisma)
        await seedFavoriteDesigns(prisma)
        await seedCartItems(prisma) // Add cart items after designs are seeded

        // Seed orders and payments
        await seedCustomerOrders(prisma)
        await seedFactoryOrders(prisma)
        await seedFactoryOrderDetails(prisma)
        await seedPayments(prisma)

        // Seed tasks and quality checks
        await seedTasks(prisma)
        await seedStaffTasks(prisma)
        await seedCheckQualities(prisma)

        console.log("Seeding completed successfully!")
    } catch (error) {
        console.error("Error during seeding:", error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
