import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * Convierte un parámetro a entero positivo (1, 2, 3...).
 *
 * Reemplaza a ParseIntPipe en los IDs porque:
 * - ParseIntPipe acepta 0 y números negativos, que nunca son IDs válidos.
 * - Sus mensajes vienen en inglés y el sistema debe estar en español (RNF-003).
 *
 * Uso: @Param('id', ParsePositiveIntPipe) id: number
 */
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const campo = metadata.data ?? 'valor';

    if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) {
      throw new BadRequestException(
        `El parámetro '${campo}' debe ser un número entero positivo`,
      );
    }

    const numero = Number(value);

    if (!Number.isSafeInteger(numero) || numero < 1) {
      throw new BadRequestException(
        `El parámetro '${campo}' debe ser un número entero positivo`,
      );
    }

    return numero;
  }
}
