# API de Plataforma de Eventos e Inscripciones - Curso CODERHOUSE BACKEND II

API backend construida con Node.js, Express y MongoDB (Mongoose) para gestionar usuarios, eventos e inscripciones. Es un proyecto creado en el contexto del curso de "Programación Backend II: Diseño y Arquitectura Backend" de CoderHouse 2026.

## Temática elegida

Plataforma de eventos e inscripciones que permite administrar clases y workshops, gestionar los usuarios que participan de la plataforma y llevar el registro de quién se inscribe en un Taller de Cerámica.

## Tecnologías utilizadas

- Node.js (módulos ESM)
- Express
- MongoDB
- mongoose-paginate-v2
- dotenv
- bcrypt
- jsonwebtoken
- cookie-parser
- passport, passport-local y passport-jwt
- Nodemailer (servicio de mensajería por email con Ethereal / SMTP)

## Instalación

```bash
git clone <url-del-repositorio>
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia) con las siguientes variables:

| Variable        | Descripción                                               |
|-----------------|-----------------------------------------------------------|
| `PORT`          | Puerto donde se levanta el servidor                       |
| `MONGO_URL`     | Cadena de conexión a MongoDB                              |
| `NODE_ENV`      | Entorno de ejecución (`development` o `production`)       |
| `JWT_SECRET`    | Clave para firmar y verificar tokens JWT                  |
| `JWT_EXPIRES_IN`| Tiempo de expiración configurado para el token            |
| `COOKIE_SECRET` | Clave secreta para firmar las cookies                     |
| `SMTP_HOST`     | Servidor SMTP (ej. `smtp.ethereal.email`)                 |
| `SMTP_PORT`     | Puerto del servicio SMTP (`587`)                          |
| `SMTP_USER`     | Usuario/cuenta de correo emisor                           |
| `SMTP_PASSWORD` | Contraseña de autenticación SMTP                          |

## Cómo ejecutar el servidor

```bash
npm run dev     # levanta el servidor con recarga automática
npm start       # levanta el servidor en modo normal
```

El servidor queda disponible en `http://localhost:<PORT>`.

## Estructura de carpetas

```
src/
├── server.js          # arranque del servidor y conexión a la base de datos
├── config/            # configuración (conexión a MongoDB, variables de entorno)
├── routes/            # definición de endpoints
├── controllers/       # reciben la request y devuelven la response
├── models/            # schemas de Mongoose
├── utils/             # helpers reutilizables 
├── middlewares/       # intermediarios para autenticación y protección de rutas
├── services/          # lógica de negocio (usuarios y sesiones)
├── repositories/      # abstracción y consultas a Mongoose
├── dto/               # formateo y transferencia de datos hacia el cliente
├── errors/            # errores personalizados
└── app.js             # configuración de la app de Express
```
## Sistema de Autenticación - passport.js

El proyecto utiliza **Passport.js** a través de tres estrategias:
1. **`register` (LocalStrategy):** Valida y registra un nuevo usuario con la contraseña hasheada.
2. **`login` (LocalStrategy):** Valida credenciales y genera un token JWT.
3. **`current` (JwtStrategy):** Lee el token desde las cookies firmadas y protege las rutas privadas.

*Está estructurado para poder agregar nuevas estrategias (Google, GitHub, etc.) sin tocar app.js*

## Roles disponibles

El proyecto está preparado para trabajar con tres roles:
- **user**: consulta clases y workshops y se inscribe o reserva su lugar.
- **organizer**: crea y administra clases y workshops.
- **admin**: gestiona usuarios, categorías, clases, workshops e inscripciones.

## Matriz de permisos
| Acción                                                              | User       | Organizer  | Admin      |
|---------------------------------------------------------------------|------------|------------|------------|
| Ver clases/workshops (`GET /api/events`)                            | Sí         | Sí         | Sí         |
| Crear clases/workshops (`POST /api/events`)                         | No         | Sí         | Sí         |
| Editar clases/workshops propios (`PUT /api/events/:id`)             | No         | Sí         | Sí         |
| Editar cualquier clase/workshop (`PUT /api/events/:id`)             | No         | No         | Sí         |
| Cancelar clases/workshops propios (`PATCH /api/events/:id/cancel`)  | No         | Sí         | Sí         |
| Inscribirse a una clase (`POST /api/tickets/:id`)                   | Sí         | Sí         | Sí         |
| Ver mis tickets / reservas (`GET /api/tickets/my-tickets`)          | Sí         | Sí         | Sí         |
| Cancelar mi inscripción (`PATCH /api/tickets/:tid/cancel`)          | Sí         | Sí         | Sí         |
| Ver todos los usuarios (`GET /api/users`)                           | No         | No         | Sí         |

