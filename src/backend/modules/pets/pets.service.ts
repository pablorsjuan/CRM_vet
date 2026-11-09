
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Pet } from '../../database/entities/pet.entity';
import { Owner } from '../../database/entities/owner.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,

    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,

    private readonly dataSource: DataSource,
  ) {}

  async createForUser(userId: number, createPetDto: CreatePetDto) {
    const savedPet = await this.dataSource.transaction(
      async (manager) => {
        const owner = await manager.findOneBy(Owner, {
          id_usuario: userId,
        });

        if (!owner) {
          throw new BadRequestException(
            'El usuario autenticado no tiene perfil de dueño',
          );
        }

        const pet = manager.create(Pet, {
          ...createPetDto,
          id_dueno: owner.id_dueno,
        });
        const saved = await manager.save(Pet, pet);

        await manager.increment(
          Owner,
          { id_dueno: owner.id_dueno },
          'num_mascotas',
          1,
        );

        return saved;
      },
    );

    return this.findOne(savedPet.id_mascota);
  }

  async findForUser(userId: number) {
    const owner = await this.ownersRepository.findOneBy({
      id_usuario: userId,
    });
    if (!owner) {
      throw new NotFoundException('El usuario autenticado no tiene perfil de dueño');
    }

    return this.petsRepository.find({
      where: { id_dueno: owner.id_dueno },
    });
  }

  async findAll() {
    return this.petsWithOwnerQuery().getMany();
  }

  // CONSULTAR MASCOTA POR ID
  async findOne(id: number) {
    const pet = await this.petsWithOwnerQuery()
      .where('pet.id_mascota = :id', { id })
      .getOne();

    if (!pet) {
      throw new NotFoundException(
        `La mascota con ID ${id} no existe`,
      );
    }

    return pet;
  }

  private petsWithOwnerQuery() {
    return this.petsRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.dueno', 'dueno')
      .leftJoin('dueno.usuario', 'ownerUser')
      .addSelect(['ownerUser.id_usuario', 'ownerUser.nombre_usuario']);
  }

  async belongsToUser(petId: number, userId: number) {
    const pet = await this.findOne(petId);
    return pet.dueno.id_usuario === userId;
  }

  // ACTUALIZAR MASCOTA
  async update(id: number, updatePetDto: UpdatePetDto) {
    await this.dataSource.transaction(async (manager) => {
      const pet = await manager.findOneBy(Pet, {
        id_mascota: id,
      });

      if (!pet) {
        throw new NotFoundException(
          `La mascota con ID ${id} no existe`,
        );
      }

      Object.assign(pet, updatePetDto);
      await manager.save(Pet, pet);
    });

    return this.findOne(id);
  }

  // ELIMINAR MASCOTA
  async remove(id: number) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const pet = await manager.findOneBy(Pet, {
          id_mascota: id,
        });

        if (!pet) {
          throw new NotFoundException(
            `La mascota con ID ${id} no existe`,
          );
        }

        const ownerId = pet.id_dueno;

        await manager.remove(Pet, pet);

        await manager.decrement(
          Owner,
          { id_dueno: ownerId },
          'num_mascotas',
          1,
        );
      });

      return {
        message: `Mascota ${id} eliminada correctamente`,
      };
    } catch (error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23503'
  ) {
    throw new BadRequestException(
      'No se puede eliminar la mascota porque tiene registros asociados',
    );
  }

  throw error;
    }
  }
}
