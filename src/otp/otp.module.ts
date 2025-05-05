import { Module } from "@nestjs/common"
import { OtpService } from "./otp.service"
import { OtpResolver } from "./otp.resolver"
import { RedisModule } from "../redis/redis.module"
import { MailModule } from "@/mail"
import { UsersModule } from "@/users"

@Module({
    imports: [RedisModule, MailModule, UsersModule],
    providers: [OtpResolver, OtpService],
    exports: [OtpService]
})
export class OtpModule {}
