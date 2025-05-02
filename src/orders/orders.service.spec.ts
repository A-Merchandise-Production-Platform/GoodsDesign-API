import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ShippingService } from '../shipping/shipping.service';
import { BadRequestException } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { OrderProgressReportEntity } from './entities/order-progress-report.entity';
import { OrderStatus, OrderDetailStatus, TaskStatus, TaskType, QualityCheckStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;
  let shippingService: ShippingService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    order: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    orderDetail: {
      update: jest.fn(),
      updateMany: jest.fn(),
      findUnique: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
    task: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    checkQuality: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    systemConfigOrder: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    factory: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    rejectedOrder: {
      create: jest.fn(),
    },
    orderProgressReport: {
      create: jest.fn(),
    },
  };

  const mockNotificationsService = {
    create: jest.fn(),
    createForUsersByRoles: jest.fn(),
  };

  const mockShippingService = {
    createShippingOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: ShippingService,
          useValue: mockShippingService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    shippingService = module.get<ShippingService>(ShippingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order with valid input', async () => {
      const userId = '1';
      const createOrderInput = {
        orderDetails: [
          {
            cartItemId: '1',
          },
        ],
      };

      const mockCartItems = [
        {
          id: '1',
          userId,
          quantity: 2,
          design: {
            id: 'design1',
            systemConfigVariant: {
              price: 100,
              product: {
                discounts: [],
              },
            },
            designPositions: [],
          },
          systemConfigVariant: {},
        },
      ];

      const mockUser = {
        id: userId,
        addresses: [{ id: 'address1' }],
      };

      const mockSystemConfig = {
        checkQualityTimesDays: 1,
        shippingDays: 2,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          cartItem: {
            findMany: jest.fn().mockResolvedValue(mockCartItems),
            deleteMany: jest.fn(),
          },
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order1',
              orderDetails: [],
            }),
          },
          payment: {
            create: jest.fn(),
          },
          task: {
            create: jest.fn(),
          },
          checkQuality: {
            create: jest.fn(),
          },
        });
      });

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.systemConfigOrder.findUnique.mockResolvedValue(mockSystemConfig);

      const result = await service.create(createOrderInput, userId);
      expect(result).toBeDefined();
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no order details provided', async () => {
      const userId = '1';
      const createOrderInput = {
        orderDetails: [],
      };

      await expect(service.create(createOrderInput, userId))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        {
          id: '1',
          status: OrderStatus.PENDING,
          orderDetails: [],
          orderProgressReports: [],
          payments: [],
        },
      ];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('findByCustomerId', () => {
    it('should return orders for a specific customer', async () => {
      const customerId = '1';
      const mockOrders = [
        {
          id: '1',
          customerId,
          status: OrderStatus.PENDING,
          orderDetails: [],
          orderProgressReports: [],
          payments: [],
        },
      ];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findByCustomerId(customerId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('findByMyFactoryId', () => {
    it('should return orders for a specific factory', async () => {
      const factoryId = '1';
      const mockOrders = [
        {
          id: '1',
          factoryId,
          status: OrderStatus.PENDING,
          orderDetails: [],
          orderProgressReports: [],
          payments: [],
        },
      ];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findByMyFactoryId(factoryId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('findByStaffId', () => {
    it('should return orders assigned to a specific staff member', async () => {
      const staffId = '1';
      const mockOrders = [
        {
          id: '1',
          tasks: [{ userId: staffId }],
          status: OrderStatus.PENDING,
          orderDetails: [],
          orderProgressReports: [],
          payments: [],
        },
      ];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findByStaffId(staffId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('findOne', () => {
    it('should return a specific order', async () => {
      const orderId = '1';
      const mockOrder = {
        id: orderId,
        status: OrderStatus.PENDING,
        orderDetails: [],
        orderProgressReports: [],
        payments: [],
      };
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);
      expect(result).toBeInstanceOf(OrderEntity);
    });
  });

  describe('acceptOrderForFactory', () => {
    it('should accept an order for a factory', async () => {
      const orderId = '1';
      const factoryId = '1';
      const mockOrder = {
        id: orderId,
        factoryId,
        status: OrderStatus.PENDING_ACCEPTANCE,
        orderDetails: [],
        customer: { id: 'customer1' },
        factory: { staffId: 'staff1' },
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn().mockResolvedValue(mockOrder),
          },
          task: {
            updateMany: jest.fn(),
          },
          orderDetail: {
            updateMany: jest.fn(),
          },
        });
      });

      const result = await service.acceptOrderForFactory(orderId, factoryId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('rejectOrder', () => {
    it('should reject an order', async () => {
      const orderId = '1';
      const factoryId = '1';
      const reason = 'Test reason';
      const mockOrder = {
        id: orderId,
        factoryId,
        status: OrderStatus.PENDING_ACCEPTANCE,
        orderDetails: [],
        customer: { id: 'customer1' },
      };

      const mockSystemConfig = {
        reduceLegitPointIfReject: 10,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn().mockResolvedValue(mockOrder),
          },
          factory: {
            update: jest.fn(),
          },
          rejectedOrder: {
            create: jest.fn(),
          },
        });
      });

      mockPrismaService.systemConfigOrder.findUnique.mockResolvedValue(mockSystemConfig);

      const result = await service.rejectOrder(orderId, factoryId, reason);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('doneProductionOrderDetails', () => {
    it('should mark order details as done production', async () => {
      const orderDetailId = '1';
      const factoryId = '1';
      const mockOrderDetail = {
        id: orderDetailId,
        order: {
          id: 'order1',
          factoryId,
          orderDetails: [],
          tasks: [],
          customer: { id: 'customer1' },
        },
        status: OrderDetailStatus.IN_PRODUCTION,
        quantity: 2,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          orderDetail: {
            findUnique: jest.fn().mockResolvedValue(mockOrderDetail),
            update: jest.fn(),
            updateMany: jest.fn(),
          },
          order: {
            update: jest.fn(),
          },
          task: {
            update: jest.fn(),
          },
          orderProgressReport: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.doneProductionOrderDetails(orderDetailId, factoryId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('doneCheckQuality', () => {
    it('should complete quality check for an order', async () => {
      const checkQualityId = '1';
      const staffId = '1';
      const passedQuantity = 2;
      const failedQuantity = 0;
      const mockCheckQuality = {
        id: checkQualityId,
        task: { id: 'task1', userId: staffId },
        orderDetail: {
          id: 'detail1',
          quantity: 2,
          order: {
            id: 'order1',
            orderDetails: [],
            tasks: [],
            customer: { id: 'customer1' },
            factoryId: 'factory1',
          },
          checkQualities: [],
        },
        status: QualityCheckStatus.PENDING,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          checkQuality: {
            findUnique: jest.fn().mockResolvedValue(mockCheckQuality),
            update: jest.fn(),
          },
          task: {
            update: jest.fn(),
          },
          orderDetail: {
            update: jest.fn(),
          },
          order: {
            update: jest.fn(),
            findFirst: jest.fn().mockResolvedValue({
              orderDetails: [],
            }),
          },
          orderProgressReport: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.doneCheckQuality(
        checkQualityId,
        staffId,
        passedQuantity,
        failedQuantity,
      );
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('startRework', () => {
    it('should start rework for an order', async () => {
      const orderId = '1';
      const factoryId = '1';
      const mockOrder = {
        id: orderId,
        factoryId,
        status: OrderStatus.REWORK_REQUIRED,
        orderDetails: [],
        customer: { id: 'customer1' },
      };

      const mockSystemConfig = {
        checkQualityTimesDays: 1,
        shippingDays: 2,
        reduceLegitPointIfReject: 10,
        limitReworkTimes: 3,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn(),
          },
          orderDetail: {
            updateMany: jest.fn(),
          },
          factory: {
            update: jest.fn(),
            findFirst: jest.fn().mockResolvedValue({
              staff: { id: 'staff1' },
            }),
          },
          task: {
            create: jest.fn(),
          },
          checkQuality: {
            create: jest.fn(),
          },
        });
      });

      mockPrismaService.systemConfigOrder.findUnique.mockResolvedValue(mockSystemConfig);

      const result = await service.startRework(orderId, factoryId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('shippedOrder', () => {
    it('should mark an order as shipped', async () => {
      const orderId = '1';
      const mockOrder = {
        id: orderId,
        status: OrderStatus.SHIPPING,
        orderDetails: [],
        customer: { id: 'customer1' },
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn(),
          },
          orderDetail: {
            updateMany: jest.fn(),
          },
          orderProgressReport: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.shippedOrder(orderId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('feedbackOrder', () => {
    it('should add feedback to an order', async () => {
      const orderId = '1';
      const customerId = '1';
      const feedbackInput = {
        rating: 5,
        ratingComment: 'Great service!',
      };

      const mockOrder = {
        id: orderId,
        customerId,
        status: OrderStatus.SHIPPED,
        factory: { factoryOwnerId: 'factory1' },
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn(),
          },
          orderDetail: {
            updateMany: jest.fn(),
          },
          orderProgressReport: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.feedbackOrder(orderId, customerId, feedbackInput);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('addOrderProgressReport', () => {
    it('should add a progress report to an order', async () => {
      const orderId = '1';
      const note = 'Test progress';
      const imageUrls = ['image1.jpg'];

      const mockReport = {
        id: '1',
        orderId,
        note,
        imageUrls,
      };

      mockPrismaService.orderProgressReport.create.mockResolvedValue(mockReport);

      const result = await service.addOrderProgressReport(orderId, note, imageUrls);
      expect(result).toBeInstanceOf(OrderProgressReportEntity);
    });
  });

  describe('reassignNewStaffForOrder', () => {
    it('should reassign staff for an order', async () => {
      const orderId = '1';
      const newStaffId = '1';
      const mockOrder = {
        id: orderId,
        factory: {
          owner: { id: 'owner1' },
          staff: { id: 'oldStaff1' },
        },
      };

      const mockNewStaff = {
        id: newStaffId,
        role: 'STAFF',
        name: 'New Staff',
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.user.findUnique.mockResolvedValue(mockNewStaff);
      mockPrismaService.factory.findFirst.mockResolvedValue(null);

      const result = await service.reassignNewStaffForOrder(orderId, newStaffId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(3);
    });
  });

  describe('createRefundForOrder', () => {
    it('should create a refund for an order', async () => {
      const orderId = '1';
      const mockOrder = {
        id: orderId,
        customerId: 'customer1',
        status: OrderStatus.PENDING,
        payments: [
          {
            type: 'DEPOSIT',
            status: 'COMPLETED',
            amount: 100,
          },
        ],
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            findUnique: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn(),
          },
          payment: {
            create: jest.fn(),
          },
          orderProgressReport: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.createRefundForOrder(orderId);
      expect(result).toBeDefined();
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('assignFactoryToOrder', () => {
    it('should assign a factory to an order', async () => {
      const orderId = '1';
      const factoryId = '1';
      const mockOrder = {
        id: orderId,
        factoryId,
        status: OrderStatus.PENDING_ACCEPTANCE,
      };

      mockPrismaService.order.update.mockResolvedValue(mockOrder);

      const result = await service.assignFactoryToOrder(orderId, factoryId);
      expect(result).toBeInstanceOf(OrderEntity);
    });
  });
}); 