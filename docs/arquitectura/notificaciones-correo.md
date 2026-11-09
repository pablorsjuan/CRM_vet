# Notificaciones por correo (Nodemailer)

Documentación del módulo de correo del backend y de cómo se integra con el frontend en Vue.

> **Estado actual:** el módulo de correo, las plantillas y las utilidades de tokens ya existen y están probados.
> Los endpoints de `auth` y de citas que los usan **todavía no están implementados**; en este documento aparecen marcados como *(propuesto)*.

---

## 1. Idea principal

**El frontend nunca envía correos.** Solo el backend habla con el servidor SMTP (Gmail u otro).
El frontend hace una petición HTTP normal al backend, y el backend decide si debe enviar un correo.

```
 Vue (navegador)          NestJS (backend)               Servidor SMTP        Dueño / Trabajador
 ───────────────          ────────────────               ─────────────        ──────────────────
 1. Petición HTTP  ─────► Controlador
                          2. Lógica del negocio
                          3. MailService ───────────────► Gmail / SMTP ──────► 4. Recibe el correo
 5. Respuesta JSON ◄───── (responde sin esperar
                           a que el correo llegue)
```

Esto es importante por seguridad: las credenciales del correo (`MAIL_USER`, `MAIL_PASSWORD`) viven solo en el `.env` del backend y nunca llegan al navegador (RNF-007).

---

## 2. Estructura de archivos

```
src/backend/
├── notifications/
│   ├── notifications.module.ts      Crea el transporte de Nodemailer con los datos del .env
│   ├── mail.service.ts              Envía los correos (único punto que habla con el SMTP)
│   ├── mail.constants.ts            Token de inyección del transporte
│   ├── index.ts
│   └── templates/
│       ├── base.template.ts                 Diseño común (encabezado, pie, botón)
│       ├── recuperar-contrasena.template.ts RF-003
│       ├── cita-completada.template.ts      RF-007
│       ├── recordatorio-cita.template.ts    RF-016
│       └── index.ts
└── common/utils/
    ├── html.util.ts                 escapeHtml(): evita que un dato del usuario se interprete como HTML
    ├── token.util.ts                generarTokenSeguro() y hashearToken() para la recuperación de contraseña
    ├── date.util.ts                 formatearFechaHora() en español y hora de Colombia
    └── appointment-rules.util.ts    Reglas de citas (1 hora de anticipación, recordatorio a 30 min)
```

---

## 3. Configuración

