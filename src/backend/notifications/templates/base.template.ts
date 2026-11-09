import { escapeHtml } from '../../common/utils';

/** Resultado de toda plantilla: lo que MailService necesita para enviar. */
export interface PlantillaCorreo {
  asunto: string;
  html: string;
  texto: string;
}

/** Quita saltos de línea de un texto que irá en el asunto del correo. */
export function limpiarAsunto(asunto: string): string {
  return asunto.replace(/[\r\n]+/g, ' ').trim();
}

/** Botón de acción para los correos (enlace). */
export function botonHtml(texto: string, enlace: string): string {
  return `<p style="margin:24px 0;text-align:center;">
    <a href="${escapeHtml(enlace)}"
       style="background:#2f7d6d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
      ${escapeHtml(texto)}
    </a>
  </p>`;
}

/**
 * Estructura común de todos los correos: encabezado, contenido y pie.
 * Usa estilos en línea porque los clientes de correo ignoran las hojas de estilo.
 * El `contenidoHtml` debe llegar ya escapado.
 */
export function plantillaBase(titulo: string, contenidoHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#f4f6f5;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#2f7d6d;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:bold;">
              CRM Vet
            </td>
          </tr>
          <tr>
            <td style="padding:24px;line-height:1.5;font-size:15px;">
              <h2 style="margin:0 0 16px;font-size:18px;">${escapeHtml(titulo)}</h2>
              ${contenidoHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#f4f6f5;font-size:12px;color:#777777;">
              Este es un mensaje automático, por favor no respondas a este correo.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
