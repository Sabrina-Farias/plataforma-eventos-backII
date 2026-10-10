import { getEventById } from "../services/event.service.js";

export const authorizeRoles = (...allowedRoles ) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status:"error",
                    message: "No autenticado"
                });
    }
            if ( !allowedRoles.includes( req.user.role )) {
                return res.status(403).json ({
                    status:"error",
                    message: "Rol insuficiente"
                })
            }
            next ()
        }
        catch ( error ) {
            return res.status(500).json({ "error":error.toString()})
        }
    }
}

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    try {
        const { eventId } = req.params

        const event = await getEventById ( eventId )

        if (!event) {
            return res.status(404).json({
            status: 'error',
            message: 'Evento no encontrado'
            })
        }

        const isAdmin = req.user.role === 'admin'
        const isOwner = event.organizer.toString() === req.user.id.toString()

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
            status: 'error',
            message: 'No tenés permisos para modificar este evento'
            })
        }

        req.event = event

        next()
    }
    catch ( error ) {
        return res.status(500).json({ "error":error.toString()})
    }
}