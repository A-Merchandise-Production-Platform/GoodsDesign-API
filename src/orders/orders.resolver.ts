import { BadRequestException, UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/auth"
import { UserEntity } from "src/users"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { AddOrderProgressReportInput } from "./dto/add-order-progress-report.input"
import { CreateOrderInput } from "./dto/create-order.input"
import { DoneCheckQualityInput } from "./dto/done-check-quality.input"
import { FactoryScoreResponse } from "./dto/factory-scores.response"
import { FeedbackOrderInput } from "./dto/feedback-order.input"
import { CheckQualityEntity } from "./entities/check-quality.entity"
import { OrderDetailEntity } from "./entities/order-detail.entity"
import { OrderProgressReportEntity } from "./entities/order-progress-report.entity"
import { OrderEntity } from "./entities/order.entity"
import { OrdersService } from "./orders.service"

@Resolver(() => OrderEntity)
export class OrdersResolver {
    constructor(
        private readonly ordersService: OrdersService,
    ) {}

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    createOrder(
        @Args("createOrderInput") createOrderInput: CreateOrderInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.create(createOrderInput, user.id)
    }

    @Query(() => [OrderEntity], { name: "orders" })
    findAll() {
        return this.ordersService.findAll()
    }

    @Query(() => [OrderEntity], { name: "myOrders" })
    @UseGuards(GraphqlJwtAuthGuard)
    findMyOrders(@CurrentUser() user: UserEntity) {
        console.log("user", user)
        return this.ordersService.findByCustomerId(user.id)
    }

    @Query(() => [OrderEntity], { name: "factoryOrders" })
    @UseGuards(GraphqlJwtAuthGuard)
    findFactoryOrders(@CurrentUser() user: UserEntity) {
        return this.ordersService.findByMyFactoryId(user.id)
    }

    @Query(() => [OrderEntity], { name: "staffOrders" })
    @UseGuards(GraphqlJwtAuthGuard)
    findStaffOrders(@CurrentUser() user: UserEntity) {
        return this.ordersService.findByStaffId(user.id)
    }

    @Query(() => OrderEntity, { name: "order" })
    findOne(@Args("id", { type: () => String }) id: string) {
        return this.ordersService.findOne(id)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    acceptOrderForFactory(
        @Args("orderId", { type: () => String }) orderId: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.acceptOrderForFactory(orderId, user.id)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    rejectOrder(
        @Args("orderId", { type: () => String }) orderId: string,
        @Args("reason", { type: () => String }) reason: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.rejectOrder(orderId, user.id, reason)
    }

    @Mutation(() => OrderDetailEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    doneProductionOrderDetails(
        @Args("orderDetailId", { type: () => String }) orderDetailId: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.doneProductionOrderDetails(orderDetailId, user.id)
    }

    @Mutation(() => CheckQualityEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    doneCheckQuality(@Args("input") input: DoneCheckQualityInput, @CurrentUser() user: UserEntity) {
        return this.ordersService.doneCheckQuality(
            input.checkQualityId,
            user.id,
            input.passedQuantity,
            input.failedQuantity,
            input.note,
            input.imageUrls
        )
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    startRework(
        @Args("orderId", { type: () => String }) orderId: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.startRework(orderId, user.id)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    startReworkByManager(
        @Args("orderId", { type: () => String }) orderId: string,
    ) {
        return this.ordersService.startReworkByManager(orderId)
    }

    @Mutation(() => OrderDetailEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    doneReworkForOrderDetails(
        @Args("orderDetailId", { type: () => String }) orderDetailId: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.doneReworkForOrderDetails(orderDetailId, user.id)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    shippedOrder(@Args("orderId", { type: () => String }) orderId: string) {
        return this.ordersService.shippedOrder(orderId)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    changeOrderToShipping(@Args("orderId", { type: () => String }) orderId: string) {
        return this.ordersService.changeOrderToShipping(orderId)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    feedbackOrder(
        @Args("orderId", { type: () => String }) orderId: string,
        @Args("input") input: FeedbackOrderInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.feedbackOrder(orderId, user.id, input)
    }

    @Query(() => [OrderEntity], { name: "ordersByFactoryId" })
    @UseGuards(GraphqlJwtAuthGuard)
    getAllOrdersByFactoryId(@Args("factoryId", { type: () => String }) factoryId: string) {
        return this.ordersService.getAllOrdersByFactoryId(factoryId)
    }

    @Mutation(() => OrderProgressReportEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    addOrderProgressReport(
        @Args("input") input: AddOrderProgressReportInput,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.addOrderProgressReport(input.orderId, input.note, input.imageUrls)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    reassignNewStaffForOrder(
        @Args("orderId", { type: () => String }) orderId: string,
        @Args("newStaffId", { type: () => String }) newStaffId: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.reassignNewStaffForOrder(orderId, newStaffId)
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    createRefundForOrder(
        @Args("orderId", { type: () => String }) orderId: string,
        @Args("reason", { type: () => String }) reason: string,
        @CurrentUser() user: UserEntity
    ) {
        return this.ordersService.createRefundForOrder(orderId, reason);
    }

    @Mutation(() => OrderEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    assignFactoryToOrder(
        @Args('orderId', { type: () => String }) orderId: string,
        @Args('factoryId', { type: () => String }) factoryId: string,
        @CurrentUser() user: UserEntity
    ) {
        // Additional access control checks can be added here if necessary
        return this.ordersService.assignFactoryToOrder(orderId, factoryId);
    }

    @Query(() => [FactoryScoreResponse], { name: "factoryScoresForOrder" })
    getFactoryScoresForOrder(
        @Args("orderId", { type: () => String }) orderId: string,
    ) {
        return this.ordersService.calculateFactoryScoresForOrder(orderId);
    }
}
