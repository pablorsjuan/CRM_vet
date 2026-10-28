
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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RolUsuario } from '../../../database/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_usuario: string;

  @ApiPropertyOptional({
    description: 'Sexo del usuario',
    example: 'Masculino',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento en formato ISO 8601',
    example: '1995-06-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Nombre de usuario para ingresar al sistema',
    example: 'juanperez95',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'ClaveSegura123!',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  contrasena: string;

  @ApiPropertyOptional({
    description: 'Número de celular del usuario',
    example: '3001234567',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  num_celular?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
    format: 'email',
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Rol que tendrá el usuario dentro del CRM',
    enum: RolUsuario,
    enumName: 'RolUsuario',
    example: RolUsuario.DUENO,
  })
  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @ApiPropertyOptional({
    description: 'Matrícula profesional, cuando corresponda',
    example: 'MV-12345',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  matricula_profesional?: string;

  @ApiPropertyOptional({
    description: 'Especialidad profesional del usuario',
    example: 'Medicina veterinaria',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  especialidad?: string;

  @ApiPropertyOptional({
    description: 'Hora de paseo en formato HH:mm o HH:mm:ss',
    example: '08:30',
    type: String,
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  hora_paseo?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional',
    example: 5,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  anos_experiencia?: number;
}
