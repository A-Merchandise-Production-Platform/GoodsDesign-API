export const MAIL_CONSTANT = {
    FROM_EMAIL: "GoodsDesign <goodsdesign@uydev.id.vn>"
}

export enum MailTemplateType {
    INVOICE = "invoice",
    WELCOME = "welcome",
    PASSWORD_RESET = "password_reset",
    ORDER_CONFIRMATION = "order_confirmation",
    OTP = "otp",
    FACTORY_CREATED = "factory_created"
}

export type MailTemplateValue = {
    subject: string
    htmlGenerate: (...args: any[]) => string
}

export type MailTemplateInvoice = {
    email: string
    orderId: string
    amount: number
}

export type MailTemplateWelcome = {
    name: string
}

export type MailTemplatePasswordReset = {
    resetLink: string
}

export type MailTemplateOrderConfirmation = {
    orderId: string
    trackingNumber: string
}

export type MailTemplateOtp = {
    otp: string
    expiresInMinutes: number
}

export type MailTemplateFactoryCreated = {
    factoryName: string
}

// Common template parts
const headerTemplate = `
<div style="background-color: #ffffff; padding: 20px 0; text-align: center; border-bottom: 1px solid #f0f0f0;">
  <img src="https://iili.io/3No3aiN.png" alt="GoodsDesign Logo" style="max-width: 200px; height: auto;">
</div>
`

const footerTemplate = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; color: #666666; font-size: 12px; text-align: center;">
  <p>© ${new Date().getFullYear()} GoodsDesign. All rights reserved.</p>
  <p>
    <a href="#" style="color: #4a6cf7; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
    <a href="#" style="color: #4a6cf7; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    <a href="#" style="color: #4a6cf7; text-decoration: none; margin: 0 10px;">Contact Us</a>
  </p>
  <div style="margin-top: 15px;">
    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://iili.io/3Nnmsh7.png" alt="Facebook" style="width: 30px; height: 30px;"></a>
    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://iili.io/3No2VnV.png" alt="Twitter" style="width: 30px; height: 30px;"></a>
    <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://iili.io/3No2WMB.png" alt="Instagram" style="width: 30px; height: 30px;"></a>
  </div>
  <p style="margin-top: 15px;">If you have any questions, please contact us at <a href="mailto:support@goodsdesign.com" style="color: #4a6cf7; text-decoration: none;">support@goodsdesign.com</a></p>
</div>
`

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GoodsDesign</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    ${headerTemplate}
    <div style="padding: 30px;">
      ${content}
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`

// Button style
const buttonStyle = `display: inline-block; background-color: #4a6cf7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 500; margin: 20px 0; text-align: center;`

