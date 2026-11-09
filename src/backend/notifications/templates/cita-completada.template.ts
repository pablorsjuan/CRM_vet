import { escapeHtml, formatearFechaHora } from '../../common/utils';
import { PlantillaCorreo, limpiarAsunto, plantillaBase } from './base.template';

export interface DatosCitaCompletada {
  nombreDueno: string;
  nombreMascota: string;
  /** Ej. "Consulta veterinaria", "Peluquería", "Paseo". */
  servicio: string;
  fechaHora: Date | string;
}

/** RF-007: aviso al dueño cuando termina la cita de su mascota. */
export function citaCompletadaTemplate(
  datos: DatosCitaCompletada,
): PlantillaCorreo {
  const fecha = formatearFechaHora(datos.fechaHora);
  const asunto = `La cita de ${datos.nombreMascota} ha finalizado`;

  const html = plantillaBase(
    'Cita finalizada',
    `<p>Hola ${escapeHtml(datos.nombreDueno)},</p>
     <p>Te informamos que la cita de <strong>${escapeHtml(datos.nombreMascota)}</strong>
        ha finalizado.</p>
     <p><strong>Servicio:</strong> ${escapeHtml(datos.servicio)}<br>
        <strong>Fecha:</strong> ${escapeHtml(fecha)}</p>
     <p>Ya puedes pasar a recogerla. ¡Gracias por confiar en nosotros!</p>`,
  );

  const texto =
    `Hola ${datos.nombreDueno},\n\n` +
    `La cita de ${datos.nombreMascota} ha finalizado.\n` +
    `Servicio: ${datos.servicio}\nFecha: ${fecha}\n\n` +
    `Ya puedes pasar a recogerla. ¡Gracias por confiar en nosotros!`;

  return { asunto: limpiarAsunto(asunto), html, texto };
}
