import { ObjectType, Field, ID } from '@nestjs/graphql';
import { JsonScalar } from '../../common/scalars/json.scalar';
import Decimal from 'decimal.js';
import { DecimalScalar } from '../../common/scalars/decimal.scalar';

@ObjectType()
export class BlankVariance {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field(() => JsonScalar)
  information: any;

  @Field(() => DecimalScalar)
  blankPrice: Decimal;
}