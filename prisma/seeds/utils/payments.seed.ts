import { PaymentMethod, PaymentStatus, PaymentType, PrismaClient, TransactionStatus, TransactionType } from '@prisma/client';
import { paymentsData } from '../data/payments.data';

export async function seedPayments(prisma: PrismaClient) {
  try {
    console.log('Seeding payments and transactions...');

    for (const paymentData of paymentsData.payments) {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: paymentData.userEmail }
      });

      if (!user) {
        throw new Error(`User with email ${paymentData.userEmail} not found`);
      }

      // Create payment
      const payment = await prisma.payment.create({
        data: {
          id: paymentData.id,
          orderId: paymentData.orderId,
          customerId: user.id,
          amount: paymentData.amount,
          type: paymentData.type as PaymentType,
          paymentLog: paymentData.paymentLog,
          createdAt: new Date(paymentData.createdDate),
          status: paymentData.status as PaymentStatus
        }
      });

      // Create transactions for this payment
      for (const transactionData of paymentData.transactions) {
        await prisma.paymentTransaction.create({
          data: {
            id: transactionData.id,
            paymentId: payment.id,
            customerId: payment.customerId,
            amount: transactionData.amount,
            type: transactionData.type as TransactionType,
            paymentMethod: transactionData.paymentMethod as PaymentMethod,
            status: transactionData.status as TransactionStatus,
            paymentGatewayTransactionId: transactionData.paymentGatewayTransactionId,
            transactionLog: transactionData.transactionLog,
            createdAt: new Date(transactionData.createdDate)
          }
        });
      }
    }

    console.log('Payments and transactions seeded successfully!');
  } catch (error) {
    console.error('Error seeding payments and transactions:', error);
    throw error;
  }
}