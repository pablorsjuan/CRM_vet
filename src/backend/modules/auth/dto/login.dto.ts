import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'juanperez95' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ example: 'ClaveSegura123!', format: 'password' })
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
