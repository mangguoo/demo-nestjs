import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import * as requestIp from 'request-ip';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapter: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      message,
      exception instanceof Error ? exception.stack : undefined,
      'AllExceptionFilter',
    );

    const body = {
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params,
      method: request.method,
      path: request.url,
      ip: requestIp.getClientIp(request),

      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    };

    const { httpAdapter } = this.httpAdapter;
    httpAdapter.reply(response, body, status);
  }
}
