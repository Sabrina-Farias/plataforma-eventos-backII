import { eventDAO } from "../dao/EventDAO.js";
import { EventDetailDTO } from "../dto/event-detail.dto.js";

export const createEventRepo = async (eventData) => {
    const newEvent = await eventDAO.create(eventData);
    const populatedEvent = await eventDAO.findById(newEvent._id);
    return new EventDetailDTO(populatedEvent);
};

export const getEventByIdRepo = async (eventId) => {
    const event = await eventDAO.findById(eventId);
    if (!event) return null;
    return new EventDetailDTO(event);
};

export const findEventRepo = async (filter = {}, options = {}) => {
    const { page = 1, limit = 10, sort = { date: 1 } } = options;

    const paginateOptions = {
        page: Number(page),
        limit: Number(limit),
        sort,
        populate: 'organizer',
        lean: false
    };

    const result = await eventDAO.paginate(filter, paginateOptions);

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
};

export const updateEventRepo = async (eventId, updateData) => {
    const updated = await eventDAO.updateById(eventId, updateData);
    if (!updated) return null;
    return new EventDetailDTO(updated);
};
