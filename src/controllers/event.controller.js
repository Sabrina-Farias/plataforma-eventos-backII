import { EventModel } from "../models/Event.js"

export const getEvents = async (req, res) => {
    try {
        res.status(200).json({ message: await EventModel.find() })
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener eventos" })
    }
}

export const createEvent = async (req, res) => {
    try {
        res.status(201).json({ message: "Evento Creado" })
    }
    catch (error) {
        res.status(500).json({ error: "Error al crear el Evento" })
    }
}