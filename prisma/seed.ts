import { PrismaClient } from "@prisma/client"
import {
    seedBanks,
    seedUsers,
    seedCategories,
    seedProducts,
    seedProductPositionTypes,
    seedProductDesigns,
    seedDesignPositions,
    seedFavoriteDesigns,
    seedFactories,
    seedFactoryProducts,
    seedCartItems,
    seedDiscounts,
    seedSystemConfigVariants,
    seedNotifications,
    seedOrders,
    seedVouchers
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

        // Seed users first as they are referenced by many other tables
        await seedUsers(prisma)

        // Seed vouchers (depends on users)
        await seedVouchers(prisma)

        // Seed categories and products
        await seedCategories(prisma)
        await seedProducts(prisma)
        await seedProductPositionTypes(prisma)

        // Seed system config variants with retry logic
        let retryCount = 0
        const maxRetries = 3
        while (retryCount < maxRetries) {
            try {
                await seedSystemConfigVariants(prisma)
                break
            } catch (error) {
                retryCount++
                if (retryCount === maxRetries) {
                    throw error
                }
                console.log(
                    `Retrying system config variants seeding (attempt ${retryCount + 1}/${maxRetries})...`
                )
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
            }
        }

        await seedDiscounts(prisma)

        // Seed factories and their products
        await seedFactories(prisma)
        await seedFactoryProducts(prisma)

        // Seed designs and related data
        await seedProductDesigns(prisma)
        await seedDesignPositions(prisma)
        await seedFavoriteDesigns(prisma)
        await seedCartItems(prisma)

        // Seed orders
        await seedOrders(prisma)
        // Seed notifications
        await seedNotifications(prisma)

        console.log("Seeding completed successfully!")
    } catch (error) {
        console.error("Error during seeding:", error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
