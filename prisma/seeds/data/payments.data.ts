import { PaymentType, PaymentStatus, TransactionType, PaymentMethod, TransactionStatus } from '@prisma/client'

interface Transaction {
  id: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  status: TransactionStatus
  paymentGatewayTransactionId: string
  transactionLog: string
  createdDate: string
}

interface Payment {
  id: string
  orderId: string
  userEmail: string
  amount: number
  type: PaymentType
  paymentLog: string
  createdDate: string
  status: PaymentStatus
  transactions: Transaction[]
}

interface PaymentsData {
  payments: Payment[]
}

export const paymentsData: PaymentsData = {
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
}