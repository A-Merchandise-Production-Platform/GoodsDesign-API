import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FormattedAddressModel {
    @Field(() => String)
    text: string
}
