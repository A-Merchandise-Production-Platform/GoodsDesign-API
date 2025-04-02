// src/notifications/notifications.gateway.ts
import { Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { NoExpiredJwtStrategy } from "src/auth/strategies/no-expired-jwt.strategies"
import { PrismaService } from "src/prisma"

@WebSocketGateway({
    cors: {
        origin: "*"
    },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger: Logger = new Logger("NotificationsGateway")
    private connectedClients: Map<string, { socket: Socket; userId: string }> = new Map()
    private noExpiredJwtStrategy: NoExpiredJwtStrategy

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {
        this.noExpiredJwtStrategy = new NoExpiredJwtStrategy(prisma)
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token
            if (!token) {
                client.disconnect()
                return
            }

            const user = await this.noExpiredJwtStrategy.validate({
                sub: this.jwtService.decode(token)?.sub as string
            })

            if (!user) {
                client.disconnect()
                return
            }

            this.logger.log(`Client connected: ${client.id} (User: ${user.id})`)
            this.connectedClients.set(client.id, { socket: client, userId: user.id })
            client.join(user.id)
        } catch (error) {
            this.logger.error(`Connection error: ${error.message}`)
            client.disconnect()
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.connectedClients.delete(client.id)
    }

    sendNotificationToAll(payload: any) {
        this.server.emit("notification", payload)
    }

    sendNotificationToUser(userId: string, payload: any) {
        this.server.to(userId).emit("notification", payload)
    }

    sendNotificationToUsers(userIds: string[], payload: any) {
        userIds.forEach((userId) => {
            this.server.to(userId).emit("notification", payload)
        })
    }

    @SubscribeMessage("markAsRead")
    async handleMarkAsRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() notificationId: string
    ) {
        const clientInfo = this.connectedClients.get(client.id)
        if (!clientInfo) {
            return { success: false, message: "Not authenticated" }
        }

        try {
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true }
            })
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
}
