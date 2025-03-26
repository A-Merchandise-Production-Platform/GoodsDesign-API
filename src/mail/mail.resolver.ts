import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { MAIL_CONSTANT } from './mail.constant';

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => Boolean)
  async sendEmail(
    @Args('to') to: string,
  ): Promise<boolean> {
    try {
      await this.mailService.sendSingleEmail({
        from: MAIL_CONSTANT.FROM_EMAIL,
        to,
        subject: 'Test',
        html: "<h1>Hello World</h1>",
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
