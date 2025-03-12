import { PaymentMethod, PaymentStatus, PaymentType, TransactionStatus, TransactionType } from '@prisma/client';

export default {
  payments: [
    {
      id: "pay001",
      orderId: "order001",
      userEmail: "customer@gmail.com",
      amount: 80.00,
      type: PaymentType.DEPOSIT,
      paymentLog: "Payment FirstTime",
      createdDate: "2025-03-12T10:00:00.000Z",
      status: PaymentStatus.COMPLETED,
      transactions: [
        {
          id: "trans001",
          amount: 80.00,
          type: TransactionType.PAYMENT,
          paymentMethod: PaymentMethod.VNPAY,
          status: TransactionStatus.COMPLETED,
          paymentGatewayTransactionId: "vnp_123456789",
          transactionLog: "Payment Successfully",
          createdDate: "2025-03-12T10:00:00.000Z"
        }
      ]
    },
    {
      id: "pay002",
      orderId: "order002",
      userEmail: "customer@gmail.com",
      amount: 157.50,
      type: PaymentType.DEPOSIT,
      paymentLog: "Payment FirstTime",
      createdDate: "2025-03-11T15:30:00.000Z",
      status: PaymentStatus.COMPLETED,
      transactions: [
        {
          id: "trans002",
          amount: 157.50,
          type: TransactionType.PAYMENT,
          paymentMethod: PaymentMethod.PAYOS,
          status: TransactionStatus.COMPLETED,
          paymentGatewayTransactionId: "pos_987654321",
          transactionLog: "Payment Successfully",
          createdDate: "2025-03-11T15:30:00.000Z"
        }
      ]
    }
  ]
};