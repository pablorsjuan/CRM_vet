
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
  ) {}


  // REGISTRAR MASCOTA
  @Post()
  @ApiOperation({ summary: 'Registrar una nueva mascota' })
  @ApiResponse({
    status: 201,
    description: 'Mascota registrada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el dueño indicado no existe.',
  })
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  // CONSULTAR TODAS LAS MASCOTAS
  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number) {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.remove(id);
  }
}
