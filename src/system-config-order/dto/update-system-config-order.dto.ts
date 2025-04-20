import { Field, InputType, Float, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, Min, Max } from "class-validator"

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
} 