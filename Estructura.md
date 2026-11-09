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

Contiene todo el código fuente del backend y frontend.

```text
src/
├── backend/
|   ├── common/ 
|   ├── config/ 
|   ├── database/ 
|   ├── modules/ 
|   └── notifications/
└── frontend/
    └── *todo lo relacionado a VUE (WIP)*
```

---

# Inicializar el backend

Se requiere tener Node.js/npm y PostgreSQL instalados y PostgreSQL en ejecución.
Los comandos siguientes se ejecutan desde PowerShell en la raíz del proyecto:

```powershell
cd src\backend
Copy-Item .env.example .env
```

Edita el archivo `.env` creado en `src/backend` con las credenciales de
PostgreSQL. La configuración espera `DB_HOST`, `DB_PORT`, `DB_USERNAME`,
`DB_PASSWORD` y `DB_DATABASE`; por defecto la base de datos se llama `crm_vet`.

Crea la base de datos y carga el esquema inicial desde una base vacía (el
archivo no debe ejecutarse sobre tablas ya existentes):

```powershell
createdb -U postgres crm_vet
psql -U postgres -d crm_vet -f database\querys\crmVet_Schema_v2.sql
```

Instala las dependencias y levanta el backend en modo desarrollo:

```powershell
npm install
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`; la documentación
Swagger se encuentra en `http://localhost:3000/api`. Para compilar y ejecutar
la versión de producción:

```powershell
npm run build
npm run start:prod
```

# Carpeta `src/frontend`
Se encuentran las carpetas relacionadas al manejo de VUE y sus dependencias.


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

<!-- FIXME: sacar frontend del crm y crear una carpeta aparte, puede dar muchos problemas con git -->
<!-- FIXME: Borra carpeta env, dejar solo el archivito -->
<!-- FIXME: dejar todo en una rama -->
<!-- FIXME: crear una rama fix sacando el frontend y los gitkeep de la rama dev, mis compañeros suben las features a una rama dev y hacen pull request la main -->
<!-- FIXME: node mailer para los correos-->
