import { Query, Resolver, Args, registerEnumType, Mutation } from "@nestjs/graphql"
import { UserFilter, PaginatedUsers } from "./models/user.model"
import { UsersService } from "./users.service"
import { Roles } from "@prisma/client"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { CreateUserDto } from "./dto"
import { UserEntity } from "./entities/users.entity"

registerEnumType(Roles, {
    name: "Roles",
    description: "User roles"
})

@Resolver(() => UserEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(() => PaginatedUsers, { name: "users" })
    async getUsers(
        @CurrentUser() user: UserEntity,
        @Args("filter", { nullable: true }) filter?: UserFilter
    ): Promise<PaginatedUsers> {
        const result = await this.usersService.findAll(user, filter)
        return {
            items: result.items,
            meta: result.meta
        }
    }

    @Query(() => UserEntity, { name: "user" })
    async getUser(
        @CurrentUser() currentUser: UserEntity,
        @Args("id") id: string
    ): Promise<UserEntity> {
        return this.usersService.findOne(id, currentUser)
    }

    @Query(() => UserEntity, { name: "userAnalytics" })
    async getUserAnalytics(@CurrentUser() currentUser: UserEntity) {
        return this.usersService.getUserAnalytics(currentUser)
    }
}
