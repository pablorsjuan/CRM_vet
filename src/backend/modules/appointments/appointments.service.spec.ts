import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RolUsuario } from '../../database/entities/user.entity';
import { AppointmentsService } from './appointments.service';
import { TipoCita } from './dto/create-appointment.dto';

describe('AppointmentsService availability', () => {
  const query = jest.fn();
  const service = new AppointmentsService({
    query,
  } as unknown as DataSource);

  beforeEach(() => {
    query.mockReset();
  });

  it('returns only slots that do not overlap an existing appointment', async () => {
    query
      .mockResolvedValueOnce([{ id_usuario: 12, nombre_usuario: 'Andrea' }])
      .mockResolvedValueOnce([
        {
          id_profesional: 12,
          hora_inicio: '08:00:00',
          hora_final: '08:30:00',
        },
      ]);

    const availability = await service.getAvailability(
      dateInFuture(),
      TipoCita.VETERINARIA,
      4,
      RolUsuario.DUENO,
    );

    expect(availability).toEqual([
      {
        id_usuario: 12,
        nombre_usuario: 'Andrea',
        horarios: [
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
        ],
      },
    ]);
  });

  it('rejects unknown service types before querying the database', async () => {
    await expect(
      service.getAvailability(
        dateInFuture(),
        'unknown' as TipoCita,
        4,
        RolUsuario.DUENO,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(query).not.toHaveBeenCalled();
  });
});

describe('AppointmentsService findMine', () => {
  const query = jest.fn();
  const service = new AppointmentsService({
    query,
  } as unknown as DataSource);

  beforeEach(() => {
    query.mockReset();
  });

  it.each([
    RolUsuario.VETERINARIO,
    RolUsuario.PELUQUERO,
    RolUsuario.PASEADOR,
  ])('returns only pending appointments assigned to the worker (%s)', async (role) => {
    const pendingAppointments = [
      {
        id_cita: 9,
        estado: 'pendiente',
        nombre_mascota: 'Luna',
        nombre_usuario: 'Andrea',
        hora: '09:00:00',
        tipo_servicio: 'Veterinaria',
      },
    ];
    query.mockResolvedValue(pendingAppointments);

    await expect(
      service.findMine(12, role),
    ).resolves.toEqual(pendingAppointments);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(
        "WHERE c.id_profesional = $1\n         AND c.estado = 'pendiente'",
      ),
      [12],
    );
  });

  it('returns only pending appointments belonging to the owner', async () => {
    query.mockResolvedValue([]);

    await service.findMine(4, RolUsuario.DUENO);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(
        "WHERE d.id_usuario = $1\n         AND c.estado = 'pendiente'",
      ),
      [4],
    );
  });
});

function dateInFuture() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
