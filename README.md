# API de Plataforma de Eventos e Inscripciones - Curso CODERHOUSE BACKEND II

API backend construida con Node.js, Express y MongoDB (Mongoose) para gestionar usuarios, eventos e inscripciones. Es un proyecto creado en el contexto del curso de "Programación Backend II: Diseño y Arquitectura Backend" de CoderHouse 2026.

## Temática elegida

Plataforma de eventos e inscripciones que permite administrar clases y workshops, gestionar los usuarios que participan de la plataforma y llevar el registro de quién se inscribe en un Taller de Cerámica.

## Tecnologías utilizadas

- Node.js (módulos ESM)
- Express
- MongoDB
- dotenv
- bcrypt
- jsonwebtoken
- cookie-parser

## Instalación

```bash
git clone <url-del-repositorio>
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia) con las siguientes variables:

| Variable           | Descripción                                    |
|--------------------|------------------------------------------------|
| `PORT`             | Puerto donde se levanta el servidor            |
| `MONGO_URL`        | Cadena de conexión a MongoDB                   |
| `NODE_ENV`         | Entorno de ejecución (development o production)|
| `JWT_SECRET`       | Clave para firmar y verificar los tokens JWT.  |
| `JWT_EXPIRES_IN`   | Tiempo de expiración configurado para el token |
| `COOKIE_SECRET`    | Clave secreta para firmar las cookies.         |

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
└── services/          # lógica de negocio (usuarios y sesiones)
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
| Acción                                                          | User       | Organizer  | Admin      |
|-----------------------------------------------------------------|------------|------------|------------|
| Ver clases/workshops (`GET /api/events`)                        | Si         | Si         | Si         |
| Crear clases/workshops (`POST /api/events`)                     | No         | Si         | Si         |
| Editar clases/workshops propios (`PUT /api/events/:id`)         | No         | Si         | Si         |
| Editar cualquier clase/workshop (`PUT /api/events/:id`)         | No         | No         | Si         |
| Ver todos los usuarios (`GET /api/users`)                       | No         | No         | Si         |

## Manejo de Respuestas HTTP (401 vs 403)

En esta entrega se implementa una diferenciación estricta entre estados de autenticación y autorización:

- **`401 Unauthorized`**: El cliente no se encuentra autenticado (no envió la cookie firmada `currentUser`, el token es inválido o expiró).
  - *Respuesta:* `{ "status": "error", "message": "No autenticado" }`
- **`403 Forbidden`**: El cliente está autenticado correctamente, pero su rol no posee los permisos necesarios para acceder (ej. un `user` intentando crear un evento o acceder a `/api/users`, o un `organizer` intentando modificar un evento del cual no es creador.)
  - *Respuesta:* `{ "status": "error", "message": "Rol insuficiente" }` o `{ "status": "error", "message": "No tenés permisos para modificar este evento" }`

---

## Endpoints principales y Códigos de Respuesta

| Método| Endpoint                | Descripción                           | Acceso / Rol                 | Éxito        | Sin Auth | Sin Rol |
|-------|-------------------------|---------------------------------------|------------------------------|--------------|----------|---------|
| `GET` | `/api/health`           | Verifica que el servidor está activo  | Público                      | `200 OK`     | N/A      | N/A     |
| `POST`| `/api/sessions/register`| Registra un nuevo usuario             | Público                      | `201 Created`| N/A      | N/A     |
| `POST`| `/api/sessions/login`   | Inicia sesión y genera cookie firmada | Público                      | `200 OK`     | N/A      | N/A     |
| `GET` | `/api/sessions/current` | Retorna datos del usuario autenticado | Autenticado                  | `200 OK`     | `401`    | N/A     |
| `POST`| `/api/sessions/logout`  | Cierra la sesión y elimina la cookie  | Público / Autenticado        | `200 OK`     | N/A      | N/A     |
| `GET` | `/api/events`           | Ver los eventos disponibles           | Público                      | `200 OK`     | N/A      | N/A     |
| `POST`| `/api/events`           | Crea un nuevo evento                  | `organizer`, `admin`         | `201 Created`| `401`    | `403`   |
| `PUT` | `/api/events/:eventId`  | Modifica un evento existente          | `admin` o creador del evento | `200 OK`     | `401`    | `403`   |
| `GET` | `/api/users`            | Ver todos los usuarios registrados    | Solo `admin` | `200 OK`      | `401`        | `403`    |         |

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

Etapa 5 (Pre-entrega 5): Implementación de sistema de roles, autorización y protección de recursos por permisos y propiedad.