import { Module } from "@nestjs/common";
import { DefaultModule } from "./default";

@Module({
    imports: [DefaultModule],
})
export class SocketModule { }
