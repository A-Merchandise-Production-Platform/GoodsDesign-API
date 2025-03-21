import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNumber, Min } from "class-validator"

@InputType()
export class UpdateCartItemDto {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    quantity: number
}
