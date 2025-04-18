import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

@InputType()
export class AddOrderProgressReportInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsUUID()
    orderId: string

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    note: string

    @Field(() => [String], { nullable: true })
    @IsOptional()
    imageUrls?: string[]
} 