import { OrderDetailStatus, OrderStatus, QualityCheckStatus } from '@prisma/client'

interface OrderDetail {
  id: string
  designId: string
  price: number
  quantity: number
  status: OrderDetailStatus
}

interface CustomerOrder {
  id: string
  customerId: string
  status: OrderStatus
  totalPrice: number
  shippingPrice: number
  depositPaid: number
  orderDate: string
  rating?: number
  ratingComment?: string
  ratedAt?: string
  ratedBy?: string
  details: OrderDetail[]
}

interface CustomerOrdersData {
  customerOrders: CustomerOrder[]
}

export const customerOrdersData: CustomerOrdersData = {
  customerOrders: [
    {
      id: "order001",
      customerId: "customer-id",
      status: OrderStatus.DELIVERED,
      totalPrice: 150000,
      shippingPrice: 10000,
      depositPaid: 80000,
      orderDate: "2023-03-12T10:00:00.000Z",
      rating: 5,
      ratingComment: "Excellent quality and fast delivery",
      ratedAt: "2023-03-20T14:30:00.000Z",
      ratedBy: "customer-id",
      details: [
        {
          id: "detail001",
          designId: "design001",
          price: 140000,
          quantity: 2,
          status: OrderDetailStatus.COMPLETED,
        }
      ]
    },
    {
      id: "order002",
      customerId: "customer-id",
      status: OrderStatus.IN_PRODUCTION,
      totalPrice: 300000,
      shippingPrice: 15000,
      depositPaid: 150000,
      orderDate: "2023-03-11T15:30:00.000Z",
      details: [
        {
          id: "detail002",
          designId: "design002",
          price: 285000,
          quantity: 3,
          status: OrderDetailStatus.IN_PRODUCTION,
        }
      ]
    },
    {
      id: "order003",
      customerId: "customer-id",
      status: OrderStatus.PENDING,
      totalPrice: 200000,
      shippingPrice: 10000,
      depositPaid: 0,
      orderDate: "2023-03-15T09:45:00.000Z",
      details: [
        {
          id: "detail003",
          designId: "design003",
          price: 190000,
          quantity: 1,
          status: OrderDetailStatus.PENDING,
        },
        {
          id: "detail004",
          designId: "design002",
          price: 190000,
          quantity: 2,
          status: OrderDetailStatus.PENDING,
        }
      ]
    }
  ]
}