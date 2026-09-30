import app from './app.js'

import { env } from './config/env.js'
import { connectDB } from './config/database.js'

await connectDB()

app.listen( env.PORT, () => {
    console.log(`Servidor escuchando peticiones en el puerto: ${env.PORT}`);
});
