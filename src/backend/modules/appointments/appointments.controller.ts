import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolUsuario } from '../../database/entities/user.entity';
import { AuthenticatedRequest } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { CreateAppointmentDto, TipoCita } from './dto/create-appointment.dto';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('availability')
  @Roles(
    RolUsuario.DUENO,
    RolUsuario.VETERINARIO,
    RolUsuario.PASEADOR,
    RolUsuario.PELUQUERO,
  )
  availability(
    @Query('fecha') date: string,
    @Query('tipo_cita') serviceType: TipoCita,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.appointmentsService.getAvailability(
      date,
      serviceType,
      request.user.sub,
      request.user.rol,
    );
  }

  @Get('mine')
  @Roles(
    RolUsuario.DUENO,
    RolUsuario.VETERINARIO,
    RolUsuario.PASEADOR,
    RolUsuario.PELUQUERO,
  )
  findMine(@Req() request: AuthenticatedRequest) {
    return this.appointmentsService.findMine(
      request.user.sub,
      request.user.rol,
    );
  }

  @Post()
  @Roles(
    RolUsuario.DUENO,
    RolUsuario.VETERINARIO,
    RolUsuario.PASEADOR,
    RolUsuario.PELUQUERO,
  )
  create(
    @Body() dto: CreateAppointmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.appointmentsService.create(
      request.user.sub,
      request.user.rol,
      dto,
    );
  }

  @Patch(':id/cancel')
  @Roles(RolUsuario.DUENO)
  cancel(
    @Param('id', ParseIntPipe) appointmentId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.appointmentsService.cancel(request.user.sub, appointmentId);
  }
}
