/**
 * Utilidades de fechas. Todo el sistema habla en español (RNF-003) y se
 * muestra en la hora de Colombia, sin importar dónde corra el servidor.
 */

export const ZONA_HORARIA = 'America/Bogota';
export const LOCALE = 'es-CO';

const MS_POR_MINUTO = 60_000;

/** Convierte string | Date en Date, o lanza error si no es una fecha válida. */
function aDate(valor: Date | string): Date {
  const fecha = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    throw new Error(`Fecha inválida: ${String(valor)}`);
  }
  return fecha;
}

/** "8 de noviembre de 2026" */
export function formatearFecha(valor: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: ZONA_HORARIA,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(aDate(valor));
}

/** "4:30 p. m." */
export function formatearHora(valor: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: ZONA_HORARIA,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(aDate(valor));
}

/** "8 de noviembre de 2026, 4:30 p. m." (útil para notificaciones de citas) */
export function formatearFechaHora(valor: Date | string): string {
  return `${formatearFecha(valor)}, ${formatearHora(valor)}`;
}

/** Devuelve una fecha nueva con los minutos sumados (o restados si es negativo). */
export function sumarMinutos(valor: Date | string, minutos: number): Date {
  return new Date(aDate(valor).getTime() + minutos * MS_POR_MINUTO);
}

export function minutosHasta(
  valor: Date | string,
  desde: Date = new Date(),
): number {
  return (aDate(valor).getTime() - desde.getTime()) / MS_POR_MINUTO;
}

export function calcularEdad(
  nacimiento: Date | string,
  hoy: Date = new Date(),
): { anios: number; meses: number } {
  const n = aDate(nacimiento);

  let meses =
    (hoy.getFullYear() - n.getFullYear()) * 12 +
    (hoy.getMonth() - n.getMonth());

  if (hoy.getDate() < n.getDate()) {
    meses -= 1;
  }

  meses = Math.max(meses, 0);
  return { anios: Math.floor(meses / 12), meses: meses % 12 };
}
