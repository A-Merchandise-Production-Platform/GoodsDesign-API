import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Json')
export class JsonScalar implements CustomScalar<string, any> {
  description = 'Json custom scalar type';

  parseValue(value: any): any {
    return value; // value from the client
  }

  serialize(value: any): any {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }
    return null;
  }
}