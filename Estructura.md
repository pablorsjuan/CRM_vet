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
CRM_vet/
├── docs/
├── frontend/
├── src/
│   └── backend/
├── test/
└── Estructura.md
```

---

# Carpetas del proyecto

El frontend Vue vive en `frontend/`; el backend NestJS vive en `src/backend/`.
No es necesario mover de carpeta para usar la aplicación: cada servidor se
inicia desde su propio directorio.

```text
frontend/
└── src/                 # vistas, componentes y servicios Vue

src/backend/
├── common/
├── config/
├── database/
├── modules/
└── notifications/
```

---

# Ejecutar la aplicación completa en Windows

Se requiere Node.js/npm y PostgreSQL instalado y en ejecución. El frontend y el
backend son dos procesos distintos: abre dos terminales de PowerShell en VS Code
(menú **Terminal > New Terminal**) y deja ambas abiertas mientras uses la app.

## 1. Configurar y arrancar la API (terminal 1)

Desde la raíz del repositorio:

```powershell
cd src\backend
```

La primera vez, crea la configuración local:

```powershell
Copy-Item .env.example .env
```

Abre `src\backend\.env` y completa `DB_HOST`, `DB_PORT`, `DB_USERNAME`,
`DB_PASSWORD` y `DB_DATABASE` con las credenciales de tu PostgreSQL. `DB_DATABASE`
debe coincidir exactamente con el nombre de la base ya existente. Genera un
secreto para firmar las sesiones JWT con:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copia el resultado en `JWT_SECRET` en el archivo `.env`. No compartas ni subas ese
archivo al repositorio. La API lee `.env` desde `src\backend`, por eso estos
comandos se ejecutan después de entrar a esa carpeta.

Instala dependencias solo si aún no existe `node_modules` (o si npm lo solicita)
y arranca el servidor:

```powershell
npm install
npm run start:dev
```

Espera a que Nest indique que la aplicación está escuchando en el puerto `3000`.
No cierres esta terminal. La API y Swagger están disponibles en:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

**Si la base ya está creada y contiene datos, no ejecutes `createdb` ni vuelvas a
cargar `crmVet_Schema_v2.sql`**: ese script es solo para crear una base vacía y
puede fallar o afectar una configuración existente.

## 2. Arrancar y abrir el frontend (terminal 2)

Abre otra terminal de PowerShell. Si VS Code no la abrió en la raíz del repositorio,
ubícate allí (ajusta la ruta si clonaste el proyecto en otro lugar):

```powershell
Set-Location 'C:\Users\pablo\OneDrive\Escritorio\Crpt. Trabajos\Códigos Tareas\CRM_vet'
```

Después ejecuta:

```powershell
cd frontend
npm install
npm run serve -- --port 8080
```

`npm install` normalmente solo es necesario la primera vez. Espera el mensaje
`App running at` y abre **`http://localhost:8080`** en el navegador. Deja esta
terminal abierta también.

El frontend envía las solicitudes a `http://localhost:3000` por defecto. El backend
permite por defecto el origen `http://localhost:8080`. Usa esas dos direcciones
exactas para evitar problemas de CORS; si cambias el puerto del frontend, configura
`FRONTEND_ORIGIN` en `src\backend\.env` con el origen nuevo y reinicia el backend.
Si el backend está en otra dirección, configura `VUE_APP_API_URL` antes de iniciar
o compilar el frontend.

## 3. Probar la aplicación

1. Confirma que las dos terminales siguen ejecutando los servidores sin errores.
2. Abre `http://localhost:3000/api`; si carga Swagger, el navegador alcanza la API.
3. Abre `http://localhost:8080`, crea una cuenta de propietario o inicia sesión
   con una cuenta que ya exista.
4. Después de iniciar sesión, registra una mascota desde el panel de usuario.

## Si aparece “No fue posible conectar con el servidor”

Ese mensaje indica que el navegador no pudo establecer la conexión HTTP (no es un
error de usuario/contraseña). Comprueba en este orden:

1. Que la terminal del backend siga abierta y muestre que escucha en `3000`.
2. Que `http://localhost:3000/api` abra desde el mismo equipo.
3. Que `src\backend\.env` exista y tenga las credenciales correctas. Si Nest se
   detuvo por error de conexión con PostgreSQL o por un `JWT_SECRET` inválido,
   corrige el mensaje en la terminal y vuelve a ejecutar `npm run start:dev`.
4. Que estés abriendo el frontend en `http://localhost:8080` y no en una IP,
   hostname o puerto diferente al permitido por CORS.
5. Si Swagger abre pero el navegador sigue reportando un error de conexión, abre
   las herramientas de desarrollador (`F12` > **Console** y **Network**) y verifica
   si aparece un error CORS o una URL de API distinta a `http://localhost:3000`.
   CORS debe permitir exactamente el origen del frontend (`http://localhost:8080`).
6. Si los servidores muestran errores, deténlos con `Ctrl+C`, corrige la
   configuración y vuelve a iniciarlos en sus terminales respectivas.

Los errores de validación, credenciales incorrectas o permisos se muestran con el
mensaje devuelto por la API una vez que existe conexión.

## Detener los servidores

En cada terminal, usa `Ctrl+C`. Esto detiene el proceso de desarrollo correspondiente.

## Crear una base de datos nueva (solo si realmente está vacía)

No uses este paso para la base existente del proyecto. Si necesitas preparar otra
base vacía, configura primero PostgreSQL y el `.env`, y luego ejecuta desde
`src\backend`:

```powershell
createdb -U postgres crm_vet
psql -U postgres -d crm_vet -f database\querys\crmVet_Schema_v2.sql
```

Haz que `DB_DATABASE` en `.env` coincida con el nombre que creaste.

# Carpeta `frontend`

Contiene la aplicación Vue y sus dependencias. Se inicia desde la carpeta
`frontend` con `npm run serve -- --port 8080`; la guía de ejecución completa está
en la sección anterior.


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
