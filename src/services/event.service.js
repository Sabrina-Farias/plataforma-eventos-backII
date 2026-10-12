import { createEventRepo, getEventByIdRepo, findEventRepo, updateEventRepo } from "../repositories/event.repository.js";
import { AppError, NotFoundError, ForbiddenError } from "../errors/app.error.js";

export const createEventService = async (eventData) => {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
        throw new AppError("La fecha del evento debe ser posterior a la fecha actual", 400);
    }

    if (Number(eventData.capacity) < 1) {
        throw new AppError("La capacidad debe ser como mínimo 1", 400);
    }

    if (Number(eventData.price) < 0) {
        throw new AppError("El precio no puede ser negativo", 400);
    }

    return await createEventRepo(eventData);
};

export const getEventByIdService = async (eventId) => {
    return await getEventByIdRepo(eventId);
};

export const getEventsService = async (queryParams) => {
    const { page = 1, limit = 10, status, category, sortBy = "date", order = "asc" } = queryParams;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const allowedSortFields = ["date", "price", "title", "createdAt"];
    const fieldToSort = allowedSortFields.includes(sortBy) ? sortBy : "date";

    const sortDirection = order.toLowerCase() === "desc" ? -1 : 1;

    const sortObject = { [fieldToSort]: sortDirection };

    return await findEventRepo(filter, {
        page: Number(page),
        limit: Number(limit),
        sort: sortObject
    });
};

export const updateEventService = async (eventId, updateData, currentUser) => {
    const event = await getEventByIdRepo(eventId);

    if (!event) {
        throw new NotFoundError("Evento no encontrado");
    }

    if (currentUser) {
        const organizerId = event.organizer?.id || event.organizer?._id || event.organizer;
        const isOwner = organizerId?.toString() === currentUser.id?.toString();
        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new ForbiddenError("No tenés permisos para actualizar este evento");
        }
    }

    if (event.status === "cancelled" || event.status === "finished") {
        throw new AppError("No se pueden modificar eventos cancelados o finalizados", 400);
    }

    if (updateData.date) {
        const eventDate = new Date(updateData.date);
        if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
            throw new AppError("La fecha del evento debe ser posterior a la fecha actual", 400);
        }
    }

    if (updateData.capacity !== undefined && Number(updateData.capacity) < 1) {
        throw new AppError("La capacidad debe ser como mínimo 1", 400);
    }

    if (updateData.price !== undefined && Number(updateData.price) < 0) {
        throw new AppError("El precio no puede ser negativo", 400);
    }

    return await updateEventRepo(eventId, updateData);
};


export const cancelEventService = async (eventId, currentUser) => {
    const event = await getEventByIdRepo(eventId);

    if (!event) {
        throw new NotFoundError("Evento no encontrado");
    }

    const organizerId = event.organizer?.id || event.organizer?._id || event.organizer;
    const isOwner = organizerId?.toString() === currentUser.id?.toString();
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ForbiddenError("No tenés permisos para cancelar este evento");
    }

    if (event.status === "cancelled") {
        throw new AppError("El evento ya se encuentra cancelado", 400);
    }

    if (event.status === "finished") {
        throw new AppError("No se puede cancelar un evento que ya finalizó", 400);
    }

    if (new Date(event.date) < new Date()) {
        throw new AppError("No se puede cancelar un evento pasado", 400);
    }

    return await updateEventRepo(eventId, { status: "cancelled" });
};
