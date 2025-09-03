import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum/config.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  getHello(): string {
    this.logger.log('Hello World!');
    return `Hello World! ${this.configService.get(ConfigEnum.PORT)}`;
  }

  async getHello2() {
    await this.cacheManager.set('token', 'im so handsome');
    console.log(this.cacheManager.stores);
    const token = await this.cacheManager.get<string>('token');
    this.logger.log(`Hello World! 2, token: ${token}`);
    return `Hello World! 2, token: ${token}, port: ${this.configService.get(ConfigEnum.PORT)}`;
  }
}
