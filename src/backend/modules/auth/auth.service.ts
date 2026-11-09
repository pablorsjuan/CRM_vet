import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolUsuario } from '../../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthTokenPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.usersService.create({
      ...registerDto,
      rol: RolUsuario.DUENO,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findForAuthentication(
      loginDto.usuario,
    );
    if (
      !user ||
      !(await this.usersService.verifyPassword(user, loginDto.contrasena))
    ) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload: AuthTokenPayload = {
      sub: user.id_usuario,
      usuario: user.usuario,
      rol: user.rol,
    };

    const safeUser = {
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      sexo: user.sexo,
      fecha_nacimiento: user.fecha_nacimiento,
      usuario: user.usuario,
      num_celular: user.num_celular,
      email: user.email,
      rol: user.rol,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: safeUser,
    };
  }

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    return this.usersService.update(userId, updateProfileDto);
  }
}
