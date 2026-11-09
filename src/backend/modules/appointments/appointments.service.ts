import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RolUsuario } from '../../database/entities/user.entity';
import { CreateAppointmentDto, TipoCita } from './dto/create-appointment.dto';

interface ProfessionalRow {
  id_usuario: number;
  nombre_usuario: string;
}

interface BusySlotRow {
  id_profesional: number;
  hora_inicio: string;
  hora_final: string;
}

export interface AppointmentRow {
  id_cita: number;
  fecha: string;
  id_mascota: number;
  nombre_mascota: string;
  id_profesional: number;
  nombre_profesional: string;
  nombre_usuario: string;
  hora: string;
  hora_final: string;
  motivo: string | null;
  tipo_cita: TipoCita;
  tipo_servicio: string;
  estado: string;
}

const SERVICE_ROLE: Record<TipoCita, RolUsuario> = {
  [TipoCita.VETERINARIA]: RolUsuario.VETERINARIO,
  [TipoCita.PASEO]: RolUsuario.PASEADOR,
  [TipoCita.PELUQUERIA]: RolUsuario.PELUQUERO,
};

const SERVICE_DURATION_MINUTES: Record<TipoCita, number> = {
  [TipoCita.VETERINARIA]: 30,
  [TipoCita.PASEO]: 60,
  [TipoCita.PELUQUERIA]: 60,
};

const PROFILE_TABLE: Record<TipoCita, string> = {
  [TipoCita.VETERINARIA]: 'veterinarios',
  [TipoCita.PASEO]: 'paseadores',
  [TipoCita.PELUQUERIA]: 'peluqueros',
};

const OPENING_MINUTE = 8 * 60;
const CLOSING_MINUTE = 18 * 60;
const SLOT_STEP_MINUTES = 30;

@Injectable()
export class AppointmentsService {
  constructor(private readonly dataSource: DataSource) {}

  async getAvailability(
    date: string,
    serviceType: TipoCita,
    userId: number,
    role: RolUsuario,
  ) {
    this.validateServiceType(serviceType);
    this.validateDate(date);
    const professionalRole = SERVICE_ROLE[serviceType];
    const profileTable = PROFILE_TABLE[serviceType];
    const workerId = role === RolUsuario.DUENO ? null : userId;
    if (workerId !== null && role !== professionalRole) {
      throw new ForbiddenException(
        'Solo puedes consultar horarios de tu tipo de servicio',
      );
    }

    const professionals = await this.dataSource.query<ProfessionalRow[]>(
      `SELECT u.id_usuario, u.nombre_usuario
       FROM usuarios u
       INNER JOIN ${profileTable} p ON p.id_usuario = u.id_usuario
       WHERE u.rol = $1
         AND ($2::int IS NULL OR u.id_usuario = $2)
       ORDER BY u.nombre_usuario`,
      [professionalRole, workerId],
    );
    if (workerId !== null && professionals.length === 0) {
      throw new ForbiddenException(
        'La cuenta no tiene un perfil profesional para este servicio',
      );
    }

    if (professionals.length === 0 || date < this.localDate()) {
      return professionals.map((professional) => ({
        ...professional,
        horarios: [],
      }));
    }

    const professionalIds = professionals.map(({ id_usuario }) => id_usuario);
    const busySlots = await this.dataSource.query<BusySlotRow[]>(
      `SELECT id_profesional, hora_inicio::text, hora_final::text
       FROM citas
       WHERE fecha = $1
         AND estado = 'pendiente'
         AND id_profesional = ANY($2::int[])`,
      [date, professionalIds],
    );
    const duration = SERVICE_DURATION_MINUTES[serviceType];
    const firstAvailableMinute =
      date === this.localDate() ? this.nextAvailableMinute() : OPENING_MINUTE;

    return professionals.map((professional) => {
      const professionalBusySlots = busySlots.filter(
        (slot) => slot.id_profesional === professional.id_usuario,
      );
      const horarios: string[] = [];

      for (
        let start = firstAvailableMinute;
        start + duration <= CLOSING_MINUTE;
        start += SLOT_STEP_MINUTES
      ) {
        const end = start + duration;
        const overlaps = professionalBusySlots.some((slot) => {
          const busyStart = this.timeToMinutes(slot.hora_inicio);
          const busyEnd = this.timeToMinutes(slot.hora_final);
          return start < busyEnd && end > busyStart;
        });
        if (!overlaps) {
          horarios.push(this.minutesToTime(start));
        }
      }

      return { ...professional, horarios };
    });
  }

