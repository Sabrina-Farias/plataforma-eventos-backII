import { getEventByIdService } from "../services/event.service.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: "error",
                    message: "No autenticado"
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    status: "error",
                    message: "Rol insuficiente"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message || error.toString()
            });
        }
    };
};

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        const isAdmin = req.user.role === 'admin';
        const organizerId = event.organizer?.id || event.organizer?._id || event.organizer;
        const isOwner = organizerId.toString() === req.user.id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento"
            });
        }

        req.targetEventId = id;
        next();
    } catch (error) {
        next(error);
    }
};
