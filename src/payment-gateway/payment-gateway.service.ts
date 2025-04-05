import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common"
import { registerEnumType } from "@nestjs/graphql"
import PayOS from "@payos/node"
import {
    CheckoutRequestType,
    CheckoutResponseDataType,
    WebhookDataType,
    WebhookType
} from "@payos/node/lib/type"
import { PaymentMethod, PaymentStatus, TransactionStatus, TransactionType } from "@prisma/client"
import { envConfig } from "src/dynamic-modules"
import { MailService } from "src/mail"
import { PrismaService } from "src/prisma"

export enum PaymentGateway {
    PAYOS = "PAYOS",
    VNPAY = "VNPAY"
}

registerEnumType(PaymentGateway, {
    name: "PaymentGateway",
    description: "Payment gateway"
})

export interface VNPayQueryParams {
    vnp_Amount: string
    vnp_BankCode: string
    vnp_BankTranNo: string
    vnp_CardType: string
    vnp_OrderInfo: string
    vnp_PayDate: string
    vnp_ResponseCode: string
    vnp_TmnCode: string
    vnp_TransactionNo: string
    vnp_TransactionStatus: string
    vnp_TxnRef: string
}

@Injectable()
export class PaymentGatewayService implements OnModuleInit {
    private readonly payOS: PayOS

    constructor(
        private prisma: PrismaService,
        private mailService: MailService
    ) {
        this.payOS = new PayOS(
            envConfig().payment.payos.clientId,
            envConfig().payment.payos.apiKey,
            envConfig().payment.payos.checksumKey
        )
    }

    async onModuleInit() {
        console.log("PaymentGatewayService initialized")

        //find 1 paymentId
        // const payment = await this.prisma.payment.findFirst({
        // });

        // if (payment) {
        //   const vnpUrl = await this.createVNPayPayment({
        //     paymentId: payment.id,
        //     userId: payment.customerId,
        //   });
        // }
    }

    async createPayOSPayment(paymentData: { paymentId: string; userId: string }) {
        const payment = await this.prisma.payment.findFirst({
            where: { id: paymentData.paymentId }
        })

        if (!payment) {
            throw new NotFoundException("Payment not found")
        }

        //gen number 6 digits By date
        const orderCode = new Date().getTime().toString().slice(-6)

        const paymentTransaction = await this.prisma.paymentTransaction.create({
            data: {
                paymentId: payment.id,
                amount: payment.amount,
                status: TransactionStatus.PENDING,
                paymentMethod: PaymentMethod.PAYOS,
                transactionLog: `Payment transaction for paymentId_${payment.id}`,
                customerId: payment.customerId,
                type: TransactionType.PAYMENT,
                paymentGatewayTransactionId: orderCode,
                createdAt: new Date()
            }
        })

        const createPaymentLinkRequest: CheckoutRequestType = {
            amount: payment.amount,
            orderCode: parseInt(orderCode),
            description: `Payment for ${orderCode}`,
            cancelUrl: envConfig().payment.payos.cancelUrl,
            returnUrl: envConfig().payment.payos.returnUrl
        }

        const checkoutResponse: CheckoutResponseDataType =
            await this.payOS.createPaymentLink(createPaymentLinkRequest)

        return checkoutResponse.checkoutUrl
    }

    async createVNPayPayment(paymentData: { paymentId: string; userId: string }): Promise<string> {
        const tmnCode = envConfig().payment.vnpay.tmnCode
        const hashSecret = envConfig().payment.vnpay.hashSecret
        const vnpUrl = envConfig().payment.vnpay.vnpUrl
        const returnUrl = envConfig().payment.vnpay.returnUrl
        const version = envConfig().payment.vnpay.version

        // Create payment transaction
        const date = new Date()

        //yyyyMMddHHmmss
        const createDate =
            date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, "0") +
            date.getDate().toString().padStart(2, "0") +
            date.getHours().toString().padStart(2, "0") +
            date.getMinutes().toString().padStart(2, "0") +
            date.getSeconds().toString().padStart(2, "0")

        //15mins
        const expiredDate = new Date(date.getTime() + 15 * 60 * 1000)
        const expiredDateStr =
            expiredDate.getFullYear().toString() +
            (expiredDate.getMonth() + 1).toString().padStart(2, "0") +
            expiredDate.getDate().toString().padStart(2, "0") +
            expiredDate.getHours().toString().padStart(2, "0") +
            expiredDate.getMinutes().toString().padStart(2, "0") +
            expiredDate.getSeconds().toString().padStart(2, "0")

        //Find payment by paymentId
        const payment = await this.prisma.payment.findFirst({
            where: { id: paymentData.paymentId }
        })

        if (!payment) {
            throw new Error("Payment not found")
        }

        //create payment transaction
        const paymentTransaction = await this.prisma.paymentTransaction.create({
            data: {
                paymentId: payment.id,
                amount: payment.amount,
                status: TransactionStatus.PENDING,
                paymentMethod: PaymentMethod.VNPAY,
                transactionLog: `Payment transaction for paymentId_${payment.id}`,
                customerId: payment.customerId,
                type: TransactionType.PAYMENT,
                paymentGatewayTransactionId: "",
                createdAt: new Date()
            }
        })

