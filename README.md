# API de Plataforma de Eventos e Inscripciones - Curso CODERHOUSE BACKEND II

API backend construida con Node.js, Express y MongoDB (Mongoose) para gestionar usuarios, eventos e inscripciones. Es un proyecto creado en el contexto del curso de "Programación Backend II: Diseño y Arquitectura Backend" de CoderHouse 2026.

## Temática elegida

Plataforma de eventos e inscripciones que permite administrar clases y workshops, gestionar los usuarios que participan de la plataforma y llevar el registro de quién se inscribe en un Taller de Cerámica.

## Tecnologías utilizadas

- Node.js (módulos ESM)
- Express
- MongoDB
- dotenv

## Instalación

```bash
git clone <url-del-repositorio>
cd codigo
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia) con las siguientes variables:

| Variable      | Descripción                                   |
|---------------|------------------------------------------------|
| `PORT`        | Puerto donde se levanta el servidor            |
| `MONGO_URL`   | Cadena de conexión a MongoDB                   |

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
├── utils/             # aún no utilizado
├── dao/               # aún no utilizado
├── middlewares/       # aún no utilizado
├── repositoires/      # aún no utilizado
└── services/          # aún no utilizado
app.js                 # configuración de la app de Express
```

## Endpoints principales

| Método | Endpoint            | Descripción                               |
|--------|---------------------|-------------------------------------------|
| GET    | `/api/health`       | Verifica que el servidor está activo      |
| GET    | `/api/users`        | Lista los usuarios registrados            |
| POST   | `/api/users`        | Crea un usuario                           |
| GET    | `/api/events`       | Lista los eventos disponibles             |
| POST   | `/api/events`       | Crea un evento                            |

## Ejemplo de uso

```bash
curl http://localhost:3000/api/health
# { "status": "ok", "message": "Servidor activo" }

curl http://localhost:3000/api/events
# { "message": [] }
```

## Estado del proyecto

Etapa 1: estructura por capas, variables de entorno, endpoints base.