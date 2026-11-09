import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolUsuario } from '../../database/entities/user.entity';
import { AuthenticatedRequest } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';
import { ClinicalHistoriesService } from './clinical-histories.service';

@ApiTags('clinical-histories')
@ApiBearerAuth()
@Controller('clinical-histories')
export class ClinicalHistoriesController {
  constructor(private readonly historiesService: ClinicalHistoriesService) {}

  @Post()
  @Roles(RolUsuario.VETERINARIO)
  create(
    @Body() dto: CreateClinicalHistoryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.historiesService.create(request.user.sub, dto);
  }

  @Get('mine')
  @Roles(RolUsuario.DUENO)
  findMine(@Req() request: AuthenticatedRequest) {
    return this.historiesService.findForOwner(request.user.sub);
  }

  @Get('pet/:petId')
  @Roles(RolUsuario.DUENO, RolUsuario.VETERINARIO)
  findForPet(
    @Param('petId', ParseIntPipe) petId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.historiesService.findForPet(
      petId,
      request.user.sub,
      request.user.rol,
    );
  }
}
