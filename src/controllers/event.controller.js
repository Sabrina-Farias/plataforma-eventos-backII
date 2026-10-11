import { createEventService, getEventByIdService, findEventService, updateEventService } from "../services/event.service.js";

export const getEvents = async (req, res) => {
    try {
        const result = await findEventService(req.query);

        return res.status(200).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener eventos"
        });
    }
};

export const getEventsById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await getEventByIdService(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            payload: event
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener eventos"
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, capacity, price, status } = req.body;

        if (!title || !description || !category || !date || !location || capacity === undefined || capacity === null) {
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son obligatorios"
            });
        }

        const eventData = { 
            title, 
            description, 
            category, 
            date, 
            location, 
            capacity: Number(capacity), 
            price: price !== undefined ? Number(price) : 0, 
            status: status || 'draft', 
            organizer: req.user.id 
        };

        const newEvent = await createEventService(eventData);

        return res.status(201).json({
            status: "success",
            payload: newEvent
        });
    } catch (error) {
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({
            status: "error",
            message: error.message || "Error al crear el Evento"
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updatedEvent = await updateEventService(eventId, req.body);

        if (!updatedEvent) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado para actualizar"
            });
        }

        return res.status(200).json({ 
            status: "success", 
            payload: updatedEvent 
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ 
            status: "error", 
            message: error.message || "Error al modificar el Evento" 
        });
    }
};
