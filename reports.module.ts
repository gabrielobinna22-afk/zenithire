import { Injectable, Logger } from '@nestjs/common';

// Kept deliberately provider-agnostic. Swap the body of send() for
// @sendgrid/mail, Postmark, or AWS SES — nothing else in the auth module
// needs to change since callers only depend on this interface.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendVerificationEmail(to: string, token: string) {
    const link = `${process.env.APP_URL}/verify-email?token=${token}`;
    await this.send(to, 'Verify your Zenithire account', `Confirm your email: ${link}`);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const link = `${process.env.APP_URL}/reset-password?token=${token}`;
    await this.send(to, 'Reset your Zenithire password', `Reset your password: ${link}`);
  }

  private async send(to: string, subject: string, body: string) {
    // TODO: replace with real provider call.
    this.logger.log(`[mail stub] to=${to} subject="${subject}" body="${body}"`);
  }
}
