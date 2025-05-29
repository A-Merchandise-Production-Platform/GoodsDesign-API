import { PrismaClient } from '@prisma/client'
import { evaluationCriteriaData } from './data/evaluation-criteria.data'

export async function seedEvaluationCriteria(prisma: PrismaClient) {
  console.log('Seeding evaluation criteria...')

  // Get all products to associate criteria with
  const products = await prisma.product.findMany()
  
  if (products.length === 0) {
    console.log('No products found to associate evaluation criteria with')
    return
  }

  // Create evaluation criteria for each product
  for (const product of products) {
    for (const criteria of evaluationCriteriaData) {
      await prisma.evaluationCriteria.create({
        data: {
          ...criteria,
          productId: product.id
        }
      })
    }
  }

  console.log('Evaluation criteria seeded successfully!')
} 