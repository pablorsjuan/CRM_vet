CREATE DATABASE CRM_VET IF NO EXISTS;

-- =========================================================
-- Ver mis tablas creadas
-- =========================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- =========================================================
-- Enums
-- =========================================================

CREATE TYPE rol_usuario AS ENUM (
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

-- =========================================================
-- TABLA: USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id_usuario INT GENERATED ALWAYS AS IDENTITY,
    nombre_usuario VARCHAR(50) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE,
    usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    num_celular varchar(50),
    email VARCHAR(50),
    rol rol_usuario NOT NULL,

    CONSTRAINT pk_usuarios
        PRIMARY KEY (id_usuario),

    CONSTRAINT uq_usuarios_usuario
        UNIQUE (usuario),

    CONSTRAINT uq_usuarios_email
        UNIQUE (email)
);


-- =========================================================
-- TABLA: PASEADORES
-- =========================================================

CREATE TABLE paseadores (
    id_usuario INT NOT NULL,
    id_paseador INT GENERATED ALWAYS AS IDENTITY,
    hora_paseo TIME,

    CONSTRAINT pk_paseadores
        PRIMARY KEY (id_paseador),

    CONSTRAINT fk_paseadores_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT uq_paseadores_persona
        UNIQUE (id_usuario)
);


-- =========================================================
-- TABLA: PELUQUEROS
-- =========================================================

CREATE TABLE peluqueros (
    id_usuario INT NOT NULL,
    id_peluquero INT GENERATED ALWAYS AS IDENTITY,
    anos_experiencia INT,

    CONSTRAINT pk_peluqueros
        PRIMARY KEY (id_peluquero),

    CONSTRAINT fk_peluqueros_usuario
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario),

    CONSTRAINT uq_peluqueros_persona
        UNIQUE (id_usuario), 

    CONSTRAINT chk_peluqueros_experiencia
        CHECK (anos_experiencia >= 0)
);


-- =========================================================
-- TABLA: VETERINARIOS
-- =========================================================

CREATE TABLE veterinarios (
    id_usuario INT NOT NULL,
    id_veterinario INT GENERATED ALWAYS AS IDENTITY,
    matricula_profesional INT NOT NULL,
    especialidad VARCHAR(50),

    CONSTRAINT pk_veterinarios
        PRIMARY KEY (id_veterinario),

    CONSTRAINT fk_veterinarios_usuario
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario),

    CONSTRAINT uq_veterinarios_persona
        UNIQUE (id_usuario), 

    CONSTRAINT uq_veterinarios_matricula
        UNIQUE (matricula_profesional)
);


-- =========================================================
-- TABLA: DUEÑOS
-- =========================================================

CREATE TABLE duenos (
    id_usuario INT NOT NULL,
    id_dueno INT GENERATED ALWAYS AS IDENTITY,
    num_mascotas INT DEFAULT 0,

    CONSTRAINT pk_duenos
        PRIMARY KEY (id_dueno),

    CONSTRAINT fk_duenos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT uq_duenos_persona
        UNIQUE (id_usuario),

    CONSTRAINT chk_duenos_num_mascotas
        CHECK (num_mascotas >= 0)
);


-- =========================================================
-- TABLA: MASCOTAS
-- =========================================================

CREATE TABLE mascotas (
    id_mascota INT GENERATED ALWAYS AS IDENTITY,
    nombre_mascota VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    id_dueno INT NOT NULL,

    CONSTRAINT pk_mascotas
        PRIMARY KEY (id_mascota),

    CONSTRAINT fk_mascotas_dueno
        FOREIGN KEY (id_dueno)
        REFERENCES duenos(id_dueno)
);

-- =========================================================
-- TABLA: HISTORIAS CLÍNICAS
-- =========================================================

CREATE TABLE historias_clinicas (
    id_historiaclinica INT GENERATED ALWAYS AS IDENTITY,
    fecha DATE NOT NULL,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    motivo_consulta VARCHAR(250) NOT NULL,
    antecedentes_medicos CHAR(250),
    diagnostico VARCHAR(250),
    tratamiento VARCHAR(250),

    CONSTRAINT pk_historias_clinicas
        PRIMARY KEY (id_historiaclinica),

    CONSTRAINT fk_historias_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota),

    CONSTRAINT fk_historias_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES veterinarios(id_veterinario)
);


-- =========================================================
-- TABLA: CITAS
-- =========================================================

CREATE TABLE citas (
    id_cita INT GENERATED ALWAYS AS IDENTITY,
    fecha DATE NOT NULL,
    id_mascota INT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME,
    motivo VARCHAR(50),
    tipo_cita tipo_cita NOT NULL,

    CONSTRAINT pk_citas
        PRIMARY KEY (id_cita),

    CONSTRAINT fk_citas_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id_mascota),

    CONSTRAINT chk_citas_horas
        CHECK (
            hora_final IS NULL
            OR hora_final > hora_inicio
        )
);