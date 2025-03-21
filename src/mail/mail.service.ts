import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: any, token: string) {
        const url = `example.com/auth/confirm?token=${token}`

        await this.mailerService.sendMail({
            to: user.email,
            subject: "Welcome to Nice App! Confirm your Email",
            template: "confirmation", // This points to a template file named 'confirmation.hbs'
            context: {
                name: user.name,
                url
            }
        })
    }

    // Add more methods for different email types
    async sendPasswordReset(user: any, token: string) {
        // Similar implementation
    }

    async sendNotification(user: any, message: string) {
        // Similar implementation
    }
}
