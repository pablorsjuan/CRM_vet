
BEGIN;

-- =============================================
-- 1. INSERTAR USUARIOS
-- =============================================

-- Las contrasenas de prueba se cargan como hashes bcrypt.
INSERT INTO usuarios (
    nombre_usuario, sexo, fecha_nacimiento,
    usuario, contrasena, num_celular, email, rol
) VALUES

-- ADMINISTRADOR
('Administrador del Sistema', 'Masculino', '1990-05-10',
 'admin.sistema', '$2b$10$ELZn8bNcdUd9IXKwQkTKgeMHHt4aD/RjgKQiy7eY1iVOpSUT6iku2', '3000000000',
 'admin@example.com', 'administrador'),

-- VETERINARIOS
('Andrea Martínez', 'Femenino', '1988-03-15',
 'vet.andrea', '$2b$10$k4Fsc2JXp3nZ9gL3kKJpk.FhBNe2Z5b7Glo.HPVlRd2lchdKx9FmO', '3001111111',
 'andrea@example.com', 'veterinario'),

('Carlos Rodríguez', 'Masculino', '1985-07-22',
 'vet.carlos', '$2b$10$HNLE8oBiiL/rDN97qL5s6OJyu9Tuw9gK3041qT4uwwwZj6/HbF3qO', '3002222222',
 'carlos@example.com', 'veterinario'),

('Lucía Fernández', 'Femenino', '1992-11-08',
 'vet.lucia', '$2b$10$psITMtIgDu90dyTXjpnTaevv5ZSimp0qdgovnUD56LiJR7nahyZL6', '3003333333',
 'lucia@example.com', 'veterinario'),

('Mateo Gómez', 'Masculino', '1990-01-19',
 'vet.mateo', '$2b$10$uGcN5iRxi0Kz9oN0sac/huUUHoXrJ6mngOufc6X79TU5XYKIHjjmW', '3004444444',
 'mateo@example.com', 'veterinario'),

-- PASEADORES
('Sofía Ramírez', 'Femenino', '1995-02-14',
 'paseador.sofia', '$2b$10$QBoqs5IsGXmg3ZHLJXQ/J.31sJEZiZH27Wj6BkP05U..iPiDcY6QG', '3011111111',
 'sofia@example.com', 'paseador'),

('Diego Torres', 'Masculino', '1993-06-30',
 'paseador.diego', '$2b$10$0ILx8DDs8U6/kjtgoITaOeL6Q7ccG1TMucSIZOppzCZPQv/AHCEda', '3012222222',
 'diego@example.com', 'paseador'),

('Valentina Castro', 'Femenino', '1998-09-12',
 'paseador.valentina', '$2b$10$cABc/SFR0t81MYv441Jbgu7n.jHk.oQSpHV7JRjmw4cPw0F8jHy.e', '3013333333',
 'valentina@example.com', 'paseador'),

('Julián Herrera', 'Masculino', '1994-12-05',
 'paseador.julian', '$2b$10$BXobCoSCbNywKTdjyG2ctuQJlVoMJEnMO3HS01Pmf.An7DBwLkKPS', '3014444444',
 'julian@example.com', 'paseador'),

-- PELUQUEROS
('Camila Vargas', 'Femenino', '1991-04-20',
 'peluquero.camila', '$2b$10$.W/E7pphklAmuu2emx6MMuZb5TCEH8Oc1j5l2V1gOvZi/fWll.1x6', '3021111111',
 'camila@example.com', 'peluquero'),

('Andrés Moreno', 'Masculino', '1989-08-17',
 'peluquero.andres', '$2b$10$Q0dKpd7s0fNrkdt8ONVRIOU/iYqUHiwWKVmqsVDOahXaDGlc51LZm', '3022222222',
 'andres@example.com', 'peluquero'),

('Laura Jiménez', 'Femenino', '1996-10-25',
 'peluquero.laura', '$2b$10$aJKnrawgoALSsk7wyLtcy.vg6AGFyn83bRiqGyGlFqaznC2.zijJu', '3023333333',
 'laura@example.com', 'peluquero'),

('Miguel Sánchez', 'Masculino', '1987-12-11',
 'peluquero.miguel', '$2b$10$gLrlM2Y4woTZIJeKkdS0C.pwhI0qPDeOJxb6VD8btWGYcbM9hlUhK', '3024444444',
 'miguel@example.com', 'peluquero'),

