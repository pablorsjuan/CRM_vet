-- =========================================================
-- DATOS DE PRUEBA - CRM_VET
-- =========================================================
-- =========================================================
-- 1. USUARIOS
-- =========================================================

INSERT INTO usuarios (
    nombre_usuario,
    sexo,
    fecha_nacimiento,
    usuario,
    contrasena,
    num_celular,
    email,
    rol
)
VALUES
(
    'Carlos Pérez',
    'M',
    '1990-05-15',
    'carlos.perez',
    '123456',
    3001234567,
    'carlos@gmail.com',
    'dueno'
),
(
    'Laura Gómez',
    'F',
    '1985-08-20',
    'laura.gomez',
    '123456',
    3019876543,
    'laura@gmail.com',
    'veterinario'
),
(
    'Andrés Rodríguez',
    'M',
    '1995-03-10',
    'andres.rodriguez',
    '123456',
    3024567890,
    'andres@gmail.com',
    'paseador'
),
(
    'María López',
    'F',
    '1992-11-25',
    'maria.lopez',
    '123456',
    3036547890,
    'maria@gmail.com',
    'peluquero'
);


-- =========================================================
-- 2. DUEÑOS
-- =========================================================

INSERT INTO duenos (id_persona,num_mascotas)
VALUES(1,1);

-- =========================================================
-- 3. VETERINARIOS
-- =========================================================

INSERT INTO veterinarios (id_persona,matricula_profesional,especialidad)
VALUES(2,123456,'Medicina veterinaria general');

-- =========================================================
-- 4. PASEADORES
-- =========================================================

INSERT INTO paseadores (id_persona,hora_paseo)
VALUES(3,'08:00:00');

-- =========================================================
-- 5. PELUQUEROS
-- =========================================================

INSERT INTO peluqueros (id_persona,anos_experiencia)
VALUES(4,5);

-- =========================================================
-- 6. MASCOTAS
-- =========================================================

INSERT INTO mascotas (nombre_mascota,fecha_nacimiento,id_dueno)
VALUES('Max','2021-06-12',1);

-- =========================================================
-- 7. HISTORIAS CLÍNICAS
-- =========================================================

INSERT INTO historias_clinicas (
    fecha,
    id_mascota,
    id_veterinario,
    motivo_consulta,
    antecedentes_medicos,
    diagnostico,
    tratamiento
)
VALUES
(
    '2026-10-05',
    1,
    1,
    'Consulta general',
    'Sin antecedentes relevantes',
    'Buen estado de salud',
    'Control general y vacunación'
);


-- =========================================================
-- 8. CITAS
-- =========================================================

INSERT INTO citas (
    fecha,
    id_mascota,
    hora_inicio,
    hora_final,
    motivo,
    tipo_cita
)
VALUES
(
    '2026-10-10',
    1,
    '10:00:00',
    '10:30:00',
    'Consulta general',
    'veterinaria'
);