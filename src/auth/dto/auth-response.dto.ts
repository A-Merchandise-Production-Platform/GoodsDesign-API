import { Field, ObjectType } from "@nestjs/graphql"
import { UserEntity } from "src/users/entities/users.entity"

@ObjectType({ description: "Authentication response" })
export class AuthResponseDto {
    @Field(() => UserEntity)
    user: UserEntity

    @Field(() => String)
    accessToken: string

    @Field(() => String)
    refreshToken: string

    constructor(user: UserEntity, accessToken: string, refreshToken: string) {
        this.user = user
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}