-- DUEÑOS
('Ana López', 'Femenino', '1995-01-10',
 'dueno.ana', '$2b$10$sNiMzrnO2OI65H0JYcur6.xmydvoY4fpCByNqdHgm1sqek.mp4Gdm', '3101111111',
 'ana@example.com', 'dueno'),

('Bruno Pérez', 'Masculino', '1992-03-21',
 'dueno.bruno', '$2b$10$TropNnRq066yDKTGeAMKxOBaCEsnmsr0nu7/bo.4xUYkVX.YsRPJm', '3102222222',
 'bruno@example.com', 'dueno'),

('Carla Díaz', 'Femenino', '1990-05-16',
 'dueno.carla', '$2b$10$J64WWO/x0jTMLVB.4IDMmujcjcjbsm1q0Qwo4AVOfsnRlynoxy3XC', '3103333333',
 'carla@example.com', 'dueno'),

('Daniel Ruiz', 'Masculino', '1988-07-09',
 'dueno.daniel', '$2b$10$9OAdegT0wwtbfiQ31NU.s.m6NyTes9ebQcK.dTud3c56Itqlw0n..', '3104444444',
 'daniel@example.com', 'dueno'),

('Elena Morales', 'Femenino', '1994-09-28',
 'dueno.elena', '$2b$10$vmn2RKmvtHGeQmqHdmgv7.2.WPYahLFwmxcgScKdsonClrusvfUkS', '3111111111',
 'elena@example.com', 'dueno'),

('Felipe Rojas', 'Masculino', '1991-11-13',
 'dueno.felipe', '$2b$10$qEgt61wwBra01OEfggFJFe0.pkebuuOy48k.WLfsdBO6Lm5SsEAXC', '3112222222',
 'felipe@example.com', 'dueno'),

('Gabriela Ortiz', 'Femenino', '1997-02-04',
 'dueno.gabriela', '$2b$10$t5.Yacpam0jkMWHYE9sv9uiZt373byHJ0A1t703KN3M/tHbNiCTbO', '3113333333',
 'gabriela@example.com', 'dueno'),

('Hugo Medina', 'Masculino', '1986-04-18',
 'dueno.hugo', '$2b$10$mfaoLmy3Wmb8F8YR5h.O2OJWBYPGOTsmQJ1lIm6V.TJ0Dz6/i/z3i', '3114444444',
 'hugo@example.com', 'dueno'),

('Isabel Guerrero', 'Femenino', '1993-06-23',
 'dueno.isabel', '$2b$10$1c0uXGM9nXqQqKC90VN15e2k8GD9EutXqIgYI98YKbcsMalcH5O96', '3121111111',
 'isabel@example.com', 'dueno'),

('Javier Castillo', 'Masculino', '1989-08-14',
 'dueno.javier', '$2b$10$IXQU5l/idQOpXN3riQDdGur0arzyXkEgSuLnhUkNHbmYNN2EGw3jK', '3122222222',
 'javier@example.com', 'dueno'),

('Karen Silva', 'Femenino', '1996-10-07',
 'dueno.karen', '$2b$10$C29wbpqHThsbNrLgOeQKIOL0NHbg12JFrm5rlKblMvqVIwT1ujDlW', '3123333333',
 'karen@example.com', 'dueno'),

('Luis Ramírez', 'Masculino', '1990-12-29',
 'dueno.luis', '$2b$10$FpN.lD2QNOVo5VfT4ciOr.HcgPMWKXrvDzy6YilSitdnXKAIfdiAa', '3124444444',
 'luis@example.com', 'dueno');


-- =============================================
-- 2. INSERTAR DUEÑOS
-- =============================================

INSERT INTO duenos (id_usuario, num_mascotas)
SELECT id_usuario, 0
FROM usuarios
WHERE rol = 'dueno';


-- =============================================
-- 3. INSERTAR VETERINARIOS
-- =============================================

INSERT INTO veterinarios (
    id_usuario, matricula_profesional, especialidad
)
SELECT
    u.id_usuario,
    v.matricula,
    v.especialidad
FROM (
    VALUES
    ('vet.andrea', 'VET-2026-001', 'Medicina general'),
    ('vet.carlos', 'VET-2026-002', 'Cirugía animal'),
    ('vet.lucia', 'VET-2026-003', 'Dermatología'),
    ('vet.mateo', 'VET-2026-004', 'Animales exóticos')
) AS v(usuario, matricula, especialidad)
JOIN usuarios u ON u.usuario = v.usuario;


-- =============================================
-- 4. INSERTAR PASEADORES
-- =============================================

