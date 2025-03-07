import { Query, Resolver, Args, registerEnumType } from "@nestjs/graphql"
import { GraphQLUser, UserFilter, PaginatedUsers } from "./models/user.model"
import { UsersService } from "./users.service"
import { Roles, User } from "@prisma/client"
import { Auth, JwtAuthGuard } from "src/auth"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"

registerEnumType(Roles, {
    name: "Roles",
    description: "User roles"
})

@Resolver(() => GraphQLUser)
@UseGuards(GraphqlJwtAuthGuard)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(() => PaginatedUsers, { name: "users" })
    async getUsers(
        @CurrentUser() user: User,
        @Args("filter", { nullable: true }) filter?: UserFilter
    ): Promise<PaginatedUsers> {
        const result = await this.usersService.findAll(user, filter)
        return {
            items: result.items.map((user) => new GraphQLUser(user)),
            meta: result.meta
        }
    }
}
