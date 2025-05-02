import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class GetUserVouchersInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    userId: string

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    activeOnly?: boolean
}
