import { EventModel } from "../models/Event.js";

export const createEventService = async ( title, description, organizer ) => {
    
    try {
        const newEvent = await EventModel.create ({
            title: title,
            description: description,
            organizer: organizer
        }); 

        return newEvent
    }
    catch ( error ){
        throw error
    }
}

export const getEventById = async ( eventID ) => {
    try {
        const event = await EventModel.findById ( eventID )

        return event
    }
    catch (error) {
        throw error
    }
}