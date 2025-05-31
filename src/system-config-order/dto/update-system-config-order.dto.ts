import { Field, InputType, Float, Int, registerEnumType } from "@nestjs/graphql"
import { VoucherType } from "@prisma/client"
import { IsNotEmpty, IsNumber, Min, Max, IsEnum } from "class-validator"

registerEnumType(VoucherType, {
    name: "VoucherType",
    description: "The type of voucher"
})

@InputType()
export class UpdateSystemConfigOrderDto {
    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    limitFactoryRejectOrders?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    checkQualityTimesDays?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    limitReworkTimes?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    shippingDays?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    reduceLegitPointIfReject?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    legitPointToSuspend?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    acceptHoursForFactory?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    maxLegitPoint?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    maxProductionTimeInMinutes?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    maxProductionCapacity?: number

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @Min(0)
    @Max(1)
    capacityScoreWeight?: number

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @Min(0)
    @Max(1)
    leadTimeScoreWeight?: number

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @Min(0)
    @Max(1)
    specializationScoreWeight?: number

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @Min(0)
    @Max(1)
    legitPointScoreWeight?: number

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @Min(0)
    @Max(1)
    productionCapacityScoreWeight?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    voucherBaseValueForRefund?: number

    @Field(() => VoucherType, { nullable: true })
    @IsEnum(VoucherType)
    voucherBaseTypeForRefund?: VoucherType

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    voucherBaseLimitedUsage?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    voucherBaseMaxDiscountValue?: number

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    maxEvaluationCriteria?: number
}
