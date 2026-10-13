import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

<<<<<<< HEAD
import userRoutes from "./routes/users.routes.js";
import eventRoutes from "./routes/events.routes.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
=======
import userRoutes from "./routes/users.routes.js"
import eventRoutes from "./routes/events.routes.js"
import sessionsRoutes from "./routes/sessions.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js";

>>>>>>> pre-entrega-7-correcciones

import './config/passport.config.js';
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

<<<<<<< HEAD
app.use(passport.initialize());
=======
app.use(passport.initialize())

app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/tickets', ticketRoutes)
>>>>>>> pre-entrega-7-correcciones

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        message: "Servidor activo" 
    });
});

app.use((req, res) => {
    res.status(404).json({ 
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

<<<<<<< HEAD
export default app;
=======
app.use(errorHandler);

export default app;
>>>>>>> pre-entrega-7-correcciones
