
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

import { RolUsuario } from '../../../database/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_usuario: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  contrasena: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  num_celular?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  matricula_profesional?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  especialidad?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  hora_paseo?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  anos_experiencia?: number;

}
