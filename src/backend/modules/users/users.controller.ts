
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../../database/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // REGISTRAR USUARIO
  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o matrícula profesional obligatoria.',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario, correo o matrícula profesional ya existe.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios obtenido correctamente.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  @Roles(
    RolUsuario.VETERINARIO,
    RolUsuario.PASEADOR,
    RolUsuario.PELUQUERO,
  )
  searchOwners(@Query('query') query: string) {
    return this.usersService.searchOwnersWithPets(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 400, description: 'El ID proporcionado no es válido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertSelfOrAdministrator(id, request);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertSelfOrAdministrator(id, request);
    if (
      [
        RolUsuario.VETERINARIO,
        RolUsuario.PELUQUERO,
        RolUsuario.PASEADOR,
      ].includes(request.user.rol)
      && updateUserDto.contrasena !== undefined
    ) {
      throw new ForbiddenException(
        'Los trabajadores no pueden cambiar su contraseña desde el perfil',
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Solicitud de eliminación procesada correctamente.' })
  @ApiResponse({ status: 400, description: 'El ID proporcionado no es válido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  private assertSelfOrAdministrator(
    userId: number,
    request: AuthenticatedRequest,
  ) {
    if (
      request.user.rol !== RolUsuario.ADMINISTRADOR
      && request.user.sub !== userId
    ) {
      throw new ForbiddenException('No tienes permisos para consultar este usuario');
    }
  }
}
