import { 
    createEventRepo, 
    getEventByIdRepo, 
    findEventRepo, 
    updateEventRepo 
} from "../repositories/event.repository.js";

export const createEventService = async (eventData) => {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
        const error = new Error("La fecha del evento debe ser posterior a la fecha actual");
        error.statusCode = 400;
        throw error;
    }

    if (Number(eventData.capacity) < 1) {
        const error = new Error("La capacidad debe ser como mínimo 1");
        error.statusCode = 400;
        throw error;
    }

    if (Number(eventData.price) < 0) {
        const error = new Error("El precio no puede ser negativo");
        error.statusCode = 400;
        throw error;
    }

    return await createEventRepo(eventData);
};

export const getEventByIdService = async (eventId) => {
    return await getEventByIdRepo(eventId);
};

export const findEventService = async (query = {}) => {
    const { category, status, search, page = 1, limit = 10 } = query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { date: 1 }
    };

    return await findEventRepo(filter, options);
};

export const updateEventService = async (eventId, updateData) => {
    if (updateData.date) {
        const eventDate = new Date(updateData.date);
        if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
            const error = new Error("La fecha del evento debe ser posterior a la fecha actual");
            error.statusCode = 400;
            throw error;
        }
    }

    if (updateData.capacity !== undefined && Number(updateData.capacity) < 1) {
        const error = new Error("La capacidad debe ser como mínimo 1");
        error.statusCode = 400;
        throw error;
    }

    if (updateData.price !== undefined && Number(updateData.price) < 0) {
        const error = new Error("El precio no puede ser negativo");
        error.statusCode = 400;
        throw error;
    }

    return await updateEventRepo(eventId, updateData);
};