  async findMine(userId: number, role: RolUsuario): Promise<AppointmentRow[]> {
    const ownerFilter = role === RolUsuario.DUENO;
    return this.dataSource.query<AppointmentRow[]>(
      `SELECT c.id_cita, c.fecha::text, c.id_mascota, m.nombre_mascota,
              c.id_profesional, profesional.nombre_usuario AS nombre_profesional,
              propietario.nombre_usuario, c.hora_inicio::text AS hora,
              c.hora_final::text, c.motivo, c.tipo_cita,
              CASE c.tipo_cita
                WHEN 'veterinaria' THEN 'Veterinaria'
                WHEN 'peluqueria' THEN 'Peluquería'
                WHEN 'paseo' THEN 'Paseo'
              END AS tipo_servicio,
              c.estado
       FROM citas c
       INNER JOIN mascotas m ON m.id_mascota = c.id_mascota
       INNER JOIN usuarios profesional ON profesional.id_usuario = c.id_profesional
       INNER JOIN duenos d ON d.id_dueno = m.id_dueno
       INNER JOIN usuarios propietario ON propietario.id_usuario = d.id_usuario
       WHERE ${ownerFilter ? 'd.id_usuario' : 'c.id_profesional'} = $1
         AND c.estado = 'pendiente'
       ORDER BY c.fecha, c.hora_inicio, c.id_cita`,
      [userId],
    );
  }

