import { EventDetailDTO } from "../dto/event-detail.dto.js";
import { EventModel } from "../models/Event.js";

export const createEventRepo = async (eventData) => {
    try {
        const newEvent = await EventModel.create(eventData);
        const populatedEvent = await EventModel.findById(newEvent._id).populate('organizer');

        return new EventDetailDTO(populatedEvent);
    } catch (error) {
        throw error;
    }
};

export const getEventByIdRepo = async (eventId) => {
    try {
        const event = await EventModel.findById(eventId).populate('organizer');
        if (!event) return null;

        return new EventDetailDTO(event);
    } catch (error) {
        throw error;
    }
};

export const findEventRepo = async (filter = {}, options = {}) => {
    try {
        const { page = 1, limit = 10, sort = { date: 1 } } = options;
        const skip = (Number(page) - 1) * Number(limit);

        const [lEvents, total] = await Promise.all([
            EventModel.find(filter)
                .populate('organizer')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit)),
            EventModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / Number(limit)) || 1;
        const data = lEvents.map(event => new EventDetailDTO(event));

        return {
            data,
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages
        };
    } catch (error) {
        throw error;
    }
};

export const updateEventRepo = async (eventId, updateData) => {
    try {
        const updated = await EventModel.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('organizer');

        if (!updated) return null;

        return new EventDetailDTO(updated);
    } catch (error) {
        throw error;
    }
};
