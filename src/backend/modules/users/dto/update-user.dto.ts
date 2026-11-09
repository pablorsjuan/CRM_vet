import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'rol',
    'matricula_profesional',
    'especialidad',
    'hora_paseo',
    'anos_experiencia',
  ] as const),
) {}