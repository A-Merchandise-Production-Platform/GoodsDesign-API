import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class SystemConfigBank {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  bin: string;

  @Field(() => String)
  shortName: string;

  @Field(() => String)
  logo: string;

  @Field(() => Boolean)
  transferSupported: boolean;

  @Field(() => Boolean)
  lookupSupported: boolean;

  @Field(() => Int)
  support: number;

  @Field(() => Boolean)
  isTransfer: boolean;

  @Field(() => String, { nullable: true })
  swiftCode?: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Boolean)
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  updatedBy?: string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => String, { nullable: true })
  deletedBy?: string;
}