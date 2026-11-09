import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Pet } from './pet.entity';
import { User } from './user.entity';

@Entity('duenos')
export class Owner {
  @PrimaryGeneratedColumn()
  id_dueno: number;

  @Column({ type: 'int', unique: true })
  id_usuario: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id_usuario' })
  usuario: User;

  @Column({ type: 'int', default: 0 })
  num_mascotas: number;

  @OneToMany(() => Pet, (pet) => pet.dueno)
  mascotas: Pet[];
}
