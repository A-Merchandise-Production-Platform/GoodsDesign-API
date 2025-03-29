import { OrderStatus, QualityCheckStatus, ReworkStatus } from '@prisma/client'

interface OrderDetail {
  id: string
  designId: string
  price: number
  quantity: number
  status: OrderStatus
  qualityCheckStatus: QualityCheckStatus
  reworkStatus: ReworkStatus
}

interface CustomerOrder {
  id: string
  userEmail: string
  status: OrderStatus
  totalPrice: number
  shippingPrice: number
  depositPaid: number
  orderDate: string
  details: OrderDetail[]
}

interface CustomerOrdersData {
  customerOrders: CustomerOrder[]
}

export const customerOrdersData: CustomerOrdersData = {
  customerOrders: [
    {
      id: "order001",
      userEmail: "customer@gmail.com",
      status: OrderStatus.PENDING,
      totalPrice: 150000,
      shippingPrice: 10000,
      depositPaid: 80000,
      orderDate: "2025-03-12T10:00:00.000Z",
      details: [
        {
          id: "detail001",
          designId: "design001",
          price: 140000,
          quantity: 2,
          status: OrderStatus.PENDING,
          qualityCheckStatus: QualityCheckStatus.PENDING,
          reworkStatus: ReworkStatus.NOT_REQUIRED
        }
      ]
    },
    {
      id: "order002",
      userEmail: "customer@gmail.com",
      status: OrderStatus.IN_PRODUCTION,
      totalPrice: 300000,
      shippingPrice: 15000,
      depositPaid: 157.50,
      orderDate: "2025-03-11T15:30:00.000Z",
      details: [
        {
          id: "detail002",
          designId: "design002",
          price: 285.00,
          quantity: 3,
          status: OrderStatus.IN_PRODUCTION,
          qualityCheckStatus: QualityCheckStatus.PARTIAL_APPROVED,
          reworkStatus: ReworkStatus.IN_PROGRESS
        }
      ]
    }
  ]
}