## Lógica de Negocio y Reglas de Dominio
La entidad Event cuenta con validaciones:
- Validación temporal: La fecha del evento debe ser posterior a la fecha actual.
- Capacidad mínima: El campo capacity debe ser m-ayor o igual a 1.
- Precio válido: El campo price no puede recibir valor negativo.
- Estados de evento: draft, published, cancelled y finished.
- Restricción de modificación: no se permite editar ni cancelar eventos que ya finalizaron, que ya fueron cancelados o que ya transcurrieron.
- Filtros y paginación: GET /api/events admite consultas por date, price, title y createdAt en sentido asc o desc.
- Uso de DTO: Respuestas de eventos moldeadas con EventDetailDTO.

### Flujo de Tickets, Cupos y Notificaciones
- **Control de cupos:** Al confirmar una inscripción se descuenta 1 cupo disponible del evento. Si no hay cupos, la reserva se rechaza.
- **Unicidad e índice parcial:** Un usuario solo puede tener una reserva activa (`status: "confirmed"`) por evento.
- **Cancelación y reinscripción:** Al cancelar un ticket (`status: "cancelled"`), el cupo del evento se restituye y el usuario queda habilitado para volverse a inscribir.
- **Notificación por email:** Al completarse la inscripción, se envía un correo automático con el código de reserva y el detalle del evento vía Nodemailer.

## Manejo de Respuestas HTTP (401 vs 403)

- **`401 Unauthorized`**: El cliente no se encuentra autenticado (no envió la cookie firmada `currentUser`, el token es inválido o expiró).
  - *Respuesta:* `{ "status": "error", "message": "No autenticado" }`
- **`403 Forbidden`**: El cliente está autenticado correctamente, pero su rol no posee los permisos necesarios para acceder (ej. un `user` intentando crear un evento o acceder a `/api/users`, o un `organizer` intentando modificar un evento del cual no es creador.)
  - *Respuesta:* `{ "status": "error", "message": "Rol insuficiente" }` o `{ "status": "error", "message": "No tenés permisos para modificar este evento" }`

---

## Endpoints principales y Códigos de Respuesta

| Método   | Endpoint                  | Descripción                             | Acceso / Rol                 | Éxito        | Sin Auth | Sin Rol |
|----------|---------------------------|-----------------------------------------|------------------------------|--------------|----------|---------|
| `GET`    | `/api/health`             | Verifica que el servidor está activo    | Público                      | `200 OK`     | N/A      | N/A     |
| `POST`   | `/api/sessions/register`  | Registra un nuevo usuario               | Público                      | `201 Created`| N/A      | N/A     |
| `POST`   | `/api/sessions/login`     | Inicia sesión y genera cookie firmada   | Público                      | `200 OK`     | N/A      | N/A     |
| `GET`    | `/api/sessions/current`   | Retorna datos del usuario autenticado   | Autenticado                  | `200 OK`     | `401`    | N/A     |
| `POST`   | `/api/sessions/logout`    | Cierra la sesión y elimina la cookie    | Público / Autenticado        | `200 OK`     | N/A      | N/A     |
| `GET`    | `/api/events`             | Ver los eventos disponibles             | Público                      | `200 OK`     | N/A      | N/A     |
| `POST`   | `/api/events`             | Crea un nuevo evento                    | `organizer`, `admin`         | `201 Created`| `401`    | `403`   |
| `PUT`    | `/api/events/:id`         | Modifica un evento existente            | `admin` o creador del evento | `200 OK`     | `401`    | `403`   |
| `PATCH`  | `/api/events/:id/cancel`  | Cancela un evento                       | `admin` o creador del evento | `200 OK`     | `401`    | `403`   |
| `GET`    | `/api/users`              | Ver todos los usuarios registrados      | Solo `admin`                 | `200 OK`     | `401`    | `403`   |
| `POST`   | `/api/tickets/:id`        | Inscribe al usuario y emite ticket/mail | Autenticado                  | `201 Created` | `401`    | `403`   |
| `GET`    | `/api/tickets/my-tickets` | Lista las reservas del usuario          | Autenticado                  | `200 OK`      | `401`    | N/A     |
| `PATCH`  | `/api/tickets/:id/cancel` | Cancela reserva y libera el cupo        | Dueño del ticket o `admin`   | `200 OK`      | `401`    | `403`   |

## Ejemplo de uso

```bash
curl http://localhost:3000/api/health
# { "status": "ok", "message": "Servidor activo" }

curl http://localhost:3000/api/events
# { "message": [] }

# Registrar un usuario nuevo:
curl -X POST http://localhost:3000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Sabri", "last_name": "Farias", "email": "sabrifa@mail.com", "password": "password123"}'
```

## Estado del proyecto

Etapa 8 (Pre-entrega 8): Refactorización 