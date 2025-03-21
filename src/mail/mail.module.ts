import { Module } from "@nestjs/common"
import { MailerModule } from "@nestjs-modules/mailer"
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path"
import { MailService } from "./mail.service"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get("MAIL_HOST"),
                    port: config.get("MAIL_PORT"),
                    secure: config.get("MAIL_PORT") === "465",
                    auth: {
                        user: config.get("MAIL_USER"),
                        pass: config.get("MAIL_PASSWORD")
                    }
                },
                defaults: {
                    from: `"No Reply" <${config.get("MAIL_FROM")}>`
                },
                template: {
                    dir: join(__dirname, "templates"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            })
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
