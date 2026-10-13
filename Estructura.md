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
├── docs/
├── src/
└── test/
```

---

# Carpeta `src`

Contiene todo el código fuente del backend.

```text
src/
├── modules/
├── common/
├── config/
├── database/
├── notifications/
└── main.ts
```

---

# Carpeta `src/frontend`
Se encuentran las carpetas relacionadas al manejo de React y sus dependencias.


# `src/backend/modules`

Aquí vive toda la lógica del negocio.

Cada carpeta representa un módulo independiente.

```text
modules/
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

# `src/backend/common`

Elementos reutilizables por todos los módulos.

```text
common/
├── interceptors/
├── filters/
├── pipes/
└── utils/
```

## Contenido

### utils/
Funciones reutilizables.
Ejemplo:
- Formatear fechas.
- Validaciones comunes.

---

# `src/backend/config`

Configuraciones del proyecto.

```text
config/
├── env/
└── database/
```

Aquí se centralizan las configuraciones relacionadas con:

- Variables de entorno
- Conexión a PostgreSQL

---

# `src/backend/database`

Elementos propios de la base de datos.

```text
database/
├── entities/
├── querys/
└── seeders/
```

## Contenido

### entities/
Modelos que representan las tablas de PostgreSQL.


### querys/
Se encuentran los archivos .sql con creación e inserción básica de las tablas

### seeders/
Datos iniciales.

Ejemplos:
- Roles.
- Usuario administrador.
- Servicios básicos.

---

# `src/backend/notifications`

Módulo compartido para notificaciones.
```text
notifications/
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
├── unit/
└── integration/
```

Separar pruebas desde el inicio facilita mantener calidad durante el desarrollo.

---

# Carpeta `docs`

Documentación del proyecto.

```text
docs/
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

# Principios de organización

- Cada módulo debe ser independiente.
- La lógica compartida vive únicamente en `common`.
- La configuración permanece centralizada en `config`.
- Las entidades de PostgreSQL permanecen agrupadas en `database`.
- La documentación evoluciona junto con el proyecto dentro de `docs`.
- La estructura debe mantenerse simple para priorizar la velocidad de desarrollo durante las 7–8 semanas del MVP.