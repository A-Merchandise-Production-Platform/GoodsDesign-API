import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { VouchersService } from "./vouchers.service"
import { Voucher } from "./entities/voucher.entity"
import {
    CreateVoucherInput,
    UpdateVoucherInput,
    GetUserVouchersInput,
    CreateVoucherForUserInput
} from "./dto"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { UserEntity } from "../users/entities/users.entity"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { Roles } from "@prisma/client"
import { AllowedRoles } from "../auth/decorators/roles.decorator"
import { RolesGuard } from "../auth/guards/roles.guard"

@Resolver(() => Voucher)
@UseGuards(GraphqlJwtAuthGuard, RolesGuard)
export class VouchersResolver {
    constructor(private readonly vouchersService: VouchersService) {}

    @Mutation(() => Voucher)
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER)
    createVoucher(
        @Args("createVoucherInput") createVoucherInput: CreateVoucherInput,
        @CurrentUser() currentUser: UserEntity
    ) {
        return this.vouchersService.create(createVoucherInput, currentUser)
    }

    @Mutation(() => Voucher)
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER)
    createVoucherForUser(
        @Args("createVoucherForUserInput") createVoucherForUserInput: CreateVoucherForUserInput,
        @CurrentUser() currentUser: UserEntity
    ) {
        return this.vouchersService.createVoucherForUser(createVoucherForUserInput, currentUser)
    }

    @Query(() => [Voucher], { name: "vouchers" })
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER)
    findAllVouchers() {
        return this.vouchersService.findAll()
    }

    @Query(() => [Voucher], { name: "userVouchers" })
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER, Roles.CUSTOMER, Roles.FACTORYOWNER, Roles.STAFF)
    getUserVouchers(
        @Args("getUserVouchersInput") getUserVouchersInput: GetUserVouchersInput,
        @CurrentUser() currentUser: UserEntity
    ) {
        // Check if current user is authorized to access this user's vouchers
        if (
            currentUser.role !== Roles.ADMIN &&
            currentUser.role !== Roles.MANAGER &&
            currentUser.id !== getUserVouchersInput.userId
        ) {
            throw new Error("You are not authorized to access these vouchers")
        }

        return this.vouchersService.getUserVouchers(getUserVouchersInput)
    }

    @Query(() => [Voucher], { name: "myVouchers" })
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER, Roles.CUSTOMER, Roles.FACTORYOWNER, Roles.STAFF)
    getMyVouchers(@CurrentUser() currentUser: UserEntity) {
        return this.vouchersService.getMyVouchers(currentUser.id)
    }

    @Query(() => Voucher, { name: "voucher" })
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER, Roles.CUSTOMER, Roles.FACTORYOWNER, Roles.STAFF)
    findOne(@Args("id", { type: () => String }) id: string) {
        return this.vouchersService.findOne(id)
    }

    @Mutation(() => Voucher)
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER)
    updateVoucher(
        @Args("updateVoucherInput") updateVoucherInput: UpdateVoucherInput,
        @CurrentUser() currentUser: UserEntity
    ) {
        return this.vouchersService.update(updateVoucherInput.id, updateVoucherInput, currentUser)
    }

    @Mutation(() => Voucher)
    @AllowedRoles(Roles.ADMIN, Roles.MANAGER)
    removeVoucher(
        @Args("id", { type: () => String }) id: string,
        @CurrentUser() currentUser: UserEntity
    ) {
        return this.vouchersService.remove(id, currentUser)
    }
}
