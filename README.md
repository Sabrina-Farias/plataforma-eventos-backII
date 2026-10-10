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

## Endpoints principales

| Método | Endpoint                         | Descripción                                                                |
|--------|----------------------------------|----------------------------------------------------------------------------|
| GET    | `/api/health`                    | Verifica que el servidor está activo                                       |
| GET    | `/api/users`                     | Lista los usuarios registrados                                             |
| GET    | `/api/events`                    | Lista los eventos disponibles                                              |
| POST   | `/api/events`                    | Crea un evento                                                             |
| POST   | `/api/sessions/register`         | Registra un usuario nuevo                                                  |
| POST   | `/api/sessions/login`            | Autentificación de usuario, generando el token y lo almacena en una cookie |
| GET    | `/api/sessions/current`          | Ruta protegida por middleware. Lee la cookie, verifica el token y retorna los datos del usuario |
| POST   | `/api/sessions/logout`           | Cierra la sesión y elimina la cookie                                       |

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

Etapa 4 (Pre-entrega 4): Refactorización del sistema de autenticación utilizando Passport.js (estrategias Local y JWT).