import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export const ANTICIPACION_MINIMA_CITA_MINUTOS = 60;

/**
 * Valida que un valor sea una fecha/hora válida y que esté en el futuro.
 * Devuelve un objeto Date.
 */
@Injectable()
export class FutureDatePipe implements PipeTransform<string, Date> {
  constructor(private readonly minutosAnticipacion: number = 0) {}

  transform(value: string, metadata: ArgumentMetadata): Date {
    const campo = metadata.data ?? 'fecha';

    if (typeof value !== 'string' || value.trim() === '') {
      throw new BadRequestException(`El campo '${campo}' es obligatorio`);
    }

    const fecha = new Date(value);

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException(
        `El campo '${campo}' no es una fecha válida (usa formato ISO, ej. 2026-12-31T10:30:00)`,
      );
    }

    if (fecha.getTime() <= Date.now()) {
      throw new BadRequestException(
        `El campo '${campo}' debe ser una fecha futura`,
      );
    }

    if (fecha.getTime() < Date.now() + this.minutosAnticipacion * 60_000) {
      throw new BadRequestException(
        `El campo '${campo}' debe tener al menos ${this.minutosAnticipacion} minutos de anticipación`,
      );
    }

    return fecha;
  }
}