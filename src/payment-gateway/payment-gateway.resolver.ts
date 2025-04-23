import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/auth"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UserEntity } from "src/users"
import { PaymentGateway, PaymentGatewayService } from "./payment-gateway.service"

@Resolver()
@UseGuards(GraphqlJwtAuthGuard)
export class PaymentGatewayResolver {
    constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

    @Mutation(() => String)
    async createPayment(
        @Args("gateway") gateway: PaymentGateway,
        @Args("paymentId") paymentId: string,
        @CurrentUser() { id: userId }: UserEntity
    ) {
        switch (gateway) {
            case PaymentGateway.PAYOS:
                return this.paymentGatewayService.createPayOSPayment({
                    paymentId,
                    userId
                })
            case PaymentGateway.VNPAY:
                return this.paymentGatewayService.createVNPayPayment({
                    paymentId,
                    userId
                })
            default:
                throw new Error("Unsupported payment gateway")
        }
    }

    @Mutation(() => String)
    async processWithdrawal(
        @Args("paymentId") paymentId: string,
        @Args("imageUrls", { type: () => [String] }) imageUrls: string[],
        @Args("userBankId") userBankId: string,
    ) {
        return this.paymentGatewayService.processWithdrawal({
            paymentId,
            imageUrls,
            userBankId
        });
    }
}
