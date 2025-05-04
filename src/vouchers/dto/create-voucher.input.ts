import { InputType, Field, Int, registerEnumType } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

registerEnumType(VoucherType, {
    name: "VoucherType"
})

@InputType()
export class CreateVoucherInput {
    @Field(() => VoucherType)
    @IsEnum(VoucherType)
    @IsNotEmpty()
    type: VoucherType

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    value: number

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    minOrderValue?: number

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    maxDiscountValue?: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => Boolean, { defaultValue: false })
    @IsNotEmpty()
    @IsBoolean()
    isPublic: boolean

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    limitedUsage?: number

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    userId?: string
}
