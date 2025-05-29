import { PrismaClient } from '@prisma/client'

export async function seedOrderEvaluationCriteria(prisma: PrismaClient) {
  console.log('Seeding order evaluation criteria...')

  // Get completed orders
  const completedOrders = await prisma.order.findMany({
    where: {
      status: 'COMPLETED'
    }
  })

  if (completedOrders.length === 0) {
    console.log('No completed orders found to create evaluations')
    return
  }

  // Get all evaluation criteria
  const evaluationCriteria = await prisma.evaluationCriteria.findMany()

  if (evaluationCriteria.length === 0) {
    console.log('No evaluation criteria found')
    return
  }

  // Create order evaluations for each completed order
  for (const order of completedOrders) {
    // Randomly select 3-5 criteria for each order
    const numCriteria = Math.floor(Math.random() * 3) + 3 // Random number between 3-5
    const selectedCriteria = evaluationCriteria
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, numCriteria)

    for (const criteria of selectedCriteria) {
      await prisma.orderEvaluationCriteria.create({
        data: {
          orderId: order.id,
          evaluationCriteriaId: criteria.id
        }
      })
    }
  }

  console.log('Order evaluation criteria seeded successfully!')
} 