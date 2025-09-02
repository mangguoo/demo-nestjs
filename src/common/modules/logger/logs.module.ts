import { Module, Logger } from '@nestjs/common';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { createDailyRotateTransport } from './createDailyRotateTransport';
import { createConsoleTransport } from './createConsoleTransport';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const maxSize = configService.get<string>(ConfigEnum.LOG_MAX_SIZE);
        const maxFiles = configService.get<string>(ConfigEnum.LOG_MAX_FILES);
        const dirname = configService.get<string>(ConfigEnum.LOG_DIR);
        const datePattern = configService.get<string>(
          ConfigEnum.LOG_DATE_FORMAT,
        );
        const zippedArchive = configService.get<boolean>(
          ConfigEnum.LOG_ZIPPED_ARCHIVE,
        );
        const logOn = configService.get<boolean>(ConfigEnum.LOG_ON);

        const commonOptions = {
          maxSize,
          maxFiles,
          dirname,
          datePattern,
          zippedArchive,
        };

        return {
          // Register as a global provider
          global: true,
          transports: [
            createConsoleTransport({
              level: 'info',
            }),
            ...(logOn
              ? [
                  createDailyRotateTransport({
                    level: 'info',
                    filename: 'application.log',
                    ...commonOptions,
                  }),
                  createDailyRotateTransport({
                    level: 'warn',
                    filename: 'error.log',
                    ...commonOptions,
                  }),
                ]
              : []),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Override nestjs default Logger
    {
      provide: Logger,
      useExisting: WINSTON_MODULE_NEST_PROVIDER,
    },
  ],
  // Must export logger, otherwise other modules cannot inject
  exports: [Logger],
})
export class LogsModule {}
