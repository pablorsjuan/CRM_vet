import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_usuario: string;

  @ApiPropertyOptional({ example: 'Femenino', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @ApiPropertyOptional({
    example: '1995-06-15',
    format: 'date',
    description: 'Fecha de nacimiento en formato ISO 8601',
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({ example: 'juanperez95', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ example: 'juan.perez@example.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ minLength: 8, format: 'password' })
  @IsString()
  @MinLength(8)
  contrasena: string;

  @ApiProperty({ required: false, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  num_celular?: string;
}
