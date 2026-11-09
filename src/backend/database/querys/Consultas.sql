SELECT rol, COUNT(*) AS cantidad
FROM usuarios
GROUP BY rol
ORDER BY rol;

SELECT especie, COUNT(*) AS cantidad
FROM mascotas
GROUP BY especie
ORDER BY especie;

SELECT
    u.nombre_usuario,
    u.email,
    d.num_mascotas
FROM duenos d
JOIN usuarios u ON u.id_usuario = d.id_usuario
ORDER BY u.nombre_usuario;

SELECT
    u.nombre_usuario,
    u.rol,
    d.num_mascotas
FROM usuarios u
JOIN duenos d ON d.id_usuario = u.id_usuario
WHERE d.num_mascotas = 0;

SELECT
    m.nombre_mascota,
    m.especie,
    m.raza,
    u.nombre_usuario AS dueno
FROM mascotas m
JOIN duenos d ON d.id_dueno = m.id_dueno
JOIN usuarios u ON u.id_usuario = d.id_usuario
ORDER BY u.nombre_usuario;

SELECT
    c.id_cita,
    c.fecha,
    m.nombre_mascota,
    u.nombre_usuario AS profesional,
    c.tipo_cita,
    c.estado,
    c.hora_inicio,
    c.hora_final
FROM citas c
JOIN mascotas m ON m.id_mascota = c.id_mascota
JOIN usuarios u ON u.id_usuario = c.id_profesional
ORDER BY c.fecha;