import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import Decimal from 'decimal.js';

@Scalar('Decimal')
export class DecimalScalar implements CustomScalar<string, Decimal> {
  description = 'Decimal custom scalar type';

  parseValue(value: string): Decimal {
    return new Decimal(value); // value from the client
  }

  serialize(value: Decimal): string {
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Decimal {
    if (ast.kind === Kind.STRING) {
      return new Decimal(ast.value);
    }
    return null;
  }
}