INSERT INTO paseadores (id_usuario, hora_paseo)
SELECT
    u.id_usuario,
    p.hora_paseo
FROM (
    VALUES
    ('paseador.sofia', '07:00:00'::TIME),
    ('paseador.diego', '08:00:00'::TIME),
    ('paseador.valentina', '09:00:00'::TIME),
    ('paseador.julian', '16:00:00'::TIME)
) AS p(usuario, hora_paseo)
JOIN usuarios u ON u.usuario = p.usuario;


-- =============================================
-- 5. INSERTAR PELUQUEROS
-- =============================================

INSERT INTO peluqueros (id_usuario, anos_experiencia)
SELECT
    u.id_usuario,
    p.experiencia
FROM (
    VALUES
    ('peluquero.camila', 5),
    ('peluquero.andres', 8),
    ('peluquero.laura', 3),
    ('peluquero.miguel', 10)
) AS p(usuario, experiencia)
JOIN usuarios u ON u.usuario = p.usuario;


-- =============================================
-- 6. INSERTAR MASCOTAS
-- =============================================

WITH datos_mascotas (
    nombre, especie, raza, sexo,
    nacimiento, peso, color, observaciones, dueno
) AS (
    VALUES

    -- PERROS (6)
    ('Luna', 'Perro', 'Labrador', 'Hembra',
     CURRENT_DATE - 1200, 25.50, 'Dorado',
     'Es amigable y juguetona.', 'dueno.ana'),

    ('Max', 'Perro', 'Pastor alemán', 'Macho',
     CURRENT_DATE - 900, 30.00, 'Negro y café',
     'Necesita actividad física diaria.', 'dueno.bruno'),

    ('Rocky', 'Perro', 'Bulldog francés', 'Macho',
     CURRENT_DATE - 600, 12.50, 'Blanco',
     'Presenta sensibilidad al calor.', 'dueno.carla'),

    ('Nala', 'Perro', 'Golden Retriever', 'Hembra',
     CURRENT_DATE - 750, 27.00, 'Dorado',
     'Muy sociable con otros animales.', 'dueno.daniel'),

    ('Toby', 'Perro', 'Beagle', 'Macho',
     CURRENT_DATE - 500, 14.20, 'Tricolor',
     'Tiene mucha energía.', 'dueno.elena'),

    ('Kira', 'Perro', 'Poodle', 'Hembra',
     CURRENT_DATE - 400, 8.50, 'Blanco',
     'Requiere mantenimiento frecuente del pelaje.', 'dueno.felipe'),

    -- GATOS (6)
    ('Milo', 'Gato', 'Persa', 'Macho',
     CURRENT_DATE - 850, 5.20, 'Gris',
     'Necesita cepillado frecuente.', 'dueno.ana'),

    ('Mishi', 'Gato', 'Siamés', 'Hembra',
     CURRENT_DATE - 700, 4.10, 'Crema',
     'Es tranquila y cariñosa.', 'dueno.gabriela'),

    ('Simba', 'Gato', 'Maine Coon', 'Macho',
     CURRENT_DATE - 1000, 7.80, 'Naranja',
     'Presenta pelaje abundante.', 'dueno.hugo'),

    ('Nube', 'Gato', 'Angora', 'Hembra',
     CURRENT_DATE - 450, 3.90, 'Blanco',
     'Es tímida con desconocidos.', 'dueno.isabel'),

    ('Cleo', 'Gato', 'Criollo', 'Hembra',
     CURRENT_DATE - 600, 4.50, 'Negro',
     'No presenta antecedentes conocidos.', 'dueno.javier'),

    ('Oliver', 'Gato', 'Bengalí', 'Macho',
     CURRENT_DATE - 350, 4.80, 'Marrón',
     'Es muy activo.', 'dueno.karen'),

    -- CONEJOS (4)
    ('Copito', 'Conejo', 'Cabeza de león', 'Macho',
     CURRENT_DATE - 300, 1.80, 'Blanco',
     'Requiere alimentación rica en fibra.', 'dueno.bruno'),

    ('Canela', 'Conejo', 'Rex', 'Hembra',
     CURRENT_DATE - 250, 2.10, 'Café',
     'Es tranquila.', 'dueno.gabriela'),

    ('Pelusa', 'Conejo', 'Holandés', 'Hembra',
     CURRENT_DATE - 200, 1.50, 'Gris y blanco',
     'Necesita revisión periódica de sus dientes.', 'dueno.hugo'),

    ('Boni', 'Conejo', 'Mini Lop', 'Macho',
     CURRENT_DATE - 400, 1.90, 'Marrón',
     'Es sociable.', 'dueno.karen'),

    -- AVES (4)
    ('Piolín', 'Ave', 'Canario', 'Macho',
     CURRENT_DATE - 500, 0.03, 'Amarillo',
     'Se mantiene en jaula amplia.', 'dueno.carla'),

    ('Kiwi', 'Ave', 'Periquito australiano', 'Hembra',
     CURRENT_DATE - 350, 0.04, 'Verde',
     'Es activa y vocaliza frecuentemente.', 'dueno.elena'),

    ('Lola', 'Ave', 'Cacatúa', 'Hembra',
     CURRENT_DATE - 1000, 0.90, 'Blanco',
     'Necesita estimulación diaria.', 'dueno.javier'),

    ('Paco', 'Ave', 'Loro', 'Macho',
     CURRENT_DATE - 1500, 0.80, 'Verde',
     'Puede imitar sonidos.', 'dueno.isabel'),

    -- HÁMSTERES (5)
    ('Chispa', 'Hámster', 'Sirio', 'Macho',
     CURRENT_DATE - 150, 0.15, 'Dorado',
     'Actividad principalmente nocturna.', 'dueno.daniel'),

    ('Nuez', 'Hámster', 'Enano ruso', 'Hembra',
     CURRENT_DATE - 120, 0.08, 'Gris',
     'Es pequeño y activo.', 'dueno.felipe'),

    ('Maní', 'Hámster', 'Roborovski', 'Macho',
     CURRENT_DATE - 100, 0.04, 'Arena',
     'Es muy rápido.', 'dueno.gabriela'),

    ('Bolita', 'Hámster', 'Sirio', 'Hembra',
     CURRENT_DATE - 180, 0.16, 'Blanco y café',
     'Es tranquila.', 'dueno.ana'),

    ('Tito', 'Hámster', 'Enano chino', 'Macho',
     CURRENT_DATE - 130, 0.05, 'Gris',
     'Necesita espacio para ejercitarse.', 'dueno.bruno')
)

