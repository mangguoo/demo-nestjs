import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigEnum } from 'src/enum/config.enum';

const envFilePath = [`.env.${process.env.NODE_ENV || 'development'}`, '.env'];

const validationSchema = Joi.object({
  [ConfigEnum.PORT]: Joi.number().default(5500),
  [ConfigEnum.NODE_ENV]: Joi.string()
    .valid('development', 'production')
    .required(),
  [ConfigEnum.PREFIX]: Joi.string().default('api'),
  [ConfigEnum.VERSION]: Joi.string().pattern(/^\d+(,\d+)*$/),

  [ConfigEnum.MYSQL_HOST]: Joi.string().ip().required(),
  [ConfigEnum.MYSQL_PORT]: Joi.number().default(3306),
  [ConfigEnum.MYSQL_USERNAME]: Joi.string().required(),
  [ConfigEnum.MYSQL_PASSWORD]: Joi.string().required(),

  [ConfigEnum.REDIS_HOST]: Joi.string().ip().required(),
  [ConfigEnum.REDIS_PORT]: Joi.number().default(6379),
  [ConfigEnum.REDIS_PASSWORD]: Joi.string().required(),

  [ConfigEnum.LOG_DIR]: Joi.string().default('logs'),
  [ConfigEnum.LOG_DATE_FORMAT]: Joi.string().default('YYYY-MM-DD HH:mm:ss'),
  [ConfigEnum.LOG_ZIPPED_ARCHIVE]: Joi.boolean().default(false),
  [ConfigEnum.LOG_MAX_SIZE]: Joi.string().default('5m'),
  [ConfigEnum.LOG_MAX_FILES]: Joi.string().default('1d'),
  [ConfigEnum.LOG_ON]: Joi.boolean().default(false),

  [ConfigEnum.ALL_EXCEPTION_FILTER]: Joi.boolean().default(false),
  [ConfigEnum.CORS]: Joi.boolean().default(false),
});

@Module({
  imports: [
    ConfigModuleNest.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
