import { Injectable, OnModuleInit } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { envConfig } from 'src/dynamic-modules';
import { PrismaService } from 'src/prisma';

export enum PaymentGateway {
  PAYOS = 'PAYOS',
  VNPAY = 'VNPAY',
}

@Injectable()
export class PaymentGatewayService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('PaymentGatewayService initialized');

    //find 1 paymentId
    const payment = await this.prisma.payment.findFirst({
    });

    if (payment) {
      const vnpUrl = await this.createVNPayPayment({
        paymentId: payment.id,
        userId: payment.customerId,
      });
      console.log('VNPay payment created link', vnpUrl);
    }
  }

  async createPayOSPayment(paymentData: {
    paymentId: string;
    userId: string;
  }) {
    const clientId = envConfig().payment.payos.clientId;
    const apiKey = envConfig().payment.payos.apiKey;
    const checksumKey = envConfig().payment.payos.checksumKey;

    // TODO: Implement PayOS payment creation
    throw new Error('PayOS payment not implemented');
  }

  async createVNPayPayment(paymentData: {
    paymentId: string;
    userId: string;
  }): Promise<string> {
    const tmnCode = envConfig().payment.vnpay.tmnCode;
    const hashSecret = envConfig().payment.vnpay.hashSecret;
    const vnpUrl = envConfig().payment.vnpay.vnpUrl;
    const returnUrl = envConfig().payment.vnpay.returnUrl;
    const version = envConfig().payment.vnpay.version;

    // Create payment transaction
    const date = new Date();
    
    const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const orderId = paymentData.paymentId;
    const amount = 10000
    const bankCode = "VNBANK"
    
    const orderInfo = `PaymentForPaymentId ${orderId}`;
    const orderType = 'billpayment';
    const locale = 'vn';
    const currCode = 'VND';

    const ipAddr = '127.0.0.1';

    const vnpParams: Record<string, string> = {
      vnp_Version: version,
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: "123",
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: (amount * 100).toString(),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort parameters alphabetically
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {} as Record<string, string>);

    console.log('sortedParams', sortedParams);

    // Create signature
    const querystring = require('qs');
    const signData = querystring.stringify(sortedParams, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Add signature to params
    sortedParams['vnp_SecureHash'] = signed;

    // Create final URL
    const url = `${vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;

    //result
    console.log('VNPay payment created link', url);
    return url;
  }

  async verifyPayment(gateway: PaymentGateway, paymentData: any) {
    switch (gateway) {
      case PaymentGateway.PAYOS:
        return this.verifyPayOSPayment(paymentData);
      case PaymentGateway.VNPAY:
        return this.verifyVNPayPayment(paymentData);
      default:
        throw new Error('Unsupported payment gateway');
    }
  }

  private async verifyPayOSPayment(paymentData: any) {
    // TODO: Implement PayOS payment verification
    throw new Error('PayOS verification not implemented');
  }

  private async verifyVNPayPayment(paymentData: any) {
    // TODO: Implement VNPay payment verification
    throw new Error('VNPay verification not implemented');
  }
} 