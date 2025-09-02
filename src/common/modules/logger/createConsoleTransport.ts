import { utilities } from 'nest-winston';
import winston from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

export const createConsoleTransport = (options: ConsoleTransportOptions) => {
  return new winston.transports.Console({
    ...options,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      utilities.format.nestLike('Winston', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });
};
