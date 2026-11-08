import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Formato único de respuesta exitosa de la API. */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Envuelve toda respuesta exitosa en { success, data, timestamp }.
 * Es el espejo de `ErrorResponse` (filters): el frontend siempre recibe
 * una estructura predecible, tanto en éxito como en error.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T> | T>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        return {
          success: true as const,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
