import { Resolver } from "@nestjs/graphql"
import { Mail } from "./entities/mail.entity"
import { MailService } from "./mail.service"

@Resolver(() => Mail)
export class MailResolver {
    constructor(private readonly mailService: MailService) {}
}
