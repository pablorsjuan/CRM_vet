/**
 * Escapa los caracteres especiales de HTML. Se usa en las plantillas de
 * correo para que un dato escrito por un usuario (nombre de mascota,
 * observaciones, etc.) nunca se interprete como código.
 */
export function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
