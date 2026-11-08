import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ErrorResponse } from './error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[] = exception.message;
    let error: string = HttpStatus[status] ?? 'Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
      const body = exceptionResponse as Record<string, unknown>;

      if (typeof body.message === 'string' || Array.isArray(body.message)) {
        message = body.message as string | string[];
      }
      if (typeof body.error === 'string') {
        error = body.error;
      }
    }

    // 4xx son errores del cliente: advertencia. 5xx: error del servidor.
    const logLine = `${request.method} ${request.originalUrl} -> ${status}`;
    if (status >= 500) {
      this.logger.error(logLine, exception.stack);
    } else {
      this.logger.warn(logLine);
    }

    const body: ErrorResponse = {
      statusCode: status,
      error,
      message,
      path: request.originalUrl,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
