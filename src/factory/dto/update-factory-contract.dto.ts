import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional } from "class-validator";

@InputType({ description: "Update factory contract input" })
export class UpdateFactoryContractDto {
    @Field(() => String)
    @IsString()
    contractNumber: string;

    @Field(() => String)
    @IsString()
    effectiveDate: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    expirationDate?: string;

    @Field(() => Number)
    @IsNumber()
    productionCommitment: number;

    @Field(() => Number)
    @IsNumber()
    qualityThreshold: number;

    @Field(() => Number)
    @IsNumber()
    responseTimeLimit: number;

    @Field(() => Number)
    @IsNumber()
    productionCostPerUnit: number;

    @Field(() => Number)
    @IsNumber()
    paymentTerm: number;
}