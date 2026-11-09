/**
 * Formato único de respuesta de error de toda la API.
 */
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
}
