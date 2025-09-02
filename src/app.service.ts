import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum/config.enum';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  getHello(): string {
    this.logger.log('Hello World!');
    return `Hello World! ${this.configService.get(ConfigEnum.PORT)}`;
  }

  getHello2(): string {
    this.logger.log('Hello World! 2');
    return `Hello World! 2 ${this.configService.get(ConfigEnum.PORT)}`;
  }
}
