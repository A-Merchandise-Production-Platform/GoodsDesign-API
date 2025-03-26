import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { envConfig } from 'src/dynamic-modules';
import { MAIL_CONSTANT, MailTemplateInvoice, MailTemplateMap, MailTemplateType } from './mail.constant';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor() {
    const apiKey = envConfig().resend.apiKey;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    this.resend = new Resend(apiKey);
  }

  private async sendEmail(params: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
  }) {
    try {
      return await this.resend.emails.send(params);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  private async sendBatchEmails(emails: Array<{
    from: string;
    to: string | string[];
    subject: string;
    html: string;
  }>) {
    try {
      return await this.resend.batch.send(emails);
    } catch (error) {
      throw new Error(`Failed to send batch emails: ${error.message}`);
    }
  }

  private async getEmail(id: string) {
    try {
      return await this.resend.emails.get(id);
    } catch (error) {
      throw new Error(`Failed to retrieve email: ${error.message}`);
    }
  }

  private async updateEmail(id: string, scheduledAt: Date) {
    try {
      return await this.resend.emails.update({
        id,
        scheduledAt: scheduledAt.toISOString(),
      });
    } catch (error) {
      throw new Error(`Failed to update email: ${error.message}`);
    }
  }

  private async cancelEmail(id: string) {
    try {
      return await this.resend.emails.cancel(id);
    } catch (error) {
      throw new Error(`Failed to cancel email: ${error.message}`);
    }
  }

  // Public methods that use the private methods
  public async sendSingleEmail(params: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
  }) {
    return this.sendEmail(params);
  }

  public async sendMultipleEmails(emails: Array<{
    from: string;
    to: string | string[];
    subject: string;
    html: string;
  }>) {
    return this.sendBatchEmails(emails);
  }

  public async retrieveEmail(id: string) {
    return this.getEmail(id);
  }

  public async sendInvoiceEmail(params: {
    to: string;
    orderId: string;
    amount: number;
  }) {
    const { to, orderId, amount } = params;
    const invoiceParams: MailTemplateInvoice = {
      email: to,
      orderId,
      amount,
    };

    return this.sendEmail(
      {
        from: MAIL_CONSTANT.FROM_EMAIL,
        to,
        subject: MailTemplateMap[MailTemplateType.INVOICE].subject,
        html: MailTemplateMap[MailTemplateType.INVOICE].htmlGenerate(invoiceParams),
      });
  }
    
} 