INSERT INTO mascotas (
    nombre_mascota, especie, raza, sexo,
    fecha_nacimiento, peso, color, observaciones, id_dueno
)
SELECT
    m.nombre,
    m.especie,
    m.raza,
    m.sexo,
    m.nacimiento,
    m.peso,
    m.color,
    m.observaciones,
    d.id_dueno
FROM datos_mascotas m
JOIN usuarios u ON u.usuario = m.dueno
JOIN duenos d ON d.id_usuario = u.id_usuario;


-- =============================================
-- 7. ACTUALIZAR CANTIDAD DE MASCOTAS POR DUEÑO
-- =============================================

UPDATE duenos d
SET num_mascotas = (
    SELECT COUNT(*)
    FROM mascotas m
    WHERE m.id_dueno = d.id_dueno
);


-- =============================================
-- 8. INSERTAR HISTORIAS CLÍNICAS
-- =============================================

WITH datos_historias (
    fecha, mascota, veterinario, motivo,
    antecedentes, diagnostico, tratamiento
) AS (
    VALUES

    (CURRENT_DATE - 30, 'Luna', 'vet.andrea',
     'Control general',
     'Vacunación al día.',
     'Estado de salud normal.',
     'Continuar controles periódicos.'),

    (CURRENT_DATE - 25, 'Milo', 'vet.carlos',
     'Problemas digestivos',
     'Antecedentes de sensibilidad alimentaria.',
     'Posible intolerancia alimentaria.',
     'Dieta especializada y seguimiento.'),

    (CURRENT_DATE - 20, 'Max', 'vet.lucia',
     'Revisión de piel',
     'Presenta picazón ocasional.',
     'Dermatitis leve.',
     'Tratamiento tópico y control.'),

    (CURRENT_DATE - 18, 'Nala', 'vet.mateo',
     'Control preventivo',
     'Sin antecedentes relevantes.',
     'Estado general satisfactorio.',
     'Continuar esquema de vacunación.'),

    (CURRENT_DATE - 15, 'Copito', 'vet.andrea',
     'Revisión dental',
     'Crecimiento dental irregular.',
     'Maloclusión dental leve.',
     'Control odontológico periódico.'),

    (CURRENT_DATE - 12, 'Kiwi', 'vet.carlos',
     'Control de peso',
     'Alimentación variada.',
     'Peso dentro del rango esperado.',
     'Mantener alimentación balanceada.'),

    (CURRENT_DATE - 8, 'Simba', 'vet.lucia',
     'Caída de pelo',
     'Pelaje abundante.',
     'Posible irritación cutánea.',
     'Revisión y cuidado dermatológico.'),

    (CURRENT_DATE - 5, 'Chispa', 'vet.mateo',
     'Control de animal exótico',
     'Sin antecedentes.',
     'Estado general normal.',
     'Mantener dieta y ambiente adecuados.')
)

