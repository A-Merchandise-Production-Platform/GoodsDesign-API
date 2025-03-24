import { Field, InputType, Int } from "@nestjs/graphql"
import { IsString, IsOptional, IsDate, IsInt, IsArray, IsBoolean } from "class-validator"

@InputType({ description: "Update factory information input" })
export class UpdateFactoryInfoDto {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    businessLicenseUrl?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    taxIdentificationNumber?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    addressId?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    website?: string

    @Field(() => Date, { nullable: true })
    @IsDate()
    @IsOptional()
    establishedDate?: Date

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    totalEmployees?: number

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    maxPrintingCapacity?: number

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    qualityCertifications?: string

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    printingMethods?: string[]

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    specializations?: string[]

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    contactPersonName?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    contactPersonRole?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    contactPersonPhone?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    operationalHours?: string

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    leadTime?: number

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    minimumOrderQuantity?: number

    @Field(() => Boolean, {
        nullable: true,
        description: "Set to true to submit factory information for approval"
    })
    @IsBoolean()
    @IsOptional()
    submit?: boolean

    constructor(partial: Partial<UpdateFactoryInfoDto>) {
        Object.assign(this, partial)
    }
}