Las variables van en el archivo `src/backend/.env` (el real, **no** el `.env.example`). Después de editarlo hay que reiniciar el servidor.

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicación
MAIL_FROM="CRM Vet <tu_correo@gmail.com>"
```

| Variable | Para qué sirve |
|---|---|
| `MAIL_HOST` | Servidor SMTP. Para Gmail: `smtp.gmail.com`. |
| `MAIL_PORT` | `587` (cifrado STARTTLS) o `465` (SSL directo). |
| `MAIL_SECURE` | `false` con el puerto 587, `true` con el 465. |
| `MAIL_USER` | Cuenta con la que se inicia sesión en el SMTP. |
| `MAIL_PASSWORD` | Con Gmail **no es tu contraseña normal**, sino una *contraseña de aplicación* (Cuenta de Google → Seguridad → Contraseñas de aplicaciones; requiere verificación en dos pasos). |
| `MAIL_FROM` | Nombre y correo que verá quien reciba el mensaje. Con Gmail debe coincidir con `MAIL_USER`. |

Si falta alguna variable, el servidor no arranca (usa `getOrThrow`, igual que la configuración de la base de datos).

Al iniciar, el servicio comprueba la conexión con el SMTP:
- Todo bien → `Conexión con el servidor de correo verificada`
- Algo mal → una advertencia en consola (la aplicación sigue funcionando).

---

## 4. Cómo funciona por dentro

1. `NotificationsModule` lee las variables `MAIL_*` y crea el **transporte** de Nodemailer (la conexión con el SMTP). Tiene tiempos máximos de 10–15 s para que un SMTP lento no deje peticiones colgadas (RNF-008).
2. `MailService` recibe ese transporte y expone un método por cada tipo de correo.
3. Cada método arma el correo con una **plantilla** (asunto + HTML + versión en texto plano) y llama a `enviar()`.
4. Los datos que escribe el usuario (nombre de la mascota, etc.) pasan por `escapeHtml()` antes de entrar al HTML.

### Si el envío falla

Los métodos **nunca lanzan excepción**: devuelven `true` si el correo salió y `false` si falló, y el error queda en el log del servidor. Razones:

- Un problema de correo no debe tumbar la operación principal (por ejemplo, finalizar una cita).
- En la recuperación de contraseña, un error no debe revelar si el correo existe en el sistema.

El log nunca incluye el correo del destinatario (es un dato personal).

---

## 5. Cómo usarlo desde otro módulo del backend

**1.** Importar `NotificationsModule` en el módulo que lo necesite:

```ts
// modules/auth/auth.module.ts
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [NotificationsModule /* , ... */],
})
export class AuthModule {}
```

**2.** Inyectar `MailService` y llamar al método:

```ts
import { MailService } from '../../notifications';

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async ejemplo() {
    const enviado = await this.mailService.enviarCitaCompletada('dueno@correo.com', {
      nombreDueno: 'Ana',
      nombreMascota: 'Firulais',
      servicio: 'Peluquería',
      fechaHora: new Date(),
    });
    // enviado === false si el SMTP falló; decide qué hacer (normalmente, solo seguir).
  }
}
```

### Métodos disponibles

| Método | Requisito | Quién lo recibe | Cuándo se dispara |
|---|---|---|---|
| `enviarRecuperacionContrasena(para, { nombre, enlace, minutosVigencia })` | RF-003 | Cualquier usuario | Al pedir recuperar la contraseña |
| `enviarCitaCompletada(para, { nombreDueno, nombreMascota, servicio, fechaHora })` | RF-007 | Dueño | Cuando el trabajador marca la cita como terminada |
| `enviarRecordatorioCita(para, { nombreDestinatario, nombreMascota, servicio, fechaHora })` | RF-016 | Dueño y trabajador | 30 minutos antes de la cita |
| `enviar({ para, asunto, html, texto })` | — | — | Envío genérico, para casos nuevos |

---

## 6. Integración con el frontend (Vue)

El frontend no usa ninguna librería de correo. Solo consume endpoints del backend. Lo que cambia según el caso:

| Caso | Qué hace el frontend | Qué hace el backend |
|---|---|---|
| Recuperar contraseña (RF-003) | Muestra 2 pantallas y hace 2 peticiones | Genera el token, envía el correo, valida el token |
| Cita completada (RF-007) | Solo llama al endpoint de finalizar cita | Envía el correo al dueño |
| Recordatorio (RF-016) | **Nada** | Lo envía automáticamente 30 min antes |

### 6.1 Flujo de recuperación de contraseña (RF-003)

```
  Vue                                   NestJS                              Correo
  ───                                   ──────                              ──────
  /forgot_password
  El usuario escribe su email
  POST /auth/forgot-password  ───────►  Busca el usuario
  { "email": "..." }                    Genera token (generarTokenSeguro)
                                        Guarda el HASH del token + vencimiento
                                        MailService.enviarRecuperacionContrasena ──► Llega el correo
  ◄─────────────────────────────────    Responde SIEMPRE lo mismo                    con un enlace:
  "Si el correo existe, te enviamos                                                  FRONTEND_URL/reset_password?token=...
   un enlace"

  /reset_password?token=...   ◄───────────────────────────────────────────────────── El usuario hace clic
  El usuario escribe la nueva contraseña
  POST /auth/reset-password  ────────►  Hashea el token recibido y lo compara
  { "token": "...",                     Revisa que no esté vencido ni usado
    "contrasena": "..." }               Actualiza la contraseña (hashPassword)
  ◄─────────────────────────────────    Responde OK
  Redirige a /login
```

**Endpoints (propuestos, aún no existen):**

| Método y ruta | Body | Respuesta |
|---|---|---|
| `POST /auth/forgot-password` | `{ "email": "ana@correo.com" }` | Siempre 200 con el mismo mensaje, exista o no el correo |
| `POST /auth/reset-password` | `{ "token": "...", "contrasena": "..." }` | 200 si se cambió; 400 si el token es inválido o venció |

> El backend usa `forbidNonWhitelisted`: si el frontend envía un campo que el DTO no declara, responde 400. Envía solo los campos de la tabla.

### 6.2 Formato de las respuestas

Todas las respuestas del backend siguen un formato único (interceptor y filtros de `common`).

**Éxito**
```json
{ "success": true, "data": { "...": "..." }, "timestamp": "2026-11-09T20:00:00.000Z" }
```

**Error**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "El token es inválido o ya venció",
  "path": "/auth/reset-password",
  "method": "POST",
  "timestamp": "2026-11-09T20:00:00.000Z"
}
```
`message` puede ser un texto **o una lista de textos** (errores de validación). El frontend debe contemplar ambos casos.

