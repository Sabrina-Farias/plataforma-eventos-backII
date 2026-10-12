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

        const paginateOptions = {
            page: Number(page),
            limit: Number(limit),
            sort,
            populate: 'organizer',
            lean: false
        };

        const result = await EventModel.paginate(filter, paginateOptions);

        return {
            data: result.docs.map(event => new EventDetailDTO(event)),
            page: result.page,
            limit: result.limit,
            total: result.totalDocs,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
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
