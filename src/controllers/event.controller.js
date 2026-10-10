import { EventModel } from "../models/Event.js"
import { createEventService } from "../services/event.service.js"

export const getEvents = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            payload: await EventModel.find({})
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener eventos"
        })
    }
}

export const createEvent = async (req, res) => {
    try {
        const { title, description } = req.body

        if ( !title || !description ){
            return res.status(400).json({
                status: "error",
                message: "Todos los datos son obligatorios"
            });
        }

        const newEvent = await createEventService ( title, description, req.user.id );

        return res.status(201).json({
            status: "success",
            payload: newEvent
        })
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al crear el Evento"
        })
    }
} 

export const updateEvent = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (title) req.event.title = title;
        if (description) req.event.description = description;

        const updatedEvent = await req.event.save();

        return res.status(200).json({ 
            status: "success", 
            payload: updatedEvent 
            });
    }
    catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Error al modificar el Evento" 
        });
    }
}