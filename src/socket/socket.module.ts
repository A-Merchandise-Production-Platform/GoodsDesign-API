import { Module } from "@nestjs/common";
import { DefaultModule } from "./default";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
    imports: [
        // DefaultModule, 
        NotificationsModule],
})
export class SocketModule { }
