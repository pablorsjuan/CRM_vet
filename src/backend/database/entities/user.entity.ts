import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  VETERINARIO = 'veterinario',
  PASEADOR = 'paseador',
  PELUQUERO = 'peluquero',
  DUENO = 'dueno',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'nombre_usuario', length: 50 })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  sexo: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string | null;

  @Column({ type: 'varchar', length: 50, unique: true })
  usuario: string;

  @Column({ type: 'varchar', length: 255, select: false })
  contrasena: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  num_celular: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    enumName: 'rol_usuario',
  })
  rol: RolUsuario;
}