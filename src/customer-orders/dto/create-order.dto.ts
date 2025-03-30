import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"
import { CreateOrderDetailDto } from "./create-order-detail.dto"

@InputType()
export class CreateOrderDto {
    // @Field(() => Int)
    // @IsNotEmpty()
    // @IsNumber()
    // @Min(0)
    // shippingPrice: number

    // @Field(() => String)
    // @IsNotEmpty()
    // @IsString()
    // addressId: string

    @Field(() => [CreateOrderDetailDto])
    @IsNotEmpty()
    orderDetails: CreateOrderDetailDto[]
}
