import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateFactoryProgressReportDto {
  @Field(() => String, { description: 'The ID of the factory order this report belongs to' })
  @IsNotEmpty()
  factoryOrderId: string;

  @Field(() => Number, { description: 'The quantity of items completed in this progress report' })
  @IsNumber()
  @Min(0, { message: 'Completed quantity cannot be negative' })
  completedQty: number;

  @Field(() => Date, { description: 'The date when this progress report was created' })
  @IsDate()
  estimatedCompletion: Date;

  @Field(() => String, { nullable: true, description: 'Additional notes about the progress' })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field(() => [String], { description: 'Array of URLs to photos documenting the progress' })
  @IsArray()
  @IsString({ each: true })
  photoUrls: string[];
} 