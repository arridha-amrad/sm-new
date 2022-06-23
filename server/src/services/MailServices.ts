import nodemailer, { SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config';
import { IMailContent } from '../types/MailTypes';

class MailService {
  async sendEmail(
    to: string,
    content: IMailContent
  ): Promise<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL_TRANSPORTER ?? '',
        pass: process.env.NODEMAILER_PASSWORD_TRANSPORTER ?? '',
      },
    });
    const contacts: SendMailOptions = {
      from: process.env.NODEMAILER_EMAIL_TRANSPORTER,
      to,
    };
    const email = Object.assign({}, content, contacts);
    return transporter.sendMail(email);
  }

  composeEmail(
    username: string,
    token: string,
    type: 'email confirmation' | 'reset password'
  ): IMailContent {
    const setTitle = () => {
      switch (type) {
        case 'email confirmation':
          return 'Email Confirmation';
        case 'reset password':
          return 'Reset Password';
        default:
          return '';
      }
    };
    return {
      subject: `${config.appName} - ${setTitle()}`,
      html: `<p>Hello ${username}</p><p>Please use the following link to ${
        type === 'email confirmation'
          ? 'verify your email'
          : 'reset your password'
      }:</p> <p>${
        config.serverOrigin
      }/api/user/email-verification/${token}</p> <p>Thanks</p>`,
    };
  }
}
export default new MailService();
