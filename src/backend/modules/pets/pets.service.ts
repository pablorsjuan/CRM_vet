
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

  // CREAR MASCOTA
  async create(createPetDto: CreatePetDto) {
    const savedPet = await this.dataSource.transaction(
      async (manager) => {
        const owner = await manager.findOneBy(Owner, {
          id_dueno: createPetDto.id_dueno,
        });

        if (!owner) {
          throw new BadRequestException(
            'El dueño indicado no existe',
          );
        }

        const pet = manager.create(Pet, createPetDto);
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

  // CONSULTAR TODAS LAS MASCOTAS
  async findAll() {
    return this.petsRepository.find({
      relations: {
        dueno: true,
      },
    });
  }

  // CONSULTAR MASCOTA POR ID
  async findOne(id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id_mascota: id },
      relations: {
        dueno: true,
      },
    });

    if (!pet) {
      throw new NotFoundException(
        `La mascota con ID ${id} no existe`,
      );
    }

    return pet;
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

      const previousOwnerId = pet.id_dueno;
      const newOwnerId =
        updatePetDto.id_dueno ?? previousOwnerId;

      if (newOwnerId !== previousOwnerId) {
        const newOwner = await manager.findOneBy(Owner, {
          id_dueno: newOwnerId,
        });

        if (!newOwner) {
          throw new BadRequestException(
            'El nuevo dueño indicado no existe',
          );
        }
      }

      Object.assign(pet, updatePetDto);
      await manager.save(Pet, pet);

      if (newOwnerId !== previousOwnerId) {
        await manager.decrement(
          Owner,
          { id_dueno: previousOwnerId },
          'num_mascotas',
          1,
        );

        await manager.increment(
          Owner,
          { id_dueno: newOwnerId },
          'num_mascotas',
          1,
        );
      }
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
