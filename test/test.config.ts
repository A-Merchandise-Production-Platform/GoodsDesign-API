import { Roles, PaymentMethod } from '@prisma/client';

export const TEST_CONFIG = {
  USER: {
    EMAIL: 'test@example.com',
    NAME: 'Test User',
    PASSWORD: '123456',
    ROLE: Roles.CUSTOMER
  },
  PRODUCT: {
    NAME: 'Test Product',
    DESCRIPTION: 'Test Description',
    CATEGORY: {
      NAME: 'Test Category',
      DESCRIPTION: 'Test Description'
    },
    VARIANT: {
      SIZE: 'M',
      COLOR: 'Red',
      MODEL: 'Test Model',
      PRICE: 100000
    }
  },
  PAYMENT: {
    GATEWAY: PaymentMethod.PAYOS,
    AMOUNT: 100000,
    TRANSACTION_ID: 'test_transaction_id'
  },
  CRON: {
    WAIT_TIME_MS: 5000
  }
}; 