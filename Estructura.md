# Organización inicial del proyecto

**Stack tecnológico**

- Backend: NestJS
- Base de datos: PostgreSQL
- Arquitectura: Monolito clásico
- Duración estimada: 7–8 semanas
- Equipo: 3 desarrolladores

## Objetivo de esta estructura

Organizar el proyecto desde el inicio para que cada integrante pueda trabajar
en módulos independientes sin generar conflictos innecesarios.

La estructura sigue el enfoque modular de NestJS: cada funcionalidad del negocio
tiene su propio módulo.

---

# Estructura general

```text
crm-veterinario/
│
├── src/
├── test/
├── docs/
├── database/
├── scripts/
└── uploads/
```

---

# Carpeta `src`

Contiene todo el código fuente del backend.

```text
src/
│
├── modules/
├── common/
├── config/
├── database/
├── notifications/
└── main.ts
```

---

# `src/modules`

Aquí vive toda la lógica del negocio.

Cada carpeta representa un módulo independiente.

```text
modules/
│
├── auth/
├── users/
├── pets/
├── appointments/
├── veterinarians/
├── groomers/
├── walkers/
├── services/
└── roles/
```

## Módulos sugeridos

### auth/

Autenticación del sistema.

Responsabilidad:

- Inicio de sesión
- Registro
- Recuperación de acceso
- Validación de JWT

---

### users/

Gestión de usuarios.

Incluye:

- Propietarios
- Administradores

---

### pets/

Información de mascotas.

Ejemplos de responsabilidades:

- Registrar mascota
- Editar información
- Historial básico

---

### appointments/

Gestión completa de citas.

Incluye:

- Agendar
- Cancelar
- Confirmar
- Reprogramar

Este será uno de los módulos principales del CRM.

---

### veterinarians/

Información relacionada con veterinarios.

Responsabilidades:

- Disponibilidad
- Perfil profesional
- Asignación de citas

---

### groomers/

Gestión del personal de peluquería.

---

### walkers/

Gestión de paseadores.

---

### services/

Servicios ofrecidos por la clínica.

Ejemplos:

- Consulta
- Vacunación
- Peluquería
- Paseo

---

### roles/

Control de permisos.

Responsabilidades:

- Propietario
- Veterinario
- Peluquero
- Paseador
- Administrador

---

# `src/common`

Elementos reutilizables por todos los módulos.

```text
common/
│
├── guards/
├── interceptors/
├── filters/
├── decorators/
├── middleware/
├── pipes/
└── utils/
```

## Contenido

### guards/

Protección de rutas.

Ejemplo:

- Validar autenticación.

### decorators/

Decoradores personalizados.

Ejemplo:

- Obtener usuario autenticado.

### middleware/

Procesamiento previo de solicitudes.

### utils/

Funciones reutilizables.

Ejemplo:

- Formatear fechas.
- Validaciones comunes.

---

# `src/config`

Configuraciones del proyecto.

```text
config/
│
├── env/
└── database/
```

Aquí se centralizan las configuraciones relacionadas con:

- Variables de entorno
- Conexión a PostgreSQL

---

# `src/database`

Elementos propios de la base de datos.

```text
database/
│
├── migrations/
├── seeders/
└── entities/
```

## Contenido

### migrations/

Cambios versionados de la base de datos.

### seeders/

Datos iniciales.

Ejemplos:

- Roles.
- Usuario administrador.
- Servicios básicos.

### entities/

Modelos que representan las tablas de PostgreSQL.

---

# `src/notifications`

Módulo compartido para notificaciones.

```text
notifications/
│
└── templates/
```

Pensado para implementar el patrón **Observer**.

Podrá encargarse de:

- Confirmaciones.
- Recordatorios.
- Cancelaciones.

---

# Carpeta `test`

```text
test/
│
├── unit/
└── integration/
```

Separar pruebas desde el inicio facilita mantener calidad durante el desarrollo.

---

# Carpeta `database` (raíz)

```text
database/
│
└── backups/
```

Espacio reservado para respaldos locales durante el desarrollo.

No debería subirse a Git.

---

# Carpeta `docs`

Documentación del proyecto.

```text
docs/
│
├── arquitectura/
├── api/
├── diagramas/
└── decisiones/
```

## Contenido sugerido

### arquitectura/

- Monolito clásico.
- Justificación.

### api/

Documentación de endpoints.

### diagramas/

- Casos de uso.
- Modelo entidad-relación.
- Flujo de citas.

### decisiones/

Registro breve de decisiones técnicas importantes.

---

# Organización del trabajo del equipo

## Integrante 1

- Auth
- Users
- Roles

## Integrante 2

- Pets
- Appointments

## Integrante 3

- Veterinarians
- Groomers
- Walkers
- Services
- Notifications

Los elementos de `common` pueden modificarse entre todos cuando sea necesario.

---

# Principios de organización

- Cada módulo debe ser independiente.
- La lógica compartida vive únicamente en `common`.
- La configuración permanece centralizada en `config`.
- Las entidades de PostgreSQL permanecen agrupadas en `database`.
- La documentación evoluciona junto con el proyecto dentro de `docs`.
- La estructura debe mantenerse simple para priorizar la velocidad de desarrollo durante las 7–8 semanas del MVP.