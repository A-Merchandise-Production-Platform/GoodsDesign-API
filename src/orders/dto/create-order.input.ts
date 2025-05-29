import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsArray, IsString } from "class-validator"
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

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    evaluationCriteriaIds?: string[];
}
