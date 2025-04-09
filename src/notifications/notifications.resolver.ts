import { UseGuards, ForbiddenException } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { NotificationsService } from "./notifications.service"
import { NotificationEntity } from "./entities/notification.entity"
import { GraphqlJwtAuthGuard } from "src/auth/guards"
import { CurrentUser } from "src/auth/decorators"
import { UserEntity } from "src/users"
import { Roles } from "@prisma/client"

@Resolver(() => NotificationEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class NotificationsResolver {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Query(() => [NotificationEntity], { name: "notifications" })
    async findAll(@CurrentUser() user: UserEntity) {
        return this.notificationsService.findAll()
    }

    @Query(() => [NotificationEntity], { name: "notificationsByUserId" })
    async findAllByUserId(
        @CurrentUser() user: UserEntity,
        @Args("isRead", { nullable: true }) isRead?: boolean
    ) {
        return this.notificationsService.findAllByUserId(user.id, isRead)
    }

    @Query(() => NotificationEntity, { name: "notification" })
    async findOne(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.notificationsService.findOne(id)
    }

    @Query(() => [NotificationEntity], { name: "myNotifications" })
    async findByUserId(@CurrentUser() user: UserEntity) {
        return this.notificationsService.findByUserId(user.id)
    }

    @Mutation(() => NotificationEntity, { name: "createNotification" })
    async create(
        @CurrentUser() user: UserEntity,
        @Args("title") title: string,
        @Args("content") content: string,
        @Args("userId") userId: string,
        @Args("url", { nullable: true }) url?: string
    ) {
        return this.notificationsService.create({
            title,
            content,
            userId,
            url
        })
    }

    @Mutation(() => [NotificationEntity], { name: "createNotificationForManyUsers" })
    async createForManyUsers(
        @CurrentUser() user: UserEntity,
        @Args("title") title: string,
        @Args("content") content: string,
        @Args("userIds", { type: () => [String] }) userIds: string[],
        @Args("url", { nullable: true }) url?: string
    ) {
        return this.notificationsService.createForManyUsers({
            title,
            content,
            userIds,
            url
        })
    }

    @Mutation(() => NotificationEntity, { name: "markNotificationAsRead" })
    async markAsRead(@CurrentUser() user: UserEntity, @Args("id") id: string) {
        return this.notificationsService.markAsRead(id, user.id)
    }

    @Mutation(() => [NotificationEntity], { name: "createNotificationForUsersByRoles" })
    async createForUsersByRoles(
        @CurrentUser() user: UserEntity,
        @Args("title") title: string,
        @Args("content") content: string,
        @Args("roles", { type: () => [String] }) roles: string[],
        @Args("url", { nullable: true }) url?: string
    ) {
        if (user.role !== Roles.ADMIN && user.role !== Roles.MANAGER) {
            throw new ForbiddenException(
                "You are not authorized to send notifications to users by roles"
            )
        }

        return this.notificationsService.createForUsersByRoles({
            title,
            content,
            roles: roles as Roles[],
            url
        })
    }
}
