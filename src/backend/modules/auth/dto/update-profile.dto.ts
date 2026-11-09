import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ maxLength: 50, example: 'juanperez95' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ maxLength: 255, example: 'juan.perez@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ maxLength: 50, example: '3001234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  num_celular: string;
}
