import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateClinicalHistoryDto {
  @ApiProperty({ example: 12, minimum: 1 })
  @IsInt()
  @Min(1)
  id_mascota: number;

  @ApiProperty({ example: 'Control anual', maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  motivo_consulta: string;

  @ApiPropertyOptional({ example: 'Alergia conocida a la penicilina' })
  @IsOptional()
  @IsString()
  antecedentes_medicos?: string;

  @ApiPropertyOptional({ example: 'Buen estado general' })
  @IsOptional()
  @IsString()
  diagnostico?: string;

  @ApiPropertyOptional({ example: 'Continuar dieta actual' })
  @IsOptional()
  @IsString()
  tratamiento?: string;
}
