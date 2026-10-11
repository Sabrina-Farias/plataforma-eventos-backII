import crypto from "crypto";
import { EventModel } from "../models/Event.js";
import { UserModel } from "../models/User.js";
import {
    createTicketRepo,
    findActiveUserTicketInEventRepo,
    getReservedCapacityRepo,
    findMyTicketsRepo,
    findTicketsByEventRepo,
    findTicketByIdRepo,
    cancelTicketRepo
} from "../repositories/ticket.repository.js";
import { sendTicketConfirmationEmail } from "./mail.service.js";

export const purchaseTicketService = async (userId, eventId, quantity = 1) => {
    const event = await EventModel.findById(eventId);
    if (!event) {
        const error = new Error("Evento no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (event.status !== 'published') {
        const error = new Error("El evento no se encuentra disponible para inscripciones");
        error.statusCode = 400;
        throw error;
    }

    if (new Date(event.date) <= new Date()) {
        const error = new Error("No es posible inscribirse a un evento que ya finalizó");
        error.statusCode = 400;
        throw error;
    }

    const existingTicket = await findActiveUserTicketInEventRepo(userId, eventId);
    if (existingTicket) {
        const error = new Error("Ya posees una inscripción activa para este evento");
        error.statusCode = 400;
        throw error;
    }

    const reservedCount = await getReservedCapacityRepo(eventId);
    const availableSlots = event.capacity - reservedCount;

    if (quantity > availableSlots) {
        const error = new Error(`Cupos insuficientes. Lugares disponibles: ${availableSlots}`);
        error.statusCode = 400;
        throw error;
    }

    const reservationCode = `TCK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const newTicket = await createTicketRepo({
        user: userId,
        event: eventId,
        quantity,
        reservationCode,
        status: 'confirmed'
    });

    const user = await UserModel.findById(userId);
    if (user) {
        sendTicketConfirmationEmail({
            to: user.email,
            userName: user.first_name,
            eventTitle: event.title,
            eventDate: event.date,
            reservationCode,
            quantity
        });
    }

    return newTicket;
};

export const getMyTicketsService = async (userId) => {
    return await findMyTicketsRepo(userId);
};

export const getTicketsByEventService = async (eventId, requesterUser) => {
    const event = await EventModel.findById(eventId);
    if (!event) {
        const error = new Error("Evento no encontrado");
        error.statusCode = 404;
        throw error;
    }

    const isAdmin = requesterUser.role === 'admin';
    const isOwner = event.organizer.toString() === requesterUser.id.toString();

    if (!isAdmin && !isOwner) {
        const error = new Error("No posees permisos para consultar las inscripciones de este evento");
        error.statusCode = 403;
        throw error;
    }

    return await findTicketsByEventRepo(eventId);
};

export const cancelTicketService = async (ticketId, requesterUser) => {
    const ticket = await findTicketByIdRepo(ticketId);
    if (!ticket) {
        const error = new Error("Ticket no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (ticket.status === 'cancelled') {
        const error = new Error("El ticket ya se encuentra cancelado");
        error.statusCode = 400;
        throw error;
    }

    const isAdmin = requesterUser.role === 'admin';
    const isOwner = ticket.user.toString() === requesterUser.id.toString();

    if (!isAdmin && !isOwner) {
        const error = new Error("No tenés permisos para cancelar este ticket");
        error.statusCode = 403;
        throw error;
    }

    return await cancelTicketRepo(ticketId);
};
