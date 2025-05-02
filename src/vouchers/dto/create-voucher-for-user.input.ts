import { InputType, Field, Int, Float } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

@InputType()
export class CreateVoucherForUserInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    code?: string // Optional - system can generate if not provided

    @Field(() => VoucherType)
    @IsEnum(VoucherType)
    type: VoucherType

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    value: number

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderValue?: number

    @Field(() => Date)
    @IsDate()
    startDate: Date

    @Field(() => Date)
    @IsDate()
    endDate: Date

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    userId: string
}
