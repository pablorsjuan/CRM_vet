import * as bcrypt from 'bcrypt';

/** Costo del hash. 10 es el valor que ya usa UsersService. */
export const SALT_ROUNDS = 10;

/** Encripta una contraseña. Nunca se guarda la contraseña en texto plano. */
export function hashPassword(contrasena: string): Promise<string> {
  return bcrypt.hash(contrasena, SALT_ROUNDS);
}

/** Compara una contraseña con su hash (inicio de sesión, RF-008). */
export function comparePassword(
  contrasena: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(contrasena, hash);
}
