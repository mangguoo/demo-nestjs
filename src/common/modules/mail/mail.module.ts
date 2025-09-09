import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'email-smtp.us-east-1.amazonaws.com', // SES SMTP endpoint
          port: 465, // SSL
          secure: true,
          auth: {
            user: process.env.SES_SMTP_USER,
            pass: process.env.SES_SMTP_PASS,
          },
        },
        defaults: {
          from: '"MyApp" <verified-email@example.com>', // SES 已验证邮箱
        },
        template: {
          dir: __dirname + '/templates/mails',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