        const orderId = paymentTransaction.id
        const amount = payment.amount
        const bankCode = "NCB"

        const orderInfo = `PaymentForPaymentId_${orderId}`
        const orderType = "other"
        const locale = "vn"
        const currCode = "VND"

        const ipAddr = "127.0.0.1"

        const vnpParams: Record<string, string> = {
            vnp_Version: version,
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_BankCode: bankCode,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: orderType,
            vnp_Amount: (amount * 100).toString(),
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        }
        console.log(vnpParams)

        // Sort parameters alphabetically
        const sortedParams = Object.keys(vnpParams)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = vnpParams[key]
                    return acc
                },
                {} as Record<string, string>
            )

        // Create signature
        const signData = new URLSearchParams(sortedParams).toString()
        const crypto = require("crypto")
        const hmac = crypto.createHmac("sha512", hashSecret)
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

        // Add signature to params
        sortedParams["vnp_SecureHash"] = signed

        // Create final URL
        const url = `${vnpUrl}?${new URLSearchParams(sortedParams).toString()}`

        //result
        console.log("VNPay payment created link", url)
        return url
    }

    async verifyPayment(gateway: PaymentGateway, paymentData: any) {
        switch (gateway) {
            case PaymentGateway.PAYOS:
                return this.verifyPayOSPayment(paymentData)
            case PaymentGateway.VNPAY:
                return this.verifyVNPayPayment(paymentData)
            default:
                throw new Error("Unsupported payment gateway")
        }
    }

    public async verifyPayOSPayment(webhook: WebhookType) {
        //check signature
        const webhookData: WebhookDataType = this.payOS.verifyPaymentWebhookData(webhook)

        const paymentTransaction = await this.prisma.paymentTransaction.findFirst({
            where: { paymentGatewayTransactionId: webhookData.orderCode.toString() }
        })

        if (!paymentTransaction) {
            throw new Error("Payment transaction not found")
        }

        if (webhookData.code === "00") {
            await this.prisma.payment.update({
                where: { id: paymentTransaction.paymentId },
                data: { status: PaymentStatus.COMPLETED }
            })

            await this.prisma.paymentTransaction.update({
                where: { id: paymentTransaction.id },
                data: { status: TransactionStatus.COMPLETED }
            })

            //get customer email
            const customer = await this.prisma.user.findFirst({
                where: { id: paymentTransaction.customerId }
            })

            if (!customer) {
                throw new Error("Customer not found")
            }

            await this.mailService.sendInvoiceEmail({
                to: customer.email,
                orderId: paymentTransaction.id,
                amount: paymentTransaction.amount
            })
        } else {
            await this.prisma.paymentTransaction.update({
                where: { id: paymentTransaction.id },
                data: { status: TransactionStatus.FAILED }
            })
        }

        return {
            message: "success"
        }
    }

    async verifyVNPayPayment(query: VNPayQueryParams) {
        const vnpParams = { ...query }
        const secureHash = vnpParams["vnp_SecureHash"]

        delete vnpParams["vnp_SecureHash"]

        // Sort parameters alphabetically
        const sortedParams = Object.keys(vnpParams)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = vnpParams[key]
                    return acc
                },
                {} as Record<string, string>
            )

        console.log("sortedParams", sortedParams)

        const hashSecret = envConfig().payment.vnpay.hashSecret
        const signData = new URLSearchParams(sortedParams).toString()
        const crypto = require("crypto")
        const hmac = crypto.createHmac("sha512", hashSecret)
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

        console.log("signed", signed)
        console.log("secureHash", secureHash)

        if (secureHash === signed) {
            const transactionId = vnpParams["vnp_TxnRef"]
            const rspCode = vnpParams["vnp_ResponseCode"]

            //find payment by transactionId
            const payment = await this.prisma.paymentTransaction.findFirst({
                where: { id: transactionId }
            })

            if (!payment) {
                return { RspCode: "98", Message: "Payment not found" }
            }

            // Update payment status in database
            if (rspCode === "00") {
                await this.prisma.payment.update({
                    where: { id: payment.paymentId },
                    data: { status: PaymentStatus.COMPLETED }
                })
                //update payment transaction
                await this.prisma.paymentTransaction.update({
                    where: { id: transactionId },
                    data: { status: TransactionStatus.COMPLETED }
                })

                //get customer email
                const customer = await this.prisma.user.findFirst({
                    where: { id: payment.customerId }
                })

                if (!customer) {
                    throw new Error("Customer not found")
                }

                await this.mailService.sendInvoiceEmail({
                    to: customer.email,
                    orderId: payment.id,
                    amount: payment.amount
                })

                await this.prisma.paymentTransaction.update({
                    where: { id: transactionId },
                    data: { status: TransactionStatus.COMPLETED }
                })
            }

            return { RspCode: "00", Message: "success" }
        } else {
            return { RspCode: "97", Message: "Fail checksum" }
        }
    }
}
