-- =========================================================
-- Ver mis tablas creadas
-- =========================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT * FROM usuarios
SELECT * FROM duenos
SELECT * FROM mascotas
SELECT * FROM veterinarios
SELECT * FROM historias_clinicas
SELECT * FROM citas

--Para saber siempre los nombres de los usuarios, debo hacer siempre los join