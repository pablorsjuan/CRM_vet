import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export enum TipoCita {
  VETERINARIA = 'veterinaria',
  PASEO = 'paseo',
  PELUQUERIA = 'peluqueria',
}

export class CreateAppointmentDto {
  @ApiProperty({ example: '2026-12-01', format: 'date' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: '09:30', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  hora_inicio: string;

  @ApiProperty({ enum: TipoCita })
  @IsEnum(TipoCita)
  tipo_cita: TipoCita;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  id_mascota: number;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  id_profesional?: number;

  @ApiPropertyOptional({ maxLength: 250 })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  motivo?: string;
}
