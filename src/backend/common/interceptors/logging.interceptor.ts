import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Registra cada petición con su método, ruta y tiempo de respuesta.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  /** Umbral (ms) a partir del cual una petición se considera lenta. */
  private static readonly UMBRAL_LENTO_MS = 3000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;
    const inicio = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duracion = Date.now() - inicio;
          const linea = `${method} ${originalUrl} - ${duracion}ms`;

          if (duracion > LoggingInterceptor.UMBRAL_LENTO_MS) {
            this.logger.warn(`${linea} (supera los 3s de RNF-008)`);
          } else {
            this.logger.log(linea);
          }
        },
        // Los errores ya los registran los filtros; aquí no se duplican.
      }),
    );
  }
}