### 6.3 Ayudante para llamar a la API

Crear `src/frontend/crm-vet/src/services/api.js`. Esta función deshace el formato anterior: devuelve `data` si todo salió bien y lanza un `Error` con el mensaje del backend si no.

```js
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

export async function apiPost(ruta, cuerpo) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })

  const json = await respuesta.json()

  if (!respuesta.ok) {
    // message puede ser texto o lista de textos
    const mensaje = Array.isArray(json.message) ? json.message.join('. ') : json.message
    throw new Error(mensaje || 'Ocurrió un error, intenta de nuevo')
  }

  return json.data
}
```

### 6.4 Pantalla "Olvidé mi contraseña"

`src/Views/Forgot_password.vue`

```vue
<template>
  <form @submit.prevent="enviar">
    <h1>Recuperar contraseña</h1>
    <input v-model="email" type="email" placeholder="Tu correo" required />
    <button :disabled="cargando">{{ cargando ? 'Enviando...' : 'Enviar enlace' }}</button>

    <p v-if="mensaje">{{ mensaje }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script>
import { apiPost } from '@/services/api'

export default {
  name: 'Forgot_password',
  data() {
    return { email: '', cargando: false, mensaje: '', error: '' }
  },
  methods: {
    async enviar() {
      this.cargando = true
      this.mensaje = ''
      this.error = ''
      try {
        await apiPost('/auth/forgot-password', { email: this.email })
        // Mensaje fijo: no se revela si el correo existe.
        this.mensaje = 'Si el correo está registrado, te enviamos un enlace para recuperar tu contraseña.'
      } catch (e) {
        this.error = e.message
      } finally {
        this.cargando = false
      }
    },
  },
}
</script>
```

### 6.5 Pantalla "Nueva contraseña"

El token llega en la URL (`/reset_password?token=...`) y se envía al backend junto con la nueva contraseña.

`src/Views/Reset_password.vue`

```vue
<template>
  <form @submit.prevent="cambiar">
    <h1>Nueva contraseña</h1>
    <input v-model="contrasena" type="password" placeholder="Nueva contraseña" minlength="8" required />
    <input v-model="confirmacion" type="password" placeholder="Repite la contraseña" required />
    <button :disabled="cargando">Cambiar contraseña</button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script>
import { apiPost } from '@/services/api'

export default {
  name: 'Reset_password',
  data() {
    return { contrasena: '', confirmacion: '', cargando: false, error: '' }
  },
  methods: {
    async cambiar() {
      this.error = ''
      if (this.contrasena !== this.confirmacion) {
        this.error = 'Las contraseñas no coinciden'
        return
      }

      this.cargando = true
      try {
        await apiPost('/auth/reset-password', {
          token: this.$route.query.token,
          contrasena: this.contrasena,
        })
        this.$router.push({ name: 'login' })
      } catch (e) {
        this.error = e.message
      } finally {
        this.cargando = false
      }
    },
  },
}
</script>
```

### 6.6 Registrar las rutas

En `src/router/index.js`, siguiendo el estilo de nombres que ya usas:

```js
import Forgot_password from '@/Views/Forgot_password.vue'
import Reset_password from '@/Views/Reset_password.vue'

// dentro de const routes = [ ... ]
{ path: '/forgot_password', name: 'forgot_password', component: Forgot_password },
{ path: '/reset_password', name: 'reset_password', component: Reset_password },
```

Y en `Login.vue`, un enlace a la pantalla: `<router-link to="/forgot_password">¿Olvidaste tu contraseña?</router-link>`

### 6.7 CORS y variables de entorno

El frontend (Vue CLI) corre en `http://localhost:8080` y el backend en `http://localhost:3000`. Son orígenes distintos, así que **el navegador bloqueará las peticiones** hasta que el backend lo permita. Hoy `main.ts` no tiene CORS activado.

En `main.ts`, antes de `app.listen(...)`:

```ts
app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:8080' });
```

Variables nuevas:

| Dónde | Archivo | Variable | Ejemplo |
|---|---|---|---|
| Backend | `src/backend/.env` | `FRONTEND_URL` | `http://localhost:8080` |
| Frontend | `src/frontend/crm-vet/.env` | `VUE_APP_API_URL` | `http://localhost:3000` |

