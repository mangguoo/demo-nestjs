import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

export const createDailyRotateTransport = (
  options: DailyRotateFileTransportOptions,
) => {
  return new DailyRotateFile({
    ...options,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
};
