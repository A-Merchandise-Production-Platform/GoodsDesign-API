import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString } from "class-validator"

@InputType()
export class CreateOrderDetailDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    cartItemId: string
}
