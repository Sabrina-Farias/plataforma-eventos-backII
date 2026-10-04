import express from "express"

import userRoutes from "./routes/users.routes.js"
import eventRoutes from "./routes/events.routes.js"
import sessionsRoutes from "./routes/sessions.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/sessions', sessionsRoutes)


app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        message: "Servidor activo" 
    });
})

export default app;