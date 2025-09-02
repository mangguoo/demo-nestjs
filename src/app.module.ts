import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/modules/config/config.module';
import { LogsModule } from './common/modules/logger/logs.module';
import { RedisModule } from './common/modules/redis/redis.module';

@Module({
  imports: [ConfigModule, LogsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
