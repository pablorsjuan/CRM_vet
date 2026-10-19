
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Owner } from './owner.entity';

@Entity('mascotas')
export class Pet {
  @PrimaryGeneratedColumn({ name: 'id_mascota' })
  id_mascota: number;

  @Column({ type: 'varchar', length: 50 })
  nombre_mascota: string;

  @Column({ type: 'varchar', length: 50 })
  especie: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  raza: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  sexo: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string | null;

  @Column({ type: 'numeric', nullable: true })
  peso: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ type: 'int' })
  id_dueno: number;

  @ManyToOne(() => Owner, (owner) => owner.mascotas, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_dueno',
    referencedColumnName: 'id_dueno',
  })
  dueno: Owner;
}
