import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum/config.enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Services
  const httpAdapterHost = app.get(HttpAdapterHost);
  const logger = app.get(Logger);
  const configService = app.get(ConfigService);
  // Feature switch
  const allExceptionFilter = configService.get<boolean>(
    ConfigEnum.ALL_EXCEPTION_FILTER,
    false,
  );
  const cors = configService.get<boolean>(ConfigEnum.CORS, false);
  // Server settings
  const prefix = configService.get<string>(ConfigEnum.PREFIX, 'api');
  const version = configService.get<string>(ConfigEnum.VERSION);
  const port = configService.get<number>(ConfigEnum.PORT, 5500);

  // Replace nestjs logger with winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Setting global prefix
  app.setGlobalPrefix(prefix, {
    exclude: ['/health'],
  });

  // Setting global version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:
      typeof version === 'undefined'
        ? VERSION_NEUTRAL
        : version.indexOf(',') > -1
          ? version.split(',')
          : [version],
  });

  // Setup global filters
  if (allExceptionFilter) {
    app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));
  }

  // Enable CORS
  if (cors) {
    app.enableCors();
  }

  await app.listen(port);
}

void bootstrap();
