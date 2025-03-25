import { PrismaClient } from "@prisma/client"
import { createDiscountData } from "../data/system-config-discounts.data"

export async function seedDiscounts(prisma: PrismaClient): Promise<void> {
    console.log("🌱 Seeding discount configurations...")

    // Get all active products
    const products = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true
        }
    })

    for (const product of products) {
        const discounts = createDiscountData(product.id)

        for (const discount of discounts) {
            // Check if discount with same name exists
            const existingDiscount = await prisma.systemConfigDiscount.findFirst({
                where: {
                    productId: product.id,
                    minQuantity: discount.minQuantity,
                    isDeleted: false
                }
            })

            if (!existingDiscount) {
                await prisma.systemConfigDiscount.create({
                    data: {
                        name: discount.name,
                        minQuantity: discount.minQuantity,
                        discountPercent: discount.discountPercent,
                        productId: product.id
                    }
                })
                console.log(`✅ Created discount: ${discount.name} for product: ${product.name}`)
            } else {
                console.log(
                    `⏩ Discount for product ${product.name} with quantity ${discount.minQuantity} already exists, skipping...`
                )
            }
        }
    }

    console.log("✅ Discount seeding completed!")
}
