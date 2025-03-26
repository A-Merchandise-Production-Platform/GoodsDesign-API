export const MAIL_CONSTANT = {
  FROM_EMAIL: 'GoodsDesign <goodsdesign@uydev.id.vn>',
};

export enum MailTemplateType {
  INVOICE = 'invoice',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  ORDER_CONFIRMATION = 'order_confirmation',
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
  };
