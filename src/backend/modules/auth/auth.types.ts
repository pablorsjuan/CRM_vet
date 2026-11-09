import { Request } from 'express';
import { RolUsuario } from '../../database/entities/user.entity';

export interface AuthTokenPayload {
  sub: number;
  usuario: string;
  rol: RolUsuario;
}

export type AuthenticatedRequest = Request & {
  user: AuthTokenPayload;
};
