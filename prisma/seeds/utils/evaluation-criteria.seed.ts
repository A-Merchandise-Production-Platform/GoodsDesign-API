import { PrismaClient } from "@prisma/client"
import { evaluationCriteriaData } from "../data/evaluation-criteria.data"

export async function seedEvaluationCriteria(prisma: PrismaClient) {
    console.log("Seeding evaluation criteria...")

    // Get the first product ID to use for all criteria
    const firstProduct = await prisma.product.findFirst()
    if (!firstProduct) {
        throw new Error("No product found to associate with evaluation criteria")
    }

    // Create evaluation criteria with the actual product ID
    const criteriaWithProductId = evaluationCriteriaData.map(criteria => ({
        ...criteria,
        productId: firstProduct.id
    }))

    for (const criteria of criteriaWithProductId) {
        await prisma.evaluationCriteria.create({
            data: criteria
        })
    }

    console.log("Evaluation criteria seeded!")
} 