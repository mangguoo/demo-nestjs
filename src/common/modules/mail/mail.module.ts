import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigEnum } from 'src/enum/config.enum';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>(ConfigEnum.MAIL_HOST),
          port: configService.get<number>(ConfigEnum.MAIL_PORT),
          secure: configService.get<number>(ConfigEnum.MAIL_PORT) === 465, // Use SSL for port 465
          auth: {
            user: configService.get<string>(ConfigEnum.MAIL_USERNAME),
            pass: configService.get<string>(ConfigEnum.MAIL_PASSWORD),
          },
        },
        // preview: true,
        defaults: {
          from: `"${configService.get<string>(ConfigEnum.MAIL_FROM_NAME)}" <${configService.get<string>(ConfigEnum.MAIL_FROM_EMAIL)}>`,
        },
        template: {
          dir: path.join(__dirname, '../../..', 'templates', 'mails'),
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
