import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsObject, IsOptional, IsBoolean, IsDateString } from "class-validator";
import { RegisterDto } from "./register.dto";

@InputType({ description: "Factory information input" })
class FactoryInformationInput {
    @Field(() => String)
    @IsString()
    factoryName: string;

    @Field(() => String)
    @IsString()
    factoryAddress: string;

    @Field(() => String)
    @IsString()
    businessLicenseNumber: string;

    @Field(() => String)
    @IsString()
    taxIdentificationNumber: string;

    @Field(() => String)
    @IsString()
    factoryPhoneNumber: string;

    @Field(() => String)
    @IsString()
    factoryEmail: string;
}

@InputType({ description: "Register factory owner input" })
export class RegisterFactoryOwnerDto extends RegisterDto {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @Field(() => Boolean, { nullable: true, defaultValue: false })
    @IsBoolean()
    @IsOptional()
    gender?: boolean;

    @Field(() => String, { nullable: true })
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @Field(() => FactoryInformationInput)
    @IsObject()
    factoryInformation: FactoryInformationInput;
}