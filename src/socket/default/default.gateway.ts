import { Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets"
import { instrument } from "@socket.io/admin-ui"
import { createServer } from "http"
import { Namespace, Server, Socket } from "socket.io"
import { NAMESPACE } from "./constant"

@WebSocketGateway({
    namespace: NAMESPACE,
    transports: ['websocket', 'polling'],
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly logger = new Logger(DefaultGateway.name)
    private readonly httpServer = createServer()
    private readonly io: Server

    constructor() {
        this.io = new Server(this.httpServer, {
            cors: {
                origin: "*",
                credentials: true
            },
            transports: ['websocket', 'polling'],
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`)
    }

    handleConnection(client: Socket) {
        this.logger.debug(`Client connected: ${client.id}`)
    }

    @WebSocketServer()
    private readonly server: Server
    private readonly namespace: Namespace

    afterInit() {
        this.logger.verbose(
            `Initialized gateway with name: ${DefaultGateway.name}, namespace: ${NAMESPACE}`
        )

        // Initialize the admin UI with the created io instance
        instrument(this.io, {
            auth: false,
            mode: "development",
        });
    }
    
    // for testing
    @SubscribeMessage("ping")
    handlePing(): WsResponse<string> {
        this.logger.debug("Received ping")
        return {
            event: "ping",
            data: "pong"
        }
    }

    //cron job - send message to all clients
    @Cron(CronExpression.EVERY_SECOND)
    handleCron() {
        this.logger.debug("Cron job executed")
        this.server.emit("message", "Hello from the server")
    }
}
