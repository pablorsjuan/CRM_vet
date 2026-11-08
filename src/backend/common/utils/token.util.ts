import { createHash, randomBytes } from 'crypto';

export function generarTokenSeguro(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function hashearToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
