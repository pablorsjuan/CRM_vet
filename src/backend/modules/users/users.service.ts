
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, RolUsuario } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface OwnerPetSearchRow {
  id_usuario: number;
  nombre_usuario: string;
  usuario: string;
  id_mascota: number | null;
  nombre_mascota: string | null;
  especie: string | null;
  raza: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  peso: string | null;
  color: string | null;
  observaciones: string | null;
}

export interface OwnerPetSearchResult {
  id_usuario: number;
  nombre_usuario: string;
  usuario: string;
  mascotas: Array<Omit<
    OwnerPetSearchRow,
    'id_usuario' | 'nombre_usuario' | 'usuario'
  >>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // CREAR USUARIO

  // CREAR USUARIO Y SU PERFIL
  async create(createUserDto: CreateUserDto) {
    const {
      contrasena,
      matricula_profesional,
      especialidad,
      hora_paseo,
      anos_experiencia,
      ...datosUsuario
    } = createUserDto;

    // Validar información obligatoria según el rol
    if (
      datosUsuario.rol === RolUsuario.VETERINARIO &&
      !matricula_profesional
    ) {
      throw new BadRequestException(
        'La matrícula profesional es obligatoria para veterinarios',
      );
    }

    const hash = await bcrypt.hash(contrasena, 10);

    try {
      return await this.usersRepository.manager.transaction(
        async (manager) => {
          // 1. Crear usuario
          const user = manager.create(User, {
            ...datosUsuario,
            contrasena: hash,
          });

          const savedUser = await manager.save(User, user);
          const id = savedUser.id_usuario;

          // 2. Crear perfil según el rol
          switch (savedUser.rol) {
            case RolUsuario.DUENO:
              await manager.query(
                'INSERT INTO duenos (id_usuario) VALUES ($1)',
                [id],
              );
              break;

            case RolUsuario.VETERINARIO:
              await manager.query(
                `INSERT INTO veterinarios
                 (id_usuario, matricula_profesional, especialidad)
                 VALUES ($1, $2, $3)`,
                [id, matricula_profesional, especialidad ?? null],
              );
              break;

            case RolUsuario.PASEADOR:
              await manager.query(
                `INSERT INTO paseadores
                 (id_usuario, hora_paseo)
                 VALUES ($1, $2)`,
                [id, hora_paseo ?? null],
              );
              break;

            case RolUsuario.PELUQUERO:
              await manager.query(
                `INSERT INTO peluqueros
                 (id_usuario, anos_experiencia)
                 VALUES ($1, $2)`,
                [id, anos_experiencia ?? null],
              );
              break;

            case RolUsuario.ADMINISTRADOR:
              break;
          }

          // 3. Devolver datos sin contraseña
          const { contrasena: _, ...resultado } = savedUser;
          return resultado;
        },
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'El usuario, correo o matrícula profesional ya existe',
        );
      }

      throw error;
    }
  }


  // CONSULTAR TODOS LOS USUARIOS
  async findAll() {
    return this.usersRepository.find();
  }

  async searchOwnersWithPets(query: string): Promise<OwnerPetSearchResult[]> {
    const searchTerm = query?.trim();
    if (!searchTerm || searchTerm.length < 2) {
      throw new BadRequestException(
        'Ingresa al menos dos caracteres para buscar un usuario',
      );
    }

    const rows = await this.usersRepository.manager.query<OwnerPetSearchRow[]>(
      `WITH owner_matches AS (
         SELECT id_usuario, nombre_usuario, usuario
         FROM usuarios
         WHERE rol = $1
           AND (nombre_usuario ILIKE $2 OR usuario ILIKE $2)
         ORDER BY nombre_usuario
         LIMIT 50
       )
       SELECT
         u.id_usuario,
         u.nombre_usuario,
         u.usuario,
         d.id_dueno,
         p.id_mascota,
         p.nombre_mascota,
         p.especie,
         p.raza,
         p.sexo,
         p.fecha_nacimiento,
         p.peso,
         p.color,
         p.observaciones
       FROM owner_matches u
       INNER JOIN duenos d ON d.id_usuario = u.id_usuario
       LEFT JOIN mascotas p ON p.id_dueno = d.id_dueno
       ORDER BY u.nombre_usuario, p.nombre_mascota
      `,
      [RolUsuario.DUENO, `%${searchTerm}%`],
    );

    const owners = new Map<number, OwnerPetSearchResult>();

    for (const row of rows) {
      if (!owners.has(row.id_usuario)) {
        owners.set(row.id_usuario, {
          id_usuario: row.id_usuario,
          nombre_usuario: row.nombre_usuario,
          usuario: row.usuario,
          mascotas: [],
        });
      }

      const owner = owners.get(row.id_usuario);
      if (row.id_mascota !== null && owner) {
        owner.mascotas.push({
          id_mascota: row.id_mascota,
          nombre_mascota: row.nombre_mascota,
          especie: row.especie,
          raza: row.raza,
          sexo: row.sexo,
          fecha_nacimiento: row.fecha_nacimiento,
          peso: row.peso,
          color: row.color,
          observaciones: row.observaciones,
        });
      }
    }

    return Array.from(owners.values());
  }

  // CONSULTAR USUARIO POR ID
  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({
      id_usuario: id,
    });

    if (!user) {
      throw new NotFoundException(
        `No existe un usuario con ID ${id}`,
      );
    }

    return user;
  }


  // ACTUALIZAR USUARIO
  async update(id: number, updateUserDto: UpdateUserDto) {
    // 1. Buscar usuario existente
    const user = await this.findOne(id);

    // 2. Separar contraseña de los demás datos
    const { contrasena, ...datosActualizar } = updateUserDto;

    // 3. Actualizar datos generales
    Object.assign(user, datosActualizar);

    // 4. Encriptar contraseña si se proporciona una nueva
    if (contrasena !== undefined) {
      user.contrasena = await bcrypt.hash(contrasena, 10);
    }

    try {
      // 5. Guardar cambios en PostgreSQL
      await this.usersRepository.save(user);

      // 6. Consultar nuevamente sin incluir contraseña
      return await this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'El nombre de usuario o correo ya está registrado',
        );
      }

      throw error;
    }
  }


  // ELIMINAR USUARIO
  async remove(id: number) {
    const user = await this.findOne(id);

    try {
      await this.usersRepository.manager.transaction(
        async (manager) => {
          // Eliminar el perfil asociado al usuario.
          // PostgreSQL impedirá la eliminación si existen
          // mascotas, citas o historias clínicas dependientes.

          const tablasPorRol: Record<string, string> = {
            [RolUsuario.DUENO]: 'duenos',
            [RolUsuario.VETERINARIO]: 'veterinarios',
            [RolUsuario.PASEADOR]: 'paseadores',
            [RolUsuario.PELUQUERO]: 'peluqueros',
          };

          const tabla = tablasPorRol[user.rol];

          if (tabla) {
            await manager.query(
              `DELETE FROM ${tabla} WHERE id_usuario = $1`,
              [id],
            );
          }

          await manager.delete(User, { id_usuario: id });
        },
      );

      return {
        message: `Usuario ${id} eliminado correctamente`,
      };
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'No se puede eliminar el usuario porque tiene registros asociados',
        );
      }

      throw error;
    }
  }

}
