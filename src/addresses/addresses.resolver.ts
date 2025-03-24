import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "src/auth"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { UserEntity } from "src/users"
import { AddressesService } from "./addresses.service"
import { CreateAddressInput } from "./dto/create-address.input"
import { UpdateAddressInput } from "./dto/update-address.input"
import { AddressEntity } from "./entities/address.entity"

@Resolver(() => AddressEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class AddressesResolver {
    constructor(private readonly addressesService: AddressesService) {}

    @Mutation(() => AddressEntity)
    async createAddress(
        @Args("createAddressInput") createAddressInput: CreateAddressInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.addressesService.createAddress(createAddressInput, user)
    }

    @Query(() => [AddressEntity])
    async addresses(@CurrentUser() user: UserEntity) {
        console.log(user)
        return this.addressesService.getAddresses(user)
    }

    @Query(() => AddressEntity)
    async address(@Args("id") id: string, @CurrentUser() user: UserEntity) {
        return this.addressesService.getAddress(id, user)
    }

    @Mutation(() => AddressEntity)
    async updateAddress(
        @Args("id") id: string,
        @Args("updateAddressInput") updateAddressInput: UpdateAddressInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.addressesService.updateAddress(id, updateAddressInput, user)
    }

    @Mutation(() => AddressEntity)
    async deleteAddress(@Args("id") id: string, @CurrentUser() user: UserEntity) {
        return this.addressesService.deleteAddress(id, user)
    }
}
