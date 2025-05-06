import { Field, ObjectType, Int, Float } from "@nestjs/graphql"
import { VoucherEntity } from "src/vouchers/entities/voucher.entity"

@ObjectType()
export class OrderPriceDetailsResponse {
    @Field(() => Int)
    basePrice: number

    @Field(() => Float)
    discountPercentage: number

    @Field(() => Int)
    priceAfterDiscount: number

    @Field(() => VoucherEntity, { nullable: true })
    voucher?: VoucherEntity

    @Field(() => Int)
    priceAfterVoucher: number

    @Field(() => Int)
    shippingPrice: number

    @Field(() => Int)
    finalPrice: number
}
