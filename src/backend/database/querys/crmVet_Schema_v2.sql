
-- CRM Veterinario
-- Esquema v2 - PostgreSQL 17
-- Ejecutar conectado a la base de datos crm_vet.
-- No ejecutar sobre una base con tablas existentes.

BEGIN;

-- 1. TIPOS ENUM

CREATE TYPE rol_usuario AS ENUM (
    'administrador',
    'veterinario',
    'paseador',
    'peluquero',
    'dueno'
);

CREATE TYPE tipo_cita AS ENUM (
    'veterinaria',
    'paseo',
    'peluqueria'
);

CREATE TYPE estado_cita AS ENUM (
    'pendiente',
    'completada',
    'cancelada'
);

-- 2. USUARIOS

CREATE TABLE usuarios (
    id_usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    sexo VARCHAR(20),
    fecha_nacimiento DATE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    num_celular VARCHAR(50),
    email VARCHAR(255) NOT NULL UNIQUE,
    rol rol_usuario NOT NULL
);

-- 3. DUEÑOS

CREATE TABLE duenos (
    id_dueno INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    num_mascotas INT NOT NULL DEFAULT 0
        CHECK (num_mascotas >= 0),

    CONSTRAINT fk_duenos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

-- 4. VETERINARIOS

CREATE TABLE veterinarios (
    id_veterinario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    matricula_profesional VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(50),

    CONSTRAINT fk_veterinarios_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

-- 5. PASEADORES

CREATE TABLE paseadores (
    id_paseador INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    hora_paseo TIME,

    CONSTRAINT fk_paseadores_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

-- 6. PELUQUEROS

CREATE TABLE peluqueros (
    id_peluquero INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    anos_experiencia INT
        CHECK (anos_experiencia >= 0),

    CONSTRAINT fk_peluqueros_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

-- 7. MASCOTAS

CREATE TABLE mascotas (
    id_mascota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_mascota VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    sexo VARCHAR(20),
    fecha_nacimiento DATE,
    peso NUMERIC(6,2)
        CHECK (peso > 0),
    color VARCHAR(50),
    observaciones TEXT,
    id_dueno INT NOT NULL,

    CONSTRAINT fk_mascotas_dueno
        FOREIGN KEY (id_dueno)
        REFERENCES duenos(id_dueno)
);

-- 8. HISTORIAS CLÍNICAS

CREATE TABLE historias_clinicas (
    id_historiaclinica INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha DATE NOT NULL,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    motivo_consulta VARCHAR(250) NOT NULL,
    antecedentes_medicos TEXT,
    diagnostico TEXT,
    tratamiento TEXT,

    CONSTRAINT fk_historias_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota),

    CONSTRAINT fk_historias_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES veterinarios(id_veterinario)
);

-- 9. CITAS

CREATE TABLE citas (
    id_cita INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha DATE NOT NULL,
    id_mascota INT NOT NULL,
    id_profesional INT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    motivo VARCHAR(250),
    tipo_cita tipo_cita NOT NULL,
    estado estado_cita NOT NULL DEFAULT 'pendiente',

    CONSTRAINT fk_citas_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota),

    CONSTRAINT fk_citas_profesional
        FOREIGN KEY (id_profesional)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT chk_citas_horas
        CHECK (hora_final > hora_inicio)
);

COMMIT;
