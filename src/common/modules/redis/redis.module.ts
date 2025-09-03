import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const redisUrl = `redis://:${configService.get(ConfigEnum.REDIS_PASSWORD)}@${configService.get(ConfigEnum.REDIS_HOST)}:${configService.get(ConfigEnum.REDIS_PORT)}`;

        return {
          ttl: 1000 * 1000,
          stores: [
            createKeyv(redisUrl, {
              namespace: 'app_cache',
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