`FRONTEND_URL` se usa también para armar el enlace del correo: `${FRONTEND_URL}/reset_password?token=${token}`.
En Vue CLI las variables del frontend deben empezar por `VUE_APP_`.

---

## 7. Parte del backend que falta para recuperar la contraseña *(propuesto)*

Esqueleto de cómo quedaría el servicio de `auth`, usando lo que ya existe:

```ts
import { generarTokenSeguro, hashearToken, hashPassword, sumarMinutos } from '../../common/utils';

const VIGENCIA_MINUTOS = 30;

async solicitarRecuperacion(email: string): Promise<void> {
  const usuario = await this.usersService.findByEmail(email);
  if (!usuario) return; // No se hace nada, pero el controlador responde igual.

  const token = generarTokenSeguro();

  await this.tokensRepo.save({
    id_usuario: usuario.id_usuario,
    token_hash: hashearToken(token),          // en la BD solo va el hash
    expira_en: sumarMinutos(new Date(), VIGENCIA_MINUTOS),
    usado: false,
  });

  await this.mailService.enviarRecuperacionContrasena(usuario.email, {
    nombre: usuario.nombre,
    enlace: `${process.env.FRONTEND_URL}/reset_password?token=${token}`,
    minutosVigencia: VIGENCIA_MINUTOS,
  });
}
```

Para esto falta:
- Una **tabla** para guardar el hash del token, su vencimiento y si ya se usó (no existe en el esquema SQL actual).
- Un método para buscar usuario por email.
- El controlador `auth` con los dos endpoints.

---

## 8. Cita completada y recordatorios

### RF-007: cita completada
El frontend **no hace nada especial**. Cuando el trabajador pulse "Finalizar cita", llama al endpoint de citas *(propuesto, p. ej. `PATCH /appointments/:id/complete`)*. El backend cambia el estado de la cita y llama a `mailService.enviarCitaCompletada(...)`. Si el correo falla, la cita igual queda finalizada.

### RF-016: recordatorio 30 minutos antes
Tampoco requiere nada del frontend. Necesita que el backend revise periódicamente las citas próximas, y para eso hace falta un programador de tareas (por ejemplo `@nestjs/schedule`). Las piezas ya existen:
- `calcularFechaRecordatorio(fechaCita)` → momento exacto del envío.
- `enviarRecordatorioCita(...)` → un envío al dueño y otro al trabajador.

---

## 9. Seguridad: reglas que se deben respetar

- **Nunca** poner credenciales de correo en el código ni en comentarios (RNF-007). Solo en `.env`, que está en `.gitignore`.
- En `forgot-password`, responder **siempre lo mismo**, exista o no el correo; así nadie puede averiguar qué correos están registrados.
- Guardar en la BD el **hash** del token, no el token. Si alguien lee la base de datos, no puede usar los enlaces.
- El enlace debe **vencer** (30 minutos) y **usarse una sola vez**.
- No escribir en el log contraseñas, tokens ni correos de usuarios.
- Toda plantilla debe pasar los datos del usuario por `escapeHtml()`.

---

## 10. Solución de problemas

| Síntoma | Causa probable |
|---|---|
| El servidor no arranca y pide `MAIL_...` | Falta una variable en el `.env` |
| Advertencia "No se pudo verificar el servidor de correo" | `MAIL_USER` o `MAIL_PASSWORD` mal escritos |
| Error `Invalid login` / `535` con Gmail | Usaste la contraseña normal en vez de la de aplicación, o no está activada la verificación en dos pasos |
| El correo "se envía" pero no llega | Revisar la carpeta de spam; con Gmail, `MAIL_FROM` debe ser el mismo correo que `MAIL_USER` |
| El navegador muestra error de CORS | Falta `app.enableCors(...)` en `main.ts` |
| El backend responde 400 "property ... should not exist" | El frontend está enviando campos que el DTO no declara |
| Cambié el `.env` y no hace efecto | Hay que reiniciar el servidor |

---

## 11. Pendientes

- [ ] Módulo `auth` (login, JWT, guards de roles) y los endpoints `forgot-password` / `reset-password`.
- [ ] Tabla de tokens de recuperación en el esquema SQL.
- [ ] `app.enableCors(...)` en `main.ts` y variable `FRONTEND_URL`.
- [ ] Pantallas `Forgot_password.vue` y `Reset_password.vue` y sus rutas.
- [ ] Endpoint de finalizar cita que dispare `enviarCitaCompletada`.
- [ ] Programador de tareas para los recordatorios de RF-016.
