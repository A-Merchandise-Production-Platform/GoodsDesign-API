export const MAIL_CONSTANT = {
  FROM_EMAIL: 'GoodsDesign <goodsdesign@uydev.id.vn>',
};

export enum MailTemplateType {
  INVOICE = 'invoice',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  ORDER_CONFIRMATION = 'order_confirmation',
  REFUND_INFORMATION = 'refund_information',
};

export type MailTemplateValue = {
  subject: string;
  htmlGenerate: (...args: any[]) => string;
};

export type MailTemplateInvoice = {
  email: string;
  orderId: string;
  amount: number;
};

export type MailTemplateWelcome = {
  name: string;
};

export type MailTemplatePasswordReset = {
  resetLink: string;
};

export type MailTemplateOrderConfirmation = {
  orderId: string;
  trackingNumber: string;
};

export type MailTemplateRefundInformation = {
  orderId: string;
  amount: number;
};


export const MailTemplateMap: Record<MailTemplateType, MailTemplateValue> = {
    [MailTemplateType.INVOICE]: {
      subject: '[GoodsDesign] Invoice',
      htmlGenerate: ({ amount, orderId, email }: MailTemplateInvoice) => `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; border: 1px solid #ddd; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice</h1>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> ${amount} VND</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
        </body>
        </html>
      `,
    },
    [MailTemplateType.WELCOME]: {
      subject: '[GoodsDesign] Welcome to Our Service!',
      htmlGenerate: ({ name }: MailTemplateWelcome) => `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for signing up. We're glad to have you with us.</p>
          </div>
        </body>
        </html>
      `,
    },
    [MailTemplateType.PASSWORD_RESET]: {
      subject: '[GoodsDesign] Password Reset Request',
      htmlGenerate: ({ resetLink }: MailTemplatePasswordReset) => `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; }
            a { color: #007bff; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset</h1>
            <p>Click the link below to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
          </div>
        </body>
        </html>
      `,
    },
    [MailTemplateType.ORDER_CONFIRMATION]: {
      subject: '[GoodsDesign] Order Confirmation',
      htmlGenerate: ({ orderId, trackingNumber }: MailTemplateOrderConfirmation) => `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; border: 1px solid #ddd; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Order Confirmation</h1>
            <p>Your order ID: <strong>${orderId}</strong> has been confirmed.</p>
            <p>Tracking Number: <strong>${trackingNumber}</strong></p>
          </div>
        </body>
        </html>
      `,
    },
    [MailTemplateType.REFUND_INFORMATION]: {
      subject: '[GoodsDesign] Please fill in the information',
      htmlGenerate: ({ orderId, amount }: MailTemplateRefundInformation) => `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Please fill in the information</h1>
            <p>Order ID: ${orderId}</p>
            <p>Amount: ${amount} VND</p>
          </div>
          <p>Please fill in the information for refund order ${orderId}</p>
          <p>Go to <a href="https://goodsdesign.uydev.id.vn/profile/payments">here</a> to fill in the information</p>
          <p>Thank you for your understanding and support.</p>
          <p>Best regards,</p>
          <p>GoodsDesign Team</p>
        </body>
        </html>
      `,
    },
  };
