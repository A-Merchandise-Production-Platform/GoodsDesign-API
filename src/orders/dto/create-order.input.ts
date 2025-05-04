import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional } from "class-validator"
import { CreateOrderDetailInput } from "./create-order-detail.input"

@InputType()
export class CreateOrderInput {
    @Field(() => [CreateOrderDetailInput])
    @IsNotEmpty()
    orderDetails: CreateOrderDetailInput[]

    @Field(() => String, { nullable: true })
    @IsOptional()
    voucherId?: string

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    addressId: string
}
