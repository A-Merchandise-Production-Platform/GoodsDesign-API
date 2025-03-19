import { UseGuards } from "@nestjs/common"
import { Query, registerEnumType, Resolver, Args, Mutation } from "@nestjs/graphql"
import { Roles } from "@prisma/client"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UserEntity } from "./entities/users.entity"
import { UsersService } from "./users.service"
import { CreateUserDto } from "src/users/dto/create-user.dto"
import { UpdateUserDto } from "src/users/dto/update-user.dto"

registerEnumType(Roles, {
    name: "Roles",
    description: "User roles"
})

@Resolver(() => UserEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(() => [UserEntity], { name: "users" })
    async getUsers(@CurrentUser() user: UserEntity) {
        return this.usersService.findAll(user)
    }

    @Query(() => UserEntity, { name: "user" })
    async getUser(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.usersService.findOne(id, user)
    }

    @Mutation(() => UserEntity, { name: "createUser" })
    async createUser(
        @CurrentUser() user: UserEntity,
        @Args("createUserInput") createUserInput: CreateUserDto
    ) {
        return this.usersService.create(createUserInput, user)
    }

    @Mutation(() => UserEntity, { name: "updateUser" })
    async updateUser(
        @CurrentUser() user: UserEntity,
        @Args("updateUserInput") updateUserInput: UpdateUserDto,
        @Args("id") id: string
    ) {
        return this.usersService.update(id, updateUserInput, user)
    }

    @Mutation(() => UserEntity, { name: "deleteUser" })
    async deleteUser(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.usersService.remove(id, user)
    }
}
