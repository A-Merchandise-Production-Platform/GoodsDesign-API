import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "src/users/entities/users.entity";

@ObjectType()
class FactoryContract {
    @Field(() => String)
    contractNumber: string;

    @Field(() => String)
    effectiveDate: string;

    @Field(() => String, { nullable: true })
    expirationDate?: string;

    @Field(() => Number)
    productionCommitment: number;

    @Field(() => Number)
    qualityThreshold: number;

    @Field(() => Number)
    responseTimeLimit: number;

    @Field(() => Number)
    productionCostPerUnit: number;

    @Field(() => Number)
    paymentTerm: number;
}

@ObjectType()
class FactoryInformation {
    @Field(() => String)
    factoryName: string;

    @Field(() => String)
    factoryAddress: string;

    @Field(() => String)
    businessLicenseNumber: string;

    @Field(() => String)
    taxIdentificationNumber: string;

    @Field(() => String)
    factoryPhoneNumber: string;

    @Field(() => String)
    factoryEmail: string;

    @Field(() => String)
    createdAt: string;
}

@ObjectType()
export class FactoryEntity {
    @Field(() => ID)
    factoryOwnerId: string;

    @Field(() => FactoryInformation)
    information: FactoryInformation;

    @Field(() => FactoryContract)
    contract: FactoryContract;

    @Field(() => UserEntity)
    owner?: UserEntity;
}