import { Injectable } from "@nestjs/common"
import { NotificationEntity } from "src/notifications/entities/notification.entity"
import { PrismaService } from "src/prisma"
import { UserEntity } from "src/users"
import { NotificationsGateway } from "./notifications.gateway"
import { Roles } from "@prisma/client"

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsGateway: NotificationsGateway
    ) {}

    async findAll() {
        const notifications = await this.prisma.notification.findMany({
            include: {
                user: true
            }
        })
        return notifications.map(
            (notification) =>
                new NotificationEntity({
                    ...notification,
                    user: new UserEntity(notification.user)
                })
        )
    }

    async findAllByUserId(userId: string, isRead?: boolean) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId, isRead: isRead ?? undefined },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return notifications.map(
            (notification) =>
                new NotificationEntity({
                    ...notification,
                    user: new UserEntity(notification.user)
                })
        )
    }

    async findOne(id: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
            include: {
                user: true
            }
        })

        return new NotificationEntity({
            ...notification,
            user: new UserEntity(notification.user)
        })
    }

    async findByUserId(userId: string) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return notifications.map(
            (notification) =>
                new NotificationEntity({
                    ...notification,
                    user: new UserEntity(notification.user)
                })
        )
    }

    async create(data: {
        title: string
        content: string
        userId: string
        url?: string
        data?: any
    }) {
        const notification = await this.prisma.notification.create({
            data: {
                title: data.title,
                content: data.content,
                userId: data.userId,
                url: data.url,
                isRead: false
            },
            include: {
                user: true
            }
        })

        // Send real-time notification
        this.notificationsGateway.sendNotificationToUser(
            data.userId,
            new NotificationEntity({
                ...notification,
                user: new UserEntity(notification.user)
            })
        )

        return new NotificationEntity({
            ...notification,
            user: new UserEntity(notification.user)
        })
    }

    async createForManyUsers(data: {
        title: string
        content: string
        userIds: string[]
        url?: string
        data?: any
    }) {
        const notifications = await Promise.all(
            data.userIds.map((userId) =>
                this.prisma.notification.create({
                    data: {
                        title: data.title,
                        content: data.content,
                        userId,
                        url: data.url,
                        isRead: false
                    },
                    include: {
                        user: true
                    }
                })
            )
        )

        // Send real-time notifications to all users
        this.notificationsGateway.sendNotificationToUsers(
            data.userIds,
            notifications.map(
                (notification) =>
                    new NotificationEntity({
                        ...notification,
                        user: new UserEntity(notification.user)
                    })
            )
        )

        return notifications.map(
            (notification) =>
                new NotificationEntity({
                    ...notification,
                    user: new UserEntity(notification.user)
                })
        )
    }

    async markAsRead(id: string, userId: string) {
        const notification = await this.prisma.notification.update({
            where: {
                id,
                userId
            },
            data: { isRead: true },
            include: {
                user: true
            }
        })

        return new NotificationEntity({
            ...notification,
            user: new UserEntity(notification.user)
        })
    }

    async createForUsersByRoles(data: {
        title: string
        content: string
        roles: Roles[]
        url?: string
        data?: any
    }) {
        // Get all users with the specified roles
        const users = await this.prisma.user.findMany({
            where: {
                role: {
                    in: data.roles
                },
                isActive: true,
                isDeleted: false
            }
        })

        const userIds = users.map((user) => user.id)

        // Create notifications for all users
        const notifications = await Promise.all(
            userIds.map((userId) =>
                this.prisma.notification.create({
                    data: {
                        title: data.title,
                        content: data.content,
                        userId,
                        url: data.url,
                        isRead: false
                    },
                    include: {
                        user: true
                    }
                })
            )
        )

        // Send real-time notifications to all users
        this.notificationsGateway.sendNotificationToUsers(
            userIds,
            notifications.map(
                (notification) =>
                    new NotificationEntity({
                        ...notification,
                        user: new UserEntity(notification.user)
                    })
            )
        )

        return notifications.map(
            (notification) =>
                new NotificationEntity({
                    ...notification,
                    user: new UserEntity(notification.user)
                })
        )
    }
}
