import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './common/modules/logger/logs.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // 测试专用配置：Jest环境无法读取.env文件
        NestConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              NODE_ENV: 'development',
              PORT: 5500,
              PREFIX: 'api',
              MYSQL_HOST: '127.0.0.1',
              MYSQL_PORT: 3306,
              VERSION: '1',
              LOG_DIR: 'logs',
              LOG_ON: false,
              ALL_EXCEPTION_FILTER: false,
              CORS: false,
            }),
          ],
        }),
        LogsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World! 5500');
    });
  });
});
