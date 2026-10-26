
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsDateString,
  IsInt,
  IsNumberString,
  Min,
  IsIn,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Max',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_mascota: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    example: 'Perro',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  especie: string;

  @ApiPropertyOptional({
    description: 'Raza de la mascota',
    example: 'Labrador',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  raza?: string;

  @ApiPropertyOptional({
    description: 'Sexo de la mascota: M (macho) o F (hembra)',
    enum: ['M', 'F'],
    example: 'M',
  })
  @IsOptional()
  @IsString()
  @IsIn(['M', 'F'])
  sexo?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento en formato ISO 8601',
    example: '2022-05-10',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional({
    description: 'Peso de la mascota, expresado como cadena numérica',
    example: '12.5',
    type: String,
  })
  @IsOptional()
  @IsNumberString()
  peso?: string;

  @ApiPropertyOptional({
    description: 'Color de la mascota',
    example: 'Dorado',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales sobre la mascota',
    example: 'Mascota tranquila y sociable',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({
    description: 'ID del dueño registrado en el sistema',
    example: 2,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  id_dueno: number;
}
