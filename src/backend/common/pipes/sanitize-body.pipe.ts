import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Limpia el body de cada petición ANTES de que lo valide el ValidationPipe:
 */
@Injectable()
export class SanitizeBodyPipe implements PipeTransform {
  /** Campos que nunca se tocan. */
  private static readonly CAMPOS_INTACTOS = ['contrasena'];
  private static readonly CAMPOS_MINUSCULAS = ['email'];

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    // Solo se limpia el body; params y query tienen sus propios pipes.
    if (metadata.type !== 'body') {
      return value;
    }
    return this.limpiar(value);
  }

  private limpiar(value: unknown, clave?: string): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.limpiar(item, clave));
    }

    if (value !== null && typeof value === 'object') {
      // Solo objetos planos (JSON). Archivos, fechas, etc. pasan igual.
      if (Object.getPrototypeOf(value) !== Object.prototype) {
        return value;
      }

      const resultado: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        resultado[k] = this.limpiar(v, k);
      }
      return resultado;
    }

    if (typeof value === 'string') {
      if (clave && SanitizeBodyPipe.CAMPOS_INTACTOS.includes(clave)) {
        return value;
      }

      const texto = value.trim();
      return clave && SanitizeBodyPipe.CAMPOS_MINUSCULAS.includes(clave)
        ? texto.toLowerCase()
        : texto;
    }

    return value;
  }
}