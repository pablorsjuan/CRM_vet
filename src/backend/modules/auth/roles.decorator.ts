import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../database/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