export const MailTemplateMap: Record<MailTemplateType, MailTemplateValue> = {
    [MailTemplateType.INVOICE]: {
        subject: "Your GoodsDesign Invoice",
        htmlGenerate: ({ amount, orderId, email }: MailTemplateInvoice) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600;">Invoice Details</h1>
                <p>Dear Customer,</p>
                <p>Thank you for your recent purchase. Please find your invoice details below:</p>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #4a6cf7; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; width: 40%;"><strong>Order ID:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${orderId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Amount:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${amount.toLocaleString()} VND</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;"><strong>Email:</strong></td>
                            <td style="padding: 10px 0;">${email}</td>
                        </tr>
                    </table>
                </div>
                
                <p>If you have any questions about this invoice, please don't hesitate to contact our support team.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="${buttonStyle}">View Invoice Details</a>
                </div>
                
                <p style="margin-top: 30px;">Thank you for choosing GoodsDesign!</p>
                <p>Best regards,<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    },
    [MailTemplateType.WELCOME]: {
        subject: "Welcome to GoodsDesign!",
        htmlGenerate: ({ name }: MailTemplateWelcome) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600; text-align: center;">Welcome to GoodsDesign!</h1>
                
                <div style="text-align: center; margin: 30px 0;">
                    <img src="https://via.placeholder.com/300x200?text=Welcome" alt="Welcome" style="max-width: 100%; height: auto; border-radius: 8px;">
                </div>
                
                <p style="font-size: 18px; margin-bottom: 20px;">Hello ${name},</p>
                
                <p>We're thrilled to welcome you to the GoodsDesign community! Your account has been successfully created, and you're now ready to explore all the amazing features we offer.</p>
                
                <h2 style="color: #4a6cf7; margin-top: 30px; font-size: 18px;">What's Next?</h2>
                
                <ul style="padding-left: 20px; margin: 20px 0;">
                    <li style="margin-bottom: 10px;">Complete your profile to personalize your experience</li>
                    <li style="margin-bottom: 10px;">Explore our product catalog</li>
                    <li style="margin-bottom: 10px;">Check out our latest designs and collections</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="${buttonStyle}">Get Started</a>
                </div>
                
                <p>If you have any questions or need assistance, our support team is always here to help.</p>
                
                <p style="margin-top: 20px;">Welcome aboard!<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    },
    [MailTemplateType.PASSWORD_RESET]: {
        subject: "Reset Your GoodsDesign Password",
        htmlGenerate: ({ resetLink }: MailTemplatePasswordReset) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600;">Password Reset Request</h1>
                
                <p>Hello,</p>
                
                <p>We received a request to reset your password for your GoodsDesign account. If you didn't make this request, you can safely ignore this email.</p>
                
                <p>To reset your password, click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="${buttonStyle}">Reset Password</a>
                </div>
                
                <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
                <p style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px;">${resetLink}</p>
                
                <p style="margin-top: 20px;">This password reset link will expire in 24 hours.</p>
                
                <p style="margin-top: 30px;">If you need any assistance, please contact our support team.</p>
                
                <p>Best regards,<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    },
    [MailTemplateType.ORDER_CONFIRMATION]: {
        subject: "Your GoodsDesign Order Confirmation",
        htmlGenerate: ({ orderId, trackingNumber }: MailTemplateOrderConfirmation) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600;">Order Confirmation</h1>
                
                <p>Dear Customer,</p>
                
                <p>Thank you for your order! We're pleased to confirm that your order has been received and is being processed.</p>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #4a6cf7; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; width: 40%;"><strong>Order ID:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${orderId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;"><strong>Tracking Number:</strong></td>
                            <td style="padding: 10px 0;">${trackingNumber}</td>
                        </tr>
                    </table>
                </div>
                
                <p>You can track your order status using the tracking number above.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="${buttonStyle}">Track Your Order</a>
                </div>
                
                <h2 style="color: #4a6cf7; margin-top: 30px; font-size: 18px;">What's Next?</h2>
                
                <ol style="padding-left: 20px; margin: 20px 0;">
                    <li style="margin-bottom: 10px;">Your order is being prepared for shipment</li>
                    <li style="margin-bottom: 10px;">You'll receive a shipping confirmation email once your order is on its way</li>
                    <li style="margin-bottom: 10px;">Track your delivery using the tracking number provided</li>
                </ol>
                
                <p style="margin-top: 20px;">Thank you for shopping with GoodsDesign!</p>
                
                <p>Best regards,<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    },
    [MailTemplateType.OTP]: {
        subject: "Your GoodsDesign Verification Code",
        htmlGenerate: ({ otp, expiresInMinutes }: MailTemplateOtp) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600; text-align: center;">Verification Code</h1>
                
                <p>Hello,</p>
                
                <p>You've requested a verification code for your GoodsDesign account. Please use the code below to complete your verification:</p>
                
                <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #4a6cf7; font-family: monospace;">${otp}</div>
                </div>
                
                <p style="text-align: center; color: #666666; font-size: 14px;">This code will expire in <strong>${expiresInMinutes} minutes</strong>.</p>
                
                <p style="margin-top: 30px;">If you didn't request this code, please ignore this email or contact our support team if you believe this is suspicious activity.</p>
                
                <p style="margin-top: 20px;">Best regards,<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    },
    [MailTemplateType.FACTORY_CREATED]: {
        subject: "Your GoodsDesign Factory Has Been Created",
        htmlGenerate: ({ factoryName }: MailTemplateFactoryCreated) => {
            const content = `
                <h1 style="color: #333333; margin-bottom: 25px; font-weight: 600;">Factory Successfully Created</h1>
                
                <p>Congratulations!</p>
                
                <p>We're pleased to inform you that your factory <strong>${factoryName}</strong> has been successfully created in the GoodsDesign platform.</p>
                
                <div style="background-color: #f0f7ff; border-left: 4px solid #4a6cf7; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <h3 style="margin-top: 0; color: #4a6cf7;">Next Steps:</h3>
                    <p>Please complete your factory profile with all the necessary information to proceed with the admin approval process.</p>
                </div>
                
                <h2 style="color: #4a6cf7; margin-top: 30px; font-size: 18px;">Required Information:</h2>
                
                <ul style="padding-left: 20px; margin: 20px 0;">
                    <li style="margin-bottom: 10px;">Factory contact details</li>
                    <li style="margin-bottom: 10px;">Production capabilities</li>
                    <li style="margin-bottom: 10px;">Certification documents</li>
                    <li style="margin-bottom: 10px;">Sample products</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="${buttonStyle}">Complete Your Profile</a>
                </div>
                
                <p>Once your profile is complete, our admin team will review your information and approve your factory.</p>
                
                <p style="margin-top: 20px;">Welcome to the GoodsDesign manufacturing network!</p>
                
                <p>Best regards,<br>The GoodsDesign Team</p>
            `
            return baseTemplate(content)
        }
    }
}
