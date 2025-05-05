import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class Otp {
    @Field(() => String)
    email: string

    @Field(() => String)
    code: string

    constructor(partial: Partial<Otp>) {
        Object.assign(this, partial)
    }
}
