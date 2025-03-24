import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, Min } from "class-validator"
import { CreateOrderDetailDto } from "./create-order-detail.dto"

@InputType()
export class CreateOrderDto {
    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    shippingPrice: number

    @Field(() => [CreateOrderDetailDto])
    @IsNotEmpty()
    orderDetails: CreateOrderDetailDto[]
}
