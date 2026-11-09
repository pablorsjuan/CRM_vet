import { escapeHtml } from '../../common/utils';
import {
  PlantillaCorreo,
  botonHtml,
  limpiarAsunto,
  plantillaBase,
} from './base.template';

export interface DatosRecuperarContrasena {
  nombre: string;
  /** Enlace completo del frontend con el token, ej. https://app/recuperar?token=... */
  enlace: string;
  /** Minutos durante los que el enlace es válido. */
  minutosVigencia: number;
}

/** RF-003: correo para restablecer la contraseña. */
export function recuperarContrasenaTemplate(
  datos: DatosRecuperarContrasena,
): PlantillaCorreo {
  const asunto = 'Recupera tu contraseña';

  const html = plantillaBase(
    'Recuperación de contraseña',
    `<p>Hola ${escapeHtml(datos.nombre)},</p>
     <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.
        Haz clic en el botón para crear una nueva:</p>
     ${botonHtml('Restablecer contraseña', datos.enlace)}
     <p>Este enlace es válido por ${datos.minutosVigencia} minutos.</p>
     <p>Si tú no hiciste esta solicitud, ignora este correo: tu contraseña no cambiará.</p>`,
  );

  const texto =
    `Hola ${datos.nombre},\n\n` +
    `Recibimos una solicitud para restablecer la contraseña de tu cuenta.\n` +
    `Abre este enlace para crear una nueva (válido por ${datos.minutosVigencia} minutos):\n` +
    `${datos.enlace}\n\n` +
    `Si tú no hiciste esta solicitud, ignora este correo.`;

  return { asunto: limpiarAsunto(asunto), html, texto };
}
