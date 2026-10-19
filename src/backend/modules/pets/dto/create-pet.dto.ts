
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

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_mascota: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  especie: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  raza?: string;

  @IsOptional()
  @IsString()
  @IsIn(['M', 'F'])
  sexo?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsNumberString()
  peso?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsInt()
  @Min(1)
  id_dueno: number;
}
