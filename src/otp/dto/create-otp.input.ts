import { InputType, Int, Field } from "@nestjs/graphql"

@InputType()
export class CreateOtpInput {
    @Field(() => String)
    email: string
}
