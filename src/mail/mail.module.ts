import { Module } from "@nestjs/common"
import { MailerModule } from "@nestjs-modules/mailer"
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path"
import { MailService } from "./mail.service"
import { envConfig } from "src/dynamic-modules"

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: envConfig().mail.host,
                    port: parseInt(`${envConfig().mail.port}`),
                    secure: parseInt(`${envConfig().mail.port}`) === 465,
                    auth: {
                        user: envConfig().mail.user,
                        pass: envConfig().mail.password
                    }
                },
                defaults: {
                    from: `"No Reply" <${envConfig().mail.from}>`
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