  async create(
    userId: number,
    role: RolUsuario,
    dto: CreateAppointmentDto,
  ): Promise<AppointmentRow> {
    this.validateServiceType(dto.tipo_cita);
    this.validateDate(dto.fecha);
    const professionalRole = SERVICE_ROLE[dto.tipo_cita];
    if (role !== RolUsuario.DUENO && role !== professionalRole) {
      throw new ForbiddenException(
        'No puedes agendar citas para un servicio distinto a tu rol',
      );
    }

    const duration = SERVICE_DURATION_MINUTES[dto.tipo_cita];
    const start = this.timeToMinutes(dto.hora_inicio);
    const end = start + duration;
    if (
      start < OPENING_MINUTE ||
      end > CLOSING_MINUTE ||
      start % SLOT_STEP_MINUTES !== 0 ||
      (dto.fecha === this.localDate() && start < this.nextAvailableMinute())
    ) {
      throw new BadRequestException(
        'El horario seleccionado no está disponible',
      );
    }

    const professionalId =
      role === RolUsuario.DUENO ? dto.id_profesional : userId;
    if (!professionalId) {
      throw new BadRequestException(
        'Debes seleccionar un profesional disponible',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const professionals = await manager.query<ProfessionalRow[]>(
        `SELECT u.id_usuario, u.nombre_usuario
         FROM usuarios u
         INNER JOIN ${PROFILE_TABLE[dto.tipo_cita]} p ON p.id_usuario = u.id_usuario
         WHERE u.id_usuario = $1 AND u.rol = $2
         FOR UPDATE OF u`,
        [professionalId, professionalRole],
      );
      if (!professionals[0]) {
        throw new BadRequestException(
          'El profesional no corresponde al servicio seleccionado',
        );
      }

      const pets = await manager.query<{ id_mascota: number }[]>(
        `SELECT m.id_mascota
         FROM mascotas m
         INNER JOIN duenos d ON d.id_dueno = m.id_dueno
         WHERE m.id_mascota = $1
           AND ($2::int IS NULL OR d.id_usuario = $2)`,
        [dto.id_mascota, role === RolUsuario.DUENO ? userId : null],
      );
      if (!pets[0]) {
        throw new NotFoundException(
          'No existe una mascota accesible con ese ID',
        );
      }

      const endTime = this.minutesToTime(end);
      const conflicts = await manager.query<{ id_cita: number }[]>(
        `SELECT id_cita
         FROM citas
         WHERE id_profesional = $1
           AND fecha = $2
           AND estado = 'pendiente'
           AND hora_inicio < $4::time
           AND hora_final > $3::time
         LIMIT 1`,
        [professionalId, dto.fecha, dto.hora_inicio, endTime],
      );
      if (conflicts.length) {
        throw new ConflictException(
          'Ese horario acaba de ser ocupado. Selecciona otro horario disponible.',
        );
      }

      const inserted = await manager.query<{ id_cita: number }[]>(
        `INSERT INTO citas (
           fecha, id_mascota, id_profesional, hora_inicio, hora_final,
           motivo, tipo_cita, estado
         )
         VALUES ($1, $2, $3, $4::time, $5::time, $6, $7, 'pendiente')
         RETURNING id_cita`,
        [
          dto.fecha,
          dto.id_mascota,
          professionalId,
          dto.hora_inicio,
          endTime,
          dto.motivo ?? null,
          dto.tipo_cita,
        ],
      );
      const appointments = await manager.query<AppointmentRow[]>(
        `SELECT c.id_cita, c.fecha::text, c.id_mascota, m.nombre_mascota,
                c.id_profesional, profesional.nombre_usuario AS nombre_profesional,
                propietario.nombre_usuario, c.hora_inicio::text AS hora,
                c.hora_final::text, c.motivo, c.tipo_cita,
                CASE c.tipo_cita
                  WHEN 'veterinaria' THEN 'Veterinaria'
                  WHEN 'peluqueria' THEN 'Peluquería'
                  WHEN 'paseo' THEN 'Paseo'
                END AS tipo_servicio,
                c.estado
         FROM citas c
         INNER JOIN mascotas m ON m.id_mascota = c.id_mascota
         INNER JOIN usuarios profesional ON profesional.id_usuario = c.id_profesional
         INNER JOIN duenos d ON d.id_dueno = m.id_dueno
         INNER JOIN usuarios propietario ON propietario.id_usuario = d.id_usuario
         WHERE c.id_cita = $1`,
        [inserted[0].id_cita],
      );
      return appointments[0];
    });
  }

  async cancel(userId: number, appointmentId: number) {
    const updated = await this.dataSource.query<{ id_cita: number }[]>(
      `UPDATE citas c
       SET estado = 'cancelada'
       FROM mascotas m, duenos d
       WHERE c.id_cita = $1
         AND c.id_mascota = m.id_mascota
         AND m.id_dueno = d.id_dueno
         AND d.id_usuario = $2
         AND c.estado = 'pendiente'
       RETURNING c.id_cita`,
      [appointmentId, userId],
    );
    if (!updated[0]) {
      throw new NotFoundException(
        'No se encontró una cita pendiente que puedas cancelar',
      );
    }

    return { id_cita: updated[0].id_cita, estado: 'cancelada' };
  }

  private validateDate(date: string) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('La fecha de la cita no es válida');
    }
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException('La fecha de la cita no es válida');
    }

    if (date < this.localDate()) {
      throw new BadRequestException(
        'La fecha de la cita no puede estar en el pasado',
      );
    }
  }

  private validateServiceType(serviceType: TipoCita) {
    if (!Object.values(TipoCita).includes(serviceType)) {
      throw new BadRequestException('El tipo de servicio no es válido');
    }
  }

  private localDate() {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
  }

  private nextAvailableMinute() {
    const now = new Date();
    const currentMinute = now.getHours() * 60 + now.getMinutes() + 1;
    return Math.ceil(currentMinute / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;
  }

  private timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number) {
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }
}
