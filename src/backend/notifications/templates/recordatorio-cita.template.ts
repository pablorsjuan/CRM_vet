import {
  ANTICIPACION_RECORDATORIO_MINUTOS,
  escapeHtml,
  formatearFechaHora,
} from '../../common/utils';
import { PlantillaCorreo, limpiarAsunto, plantillaBase } from './base.template';

export interface DatosRecordatorioCita {
  /** Dueño o trabajador que recibe el recordatorio. */
  nombreDestinatario: string;
  nombreMascota: string;
  servicio: string;
  fechaHora: Date | string;
}

/** RF-016: recordatorio 30 minutos antes de la cita (dueño y trabajador). */
export function recordatorioCitaTemplate(
  datos: DatosRecordatorioCita,
): PlantillaCorreo {
  const fecha = formatearFechaHora(datos.fechaHora);
  const minutos = ANTICIPACION_RECORDATORIO_MINUTOS;
  const asunto = `Recordatorio: cita de ${datos.nombreMascota} en ${minutos} minutos`;

  const html = plantillaBase(
    'Recordatorio de cita',
    `<p>Hola ${escapeHtml(datos.nombreDestinatario)},</p>
     <p>Te recordamos que en ${minutos} minutos tienes una cita
        con <strong>${escapeHtml(datos.nombreMascota)}</strong>.</p>
     <p><strong>Servicio:</strong> ${escapeHtml(datos.servicio)}<br>
        <strong>Fecha y hora:</strong> ${escapeHtml(fecha)}</p>`,
  );

  const texto =
    `Hola ${datos.nombreDestinatario},\n\n` +
    `Te recordamos que en ${minutos} minutos tienes una cita con ${datos.nombreMascota}.\n` +
    `Servicio: ${datos.servicio}\nFecha y hora: ${fecha}`;

  return { asunto: limpiarAsunto(asunto), html, texto };
}
