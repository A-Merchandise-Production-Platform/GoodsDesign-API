import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UploadDto {
    @IsOptional()
    @Field(() => GraphQLUpload, { nullable: true })
        image: FileUpload;
}