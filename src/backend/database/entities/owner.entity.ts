
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Pet } from './pet.entity';

@Entity('duenos')
export class Owner {
  @PrimaryGeneratedColumn()
  id_dueno: number;

  @Column({ type: 'int', unique: true })
  id_usuario: number;

  @Column({ type: 'int', default: 0 })
  num_mascotas: number;

  @OneToMany(() => Pet, (pet) => pet.dueno)
  mascotas: Pet[];
}
