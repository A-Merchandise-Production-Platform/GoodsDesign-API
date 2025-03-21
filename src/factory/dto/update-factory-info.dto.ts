import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType({ description: "Update factory information input" })
export class UpdateFactoryInfoDto {
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