INSERT INTO historias_clinicas (
    fecha, id_mascota, id_veterinario,
    motivo_consulta, antecedentes_medicos,
    diagnostico, tratamiento
)
SELECT
    h.fecha,
    m.id_mascota,
    v.id_veterinario,
    h.motivo,
    h.antecedentes,
    h.diagnostico,
    h.tratamiento
FROM datos_historias h
JOIN mascotas m ON m.nombre_mascota = h.mascota
JOIN usuarios u ON u.usuario = h.veterinario
JOIN veterinarios v ON v.id_usuario = u.id_usuario;


-- =============================================
-- 9. INSERTAR CITAS
-- =============================================

WITH datos_citas (
    fecha, mascota, profesional,
    inicio, final, motivo, tipo, estado
) AS (
    VALUES

    -- CITAS VETERINARIAS
    (CURRENT_DATE - 10, 'Luna', 'vet.andrea',
     '09:00', '09:30', 'Control general',
     'veterinaria', 'completada'),

    (CURRENT_DATE - 8, 'Milo', 'vet.carlos',
     '10:00', '10:45', 'Problemas digestivos',
     'veterinaria', 'completada'),

    (CURRENT_DATE + 2, 'Max', 'vet.lucia',
     '11:00', '11:30', 'Revisión dermatológica',
     'veterinaria', 'pendiente'),

    (CURRENT_DATE + 3, 'Nala', 'vet.mateo',
     '14:00', '14:30', 'Control preventivo',
     'veterinaria', 'pendiente'),

    (CURRENT_DATE - 4, 'Copito', 'vet.andrea',
     '08:00', '08:30', 'Revisión dental',
     'veterinaria', 'cancelada'),

    (CURRENT_DATE + 5, 'Rocky', 'vet.carlos',
     '15:00', '15:45', 'Consulta general',
     'veterinaria', 'pendiente'),

    -- CITAS DE PASEO
    (CURRENT_DATE + 1, 'Luna', 'paseador.sofia',
     '07:00', '08:00', 'Paseo matutino',
     'paseo', 'pendiente'),

    (CURRENT_DATE - 3, 'Max', 'paseador.diego',
     '08:00', '09:00', 'Paseo diario',
     'paseo', 'completada'),

    (CURRENT_DATE + 4, 'Kira', 'paseador.valentina',
     '09:00', '10:00', 'Paseo recreativo',
     'paseo', 'pendiente'),

    (CURRENT_DATE - 6, 'Simba', 'paseador.julian',
     '16:00', '16:30', 'Paseo supervisado',
     'paseo', 'cancelada'),

    (CURRENT_DATE + 6, 'Nala', 'paseador.sofia',
     '07:30', '08:30', 'Paseo matutino',
     'paseo', 'pendiente'),

    -- CITAS DE PELUQUERÍA
    (CURRENT_DATE + 2, 'Milo', 'peluquero.camila',
     '10:00', '11:00', 'Cepillado y baño',
     'peluqueria', 'pendiente'),

    (CURRENT_DATE - 7, 'Nala', 'peluquero.andres',
     '13:00', '14:00', 'Baño y corte',
     'peluqueria', 'completada'),

    (CURRENT_DATE + 7, 'Oliver', 'peluquero.laura',
     '09:00', '10:00', 'Cuidado del pelaje',
     'peluqueria', 'pendiente'),

    (CURRENT_DATE - 2, 'Toby', 'peluquero.miguel',
     '15:00', '16:00', 'Baño y cepillado',
     'peluqueria', 'cancelada')
)

INSERT INTO citas (
    fecha, id_mascota, id_profesional,
    hora_inicio, hora_final, motivo,
    tipo_cita, estado
)
SELECT
    c.fecha,
    m.id_mascota,
    u.id_usuario,
    c.inicio::TIME,
    c.final::TIME,
    c.motivo,
    c.tipo::tipo_cita,
    c.estado::estado_cita
FROM datos_citas c
JOIN mascotas m ON m.nombre_mascota = c.mascota
JOIN usuarios u ON u.usuario = c.profesional;


COMMIT;
