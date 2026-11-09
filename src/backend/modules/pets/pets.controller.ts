
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AuthenticatedRequest } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../../database/entities/user.entity';

@ApiTags('pets')
@ApiBearerAuth()
@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
  ) {}


  // REGISTRAR MASCOTA
  @Post()
  @Roles(RolUsuario.DUENO)
  @ApiOperation({ summary: 'Registrar una nueva mascota' })
  @ApiResponse({
    status: 201,
    description: 'Mascota registrada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el dueño indicado no existe.',
  })
  create(
    @Body() createPetDto: CreatePetDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.petsService.createForUser(request.user.sub, createPetDto);
  }

  @Get('mine')
  @Roles(RolUsuario.DUENO)
  @ApiOperation({ summary: 'Obtener las mascotas del usuario autenticado' })
  findMine(@Req() request: AuthenticatedRequest) {
    return this.petsService.findForUser(request.user.sub);
  }

  @Get()
  @Roles(
    RolUsuario.ADMINISTRADOR,
    RolUsuario.VETERINARIO,
    RolUsuario.PASEADOR,
    RolUsuario.PELUQUERO,
  )
  @ApiOperation({ summary: 'Obtener todas las mascotas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de mascotas obtenido correctamente.',
  })
  findAll() {
    return this.petsService.findAll();
  }

  // CONSULTAR MASCOTA POR ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Mascota encontrada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID proporcionado no es válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota no encontrada.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.assertOwnerOrAdministrator(id, request);
    return this.petsService.findOne(id);
  }

  // ACTUALIZAR MASCOTA
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de una mascota' })
  @ApiResponse({
    status: 200,
    description: 'Mascota actualizada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de actualización inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota o dueño asociado no encontrado.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.assertOwnerOrAdministrator(id, request);
    return this.petsService.update(id, updatePetDto);
  }

  // ELIMINAR MASCOTA
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una mascota por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de eliminación procesada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido o eliminación no permitida por registros asociados.',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota no encontrada.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.assertOwnerOrAdministrator(id, request);
    return this.petsService.remove(id);
  }

  private async assertOwnerOrAdministrator(
    petId: number,
    request: AuthenticatedRequest,
  ) {
    if (request.user.rol === RolUsuario.ADMINISTRADOR) {
      return;
    }

    if (
      request.user.rol !== RolUsuario.DUENO
      || !(await this.petsService.belongsToUser(petId, request.user.sub))
    ) {
      throw new ForbiddenException('No tienes permisos para acceder a esta mascota');
    }
  }
}
