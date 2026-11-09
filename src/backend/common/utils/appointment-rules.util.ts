import { minutosHasta, sumarMinutos } from './date.util';

/**
 * Reglas de negocio de las citas, en un solo lugar para que el módulo de
 * citas, los pipes y las notificaciones usen los mismos valores.
 */
export const ANTICIPACION_MINIMA_CITA_MINUTOS = 60;
export const ANTICIPACION_RECORDATORIO_MINUTOS = 30;

export function cumpleAnticipacionMinima(
  fechaCita: Date | string,
  ahora: Date = new Date(),
): boolean {
  return minutosHasta(fechaCita, ahora) >= ANTICIPACION_MINIMA_CITA_MINUTOS;
}

/** Momento exacto en que debe enviarse el recordatorio de una cita (RF-016). */
export function calcularFechaRecordatorio(fechaCita: Date | string): Date {
  return sumarMinutos(fechaCita, -ANTICIPACION_RECORDATORIO_MINUTOS);
}
