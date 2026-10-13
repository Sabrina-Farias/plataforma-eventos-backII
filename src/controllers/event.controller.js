import { createEventService, getEventByIdService, getEventsService, updateEventService, cancelEventService } from "../services/event.service.js";
import { AppError, NotFoundError } from "../errors/app.error.js";

export const getEvents = async (req, res, next) => {
    try {
        const result = await getEventsService(req.query);

        return res.status(200).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        next(error);
    }
};

export const getEventsById = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const event = await getEventByIdService(id);

        if (!event) {
            throw new NotFoundError("Evento no encontrado");
        }

        return res.status(200).json({
            status: "success",
            payload: event
        });
    } catch (error) {
        next(error);
    }
};

export const createEvent = async (req, res, next) => {
    try {
        const { title, description, category, date, location, capacity, price, status } = req.body;

        if (!title || !description || !category || !date || !location || capacity === undefined || capacity === null) {
            throw new AppError("Todos los campos son obligatorios", 400);
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
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const updatedEvent = await updateEventService(id, req.body, req.user);

        if (!updatedEvent) {
            throw new NotFoundError("Evento no encontrado para actualizar");
        }

        return res.status(200).json({ 
            status: "success", 
            payload: updatedEvent 
        });
    } catch (error) {
        next(error);
    }
};

export const cancelEvent = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const cancelledEvent = await cancelEventService(id, req.user);

        return res.status(200).json({
            status: "success",
            message: "Evento cancelado exitosamente",
            payload: cancelledEvent
        });
    } catch (error) {
        next(error);
    }
};
