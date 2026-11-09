import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Corta las peticiones que tardan demasiado para no dejar conexiones
 * colgadas (RNF-008 y RNF-004). Responde 408 Request Timeout.
 *
 * El límite es holgado a propósito (10 s): el objetivo de 3 s de RNF-008
 * es un promedio que vigila el LoggingInterceptor, no un corte duro.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly limiteMs: number = 10000) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.limiteMs),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                'La solicitud tardó demasiado en procesarse, intenta de nuevo',
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}