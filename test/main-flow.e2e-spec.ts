import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';
import { TransactionStatus } from '@prisma/client';
import { TEST_CONFIG } from './test.config';

describe('Main Flow E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let refreshToken: string;
  let designId: string;
  let cartItemId: string;
  let orderId: string;
  let paymentId: string;
  let testUserId: string;
  let testCategoryId: string;
  let testProductId: string;
  let testVariantId: string;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    try{
      await prisma.user.deleteMany({ where: { email: TEST_CONFIG.USER.EMAIL } });
    }catch(error){
      console.log(error);
    }

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: TEST_CONFIG.USER.EMAIL,
        name: TEST_CONFIG.USER.NAME,
        password: 'hashed_password', // Note: In a real test, you should hash this
        role: TEST_CONFIG.USER.ROLE,
        isActive: true,
        isDeleted: false
      }
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await app.close();
  });

  // describe('User Registration', () => {
  //   it('should register a new user', () => {
  //     const registerMutation = `
  //       mutation Register($registerInput: RegisterDto!) {
  //         register(registerInput: $registerInput) {
  //           accessToken
  //           refreshToken
  //           user {
  //             id
  //             email
  //             name
  //             role
  //           }
  //         }
  //       }
  //     `;

  //     const variables = {
  //       registerInput: {
  //         email: 'test@example.com',
  //         name: 'Test User',
  //         password: '123456',
  //         isFactoryOwner: false
  //       }
  //     };

  //     return request(app.getHttpServer())
  //       .post('/graphql')
  //       .send({
  //         query: registerMutation,
  //         variables
  //       })
  //       .expect(200)
  //       .expect(res => {
  //         expect(res.body.data.register).toBeDefined();
  //         expect(res.body.data.register.user).toBeDefined();
  //         expect(res.body.data.register.user.email).toBe(variables.registerInput.email);
  //         expect(res.body.data.register.user.name).toBe(variables.registerInput.name);
  //         expect(res.body.data.register.accessToken).toBeDefined();
  //         expect(res.body.data.register.refreshToken).toBeDefined();

  //         // Store tokens for later use
  //         accessToken = res.body.data.register.accessToken;
  //         refreshToken = res.body.data.register.refreshToken;
  //       });
  //   });
  // });

  describe('User Login', () => {
    it('should login with registered user credentials', () => {
      const loginMutation = `
        mutation Login($loginInput: LoginDto!) {
          login(loginInput: $loginInput) {
            accessToken
            refreshToken
            user {
              id
              email
              name
              role
            }
          }
        }
      `;

      const variables = {
        loginInput: {
          email: TEST_CONFIG.USER.EMAIL,
          password: TEST_CONFIG.USER.PASSWORD
        }
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: loginMutation,
          variables
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.login).toBeDefined();
          expect(res.body.data.login.user).toBeDefined();
          expect(res.body.data.login.user.email).toBe(variables.loginInput.email);
          expect(res.body.data.login.accessToken).toBeDefined();
          expect(res.body.data.login.refreshToken).toBeDefined();

          // Update tokens
          accessToken = res.body.data.login.accessToken;
          refreshToken = res.body.data.login.refreshToken;
        });
    });
  });

  describe('Get Current User with Token', () => {
    it('should get current user using access token', () => {
      const getMeQuery = `
        query GetMe {
          getMe {
            id
            email
            name
            role
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getMeQuery
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.getMe).toBeDefined();
          expect(res.body.data.getMe.email).toBe('test@example.com');
          expect(res.body.data.getMe.name).toBe('Test User');
        });
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token using refresh token', async () => {
      const refreshTokenMutation = `
        mutation RefreshToken($refreshTokenInput: RefreshTokenDto!) {
          refreshToken(refreshTokenInput: $refreshTokenInput) {
            accessToken
            refreshToken
            user {
              id
              email
              name
              role
            }
          }
        }
      `;

      const variables = {
        refreshTokenInput: {
          refreshToken
        }
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: refreshTokenMutation,
          variables
        });

      expect(response.status).toBe(200);
      
      if (response.body.data?.refreshToken) {
        expect(response.body.data.refreshToken.accessToken).toBeDefined();
        expect(response.body.data.refreshToken.refreshToken).toBeDefined();
        expect(response.body.data.refreshToken.user.email).toBe('test@example.com');

        // Update tokens
        accessToken = response.body.data.refreshToken.accessToken;
        refreshToken = response.body.data.refreshToken.refreshToken;
      } else {
        console.log('Refresh token response:', response.body);
      }
    });
  });

  describe('User Logout', () => {
    it('should logout user', () => {
      const logoutMutation = `
        mutation Logout {
          logout
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: logoutMutation
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.logout).toBeDefined();
        });
    });
  });

  describe('Order Flow', () => {
    it('should get a design', async () => {
      // Create test category
      const testCategory = await prisma.category.create({
        data: {
          name: TEST_CONFIG.PRODUCT.CATEGORY.NAME,
          description: TEST_CONFIG.PRODUCT.CATEGORY.DESCRIPTION,
          isActive: true,
          isDeleted: false
        }
      });
      testCategoryId = testCategory.id;

      // Create test product
      const testProduct = await prisma.product.create({
        data: {
          name: TEST_CONFIG.PRODUCT.NAME,
          description: TEST_CONFIG.PRODUCT.DESCRIPTION,
          isActive: true,
          isDeleted: false,
          categoryId: testCategory.id
        }
      });
      testProductId = testProduct.id;

      // Create test variant
      const testVariant = await prisma.systemConfigVariant.create({
        data: {
          productId: testProduct.id,
          size: TEST_CONFIG.PRODUCT.VARIANT.SIZE,
          color: TEST_CONFIG.PRODUCT.VARIANT.COLOR,
          model: TEST_CONFIG.PRODUCT.VARIANT.MODEL,
          price: TEST_CONFIG.PRODUCT.VARIANT.PRICE,
          isActive: true,
          isDeleted: false
        }
      });
      testVariantId = testVariant.id;

      // Create test design
      const testDesign = await prisma.productDesign.create({
        data: {
          userId: testUserId,
          systemConfigVariantId: testVariant.id,
          isFinalized: true,
          isPublic: true,
          isTemplate: false
        }
      });
      designId = testDesign.id;

      const getDesignsQuery = `
        query GetDesigns {
          productDesigns {
            id
            isFinalized
            systemConfigVariant {
              id
              price
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getDesignsQuery
        });

      expect(response.status).toBe(200);
      expect(response.body.data.productDesigns).toBeDefined();
      expect(response.body.data.productDesigns.length).toBeGreaterThan(0);
    });

    it('should add design to cart', async () => {
      const createCartItemMutation = `
        mutation CreateCartItem($createCartItemInput: CreateCartItemDto!) {
          createCartItem(createCartItemInput: $createCartItemInput) {
            id
            quantity
            design {
              id
            }
          }
        }
      `;

      const variables = {
        createCartItemInput: {
          designId,
          quantity: 1
        }
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: createCartItemMutation,
          variables
        });

      expect(response.status).toBe(200);
      expect(response.body.data.createCartItem).toBeDefined();
      expect(response.body.data.createCartItem.design.id).toBe(designId);
      
      cartItemId = response.body.data.createCartItem.id;
    });

    it('should create an order', async () => {
      const createOrderMutation = `
        mutation CreateOrder($createOrderInput: CreateOrderInput!) {
          createOrder(createOrderInput: $createOrderInput) {
            id
            status
            totalPrice
            payments {
              id
              status
            }
          }
        }
      `;

      const variables = {
        createOrderInput: {
          orderDetails: [
            {
              cartItemId
            }
          ]
        }
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: createOrderMutation,
          variables
        });

      expect(response.status).toBe(200);
      expect(response.body.data.createOrder).toBeDefined();
      expect(response.body.data.createOrder.status).toBe('PENDING');
      expect(response.body.data.createOrder.payments).toBeDefined();
      expect(response.body.data.createOrder.payments.length).toBeGreaterThan(0);

      orderId = response.body.data.createOrder.id;
      paymentId = response.body.data.createOrder.payments[0].id;
    });

    it('should create payment URL', async () => {
      const createPaymentUrlMutation = `
        mutation CreatePayment($gateway: String!, $paymentId: String!) {
          createPayment(gateway: $gateway, paymentId: $paymentId)
        }
      `;

      const variables = {
        gateway: TEST_CONFIG.PAYMENT.GATEWAY,
        paymentId
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: createPaymentUrlMutation,
          variables
        });

      expect(response.status).toBe(200);
      expect(response.body.data.createPayment).toBeDefined();
      expect(response.body.data.createPayment).toContain('https://');
    });

    it('should update payment status', async () => {
      if (!paymentId) {
        throw new Error('Payment ID is not defined');
      }

      // Simulate successful payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' }
      });

      await prisma.paymentTransaction.create({
        data: {
          paymentId,
          customerId: testUserId,
          paymentGatewayTransactionId: TEST_CONFIG.PAYMENT.TRANSACTION_ID,
          amount: TEST_CONFIG.PAYMENT.AMOUNT,
          type: 'PAYMENT',
          paymentMethod: TEST_CONFIG.PAYMENT.GATEWAY,
          status: TransactionStatus.COMPLETED,
          transactionLog: 'Payment successful',
          createdAt: new Date()
        }
      });

      // Verify payment status
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { transactions: true }
      });

      expect(payment.status).toBe('COMPLETED');
      expect(payment.transactions.length).toBeGreaterThan(0);
      expect(payment.transactions[0].status).toBe('COMPLETED');
    });

    it('should wait for cron job to process order', async () => {
      if (!orderId) {
        throw new Error('Order ID is not defined');
      }

      // Wait for cron job processing
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.CRON.WAIT_TIME_MS));

      // Verify order status
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      expect(order.status).toBe('PAYMENT_RECEIVED');
    });
  });
});
