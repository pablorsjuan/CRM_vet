import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RolUsuario } from '../../database/entities/user.entity';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';

interface VeterinarianRow {
  id_veterinario: number;
}

export interface ClinicalHistoryRow {
  id_historiaclinica: number;
  fecha: string;
  id_mascota: number;
  id_veterinario?: number;
  motivo_consulta: string;
  antecedentes_medicos: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
}

@Injectable()
export class ClinicalHistoriesService {
  constructor(private readonly dataSource: DataSource) {}

  async create(userId: number, dto: CreateClinicalHistoryDto) {
    const veterinarians = await this.dataSource.query<VeterinarianRow[]>(
      'SELECT id_veterinario FROM veterinarios WHERE id_usuario = $1',
      [userId],
    );
    const veterinarian = veterinarians[0];
    if (!veterinarian) {
      throw new ForbiddenException(
        'La cuenta no tiene un perfil de veterinario',
      );
    }

    const pets = await this.dataSource.query<{ id_mascota: number }[]>(
      'SELECT id_mascota FROM mascotas WHERE id_mascota = $1',
      [dto.id_mascota],
    );
    if (!pets[0]) {
      throw new NotFoundException('No existe la mascota indicada');
    }

    const histories = await this.dataSource.query<ClinicalHistoryRow[]>(
      `INSERT INTO historias_clinicas (
         fecha, id_mascota, id_veterinario, motivo_consulta,
         antecedentes_medicos, diagnostico, tratamiento
       )
       VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6)
       RETURNING id_historiaclinica, fecha, id_mascota, id_veterinario,
                 motivo_consulta, antecedentes_medicos, diagnostico, tratamiento`,
      [
        dto.id_mascota,
        veterinarian.id_veterinario,
        dto.motivo_consulta,
        dto.antecedentes_medicos ?? null,
        dto.diagnostico ?? null,
        dto.tratamiento ?? null,
      ],
    );

    return histories[0];
  }

  findForOwner(userId: number): Promise<ClinicalHistoryRow[]> {
    return this.dataSource.query<ClinicalHistoryRow[]>(
      `SELECT h.id_historiaclinica, h.fecha, h.id_mascota,
              h.motivo_consulta, h.antecedentes_medicos,
              h.diagnostico, h.tratamiento
       FROM historias_clinicas h
       INNER JOIN mascotas m ON m.id_mascota = h.id_mascota
       INNER JOIN duenos d ON d.id_dueno = m.id_dueno
       WHERE d.id_usuario = $1
       ORDER BY h.fecha DESC, h.id_historiaclinica DESC`,
      [userId],
    );
  }

  async findForPet(petId: number, userId: number, role: RolUsuario) {
    if (role === RolUsuario.DUENO) {
      const ownerPets = await this.dataSource.query<{ id_mascota: number }[]>(
        `SELECT m.id_mascota
         FROM mascotas m
         INNER JOIN duenos d ON d.id_dueno = m.id_dueno
         WHERE m.id_mascota = $1 AND d.id_usuario = $2`,
        [petId, userId],
      );
      if (!ownerPets[0]) {
        throw new ForbiddenException(
          'No tienes acceso al historial de esta mascota',
        );
      }
    } else if (role !== RolUsuario.VETERINARIO) {
      throw new ForbiddenException(
        'No tienes permisos para consultar historias clínicas',
      );
    }

    const histories = await this.dataSource.query<ClinicalHistoryRow[]>(
      `SELECT id_historiaclinica, fecha, id_mascota, motivo_consulta,
              antecedentes_medicos, diagnostico, tratamiento
       FROM historias_clinicas
       WHERE id_mascota = $1
       ORDER BY fecha DESC, id_historiaclinica DESC`,
      [petId],
    );

    return histories;
  }
}
