import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis, { createClient } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const uri = `redis://:${configService.get(ConfigEnum.REDIS_PASSWORD)}@${configService.get(ConfigEnum.REDIS_HOST)}:${configService.get(ConfigEnum.REDIS_PORT)}`;
        const redis = createClient({
          url: uri,
        });
        const keyvRedis = new KeyvRedis(redis);
        const keyv = new Keyv({ store: keyvRedis });

        return {
          ttl: 10 * 1000,
          store: keyv,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
