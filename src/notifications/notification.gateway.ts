import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationDto } from './notification.dto';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendNotification')
  handleSendNotification(@MessageBody() notification: NotificationDto): void {
    this.server.emit('receiveNotification', notification);
  }
}