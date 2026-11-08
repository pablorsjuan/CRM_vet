import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { ErrorResponse } from './error-response.interface';

/** Forma mínima del error que entrega el driver `pg`. */
interface PgError {
  code?: string;
  detail?: string;
  column?: string;
  constraint?: string;
}

/**
 * Traduce los errores de PostgreSQL (QueryFailedError de TypeORM) a
 * respuestas HTTP comprensibles, sin filtrar SQL, nombres de tablas ni
 * valores internos al cliente.
 *
 * Referencia de códigos: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  /** Nombres amigables de las columnas únicas del esquema. */
  private readonly camposUnicos: Record<string, string> = {
    usuario: 'El nombre de usuario',
    email: 'El correo electrónico',
    matricula_profesional: 'La matrícula profesional',
    id_usuario: 'El perfil de este usuario',
  };

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const pgError = this.getPgError(exception);
    const { status, error, message } = this.mapear(pgError);

    // El detalle técnico se queda en el log del servidor, nunca en la respuesta.
    this.logger.error(
      `${request.method} ${request.originalUrl} -> ${status} ` +
        `[pg:${pgError.code ?? 'desconocido'}] ${pgError.detail ?? exception.message}`,
    );

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

  private getPgError(exception: QueryFailedError): PgError {
    // TypeORM guarda el error original del driver en `driverError`.
    return (exception as unknown as { driverError?: PgError }).driverError ??
      (exception as unknown as PgError);
  }

  private mapear(pg: PgError): {
    status: number;
    error: string;
    message: string;
  } {
    switch (pg.code) {
      // unique_violation
      case '23505':
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: `${this.campoDuplicado(pg)} ya está registrado`,
        };

      // foreign_key_violation
      case '23503':
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message:
            'La operación no se puede completar porque el registro está ' +
            'relacionado con otros datos o hace referencia a un registro que no existe',
        };

      // not_null_violation
      case '23502':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: `El campo ${pg.column ?? 'requerido'} es obligatorio`,
        };

      // check_violation
      case '23514':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Uno de los valores enviados no cumple las reglas permitidas',
        };

      // invalid_text_representation (ej. enum o número con formato inválido)
      case '22P02':
      // invalid_datetime_format
      case '22007':
      // datetime_field_overflow
      case '22008':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Alguno de los datos enviados tiene un formato inválido',
        };

      // string_data_right_truncation
      case '22001':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Alguno de los textos enviados excede la longitud permitida',
        };

      // Cualquier otro error de base de datos es un fallo interno.
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'Error interno del servidor',
        };
    }
  }

  /** Obtiene la columna duplicada a partir de `Key (email)=(...) already exists.` */
  private campoDuplicado(pg: PgError): string {
    const columna = /Key \(([^)]+)\)=/.exec(pg.detail ?? '')?.[1];

    if (columna && this.camposUnicos[columna]) {
      return this.camposUnicos[columna];
    }
    return 'Uno de los datos enviados';
  }
}