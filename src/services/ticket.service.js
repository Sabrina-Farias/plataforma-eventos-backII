import { createTicketRepo, findByEventAndUserRepo, activeTicketsByEventRepo, findByUser, findTicketByIdRepo, cancelTicketRepo } from '../repositories/ticket.repository.js';
import { getEventByIdRepo } from '../repositories/event.repository.js';
import { createReservationCode } from '../utils/ticket.utils.js';
import { enviarMail } from './mail.service.js';

export const createTicketService = async ({ eventId, user }) => {
    const userId = user._id || user.id;

    const event = await getEventByIdRepo(eventId);
    if (!event) {
        throw new Error('Evento no encontrado');
    }

    if (event.status !== 'published') {
        throw new Error('Esta clase no está disponible para inscripciones');
    }

    if (new Date(event.date) <= new Date()) {
        throw new Error('Esta clase ya comenzó o finalizó');
    }

    const existingTicket = await findByEventAndUserRepo(userId, event._id || eventId);
    if (existingTicket) {
        throw new Error('Ya estas inscripto/a a esta clase');
    }

    const reserved = await activeTicketsByEventRepo(event._id || eventId);
    const available = event.capacity - reserved;

    if (available < 1) {
        throw new Error('Ya no hay cupos para esta clase');
    }

    const reservationCode = createReservationCode();
    const ticket = await createTicketRepo({
        user: userId,
        event: event._id || eventId,
        quantity: 1,
        reservationCode,
        price: event.price || 0,
        status: 'confirmed'
    });

    try {
        if (user.email) {
            await enviarMail(
                user.email,
                'Confirmación de Reserva',
                `<h1>Reserva confirmada</h1>
                <p>Hola ${user.first_name || ''}, tu inscripción a <strong>${event.title}</strong> está confirmada.</p>
                <p>Código de reserva: <strong>${reservationCode}</strong></p>`,
                `Tu código de reserva para ${event.title} es: ${reservationCode}`
            );
        }
    } catch (mailError) {
        console.error('Error al enviar mail de reserva:', mailError.message);
    }

    return ticket;
};

export const getMyTicketsService = async (userId) => {
    return await findByUser(userId);
};

export const cancelTicketService = async ({ ticketId, user }) => {
    const ticket = await findTicketByIdRepo(ticketId);

    if (!ticket) {
        throw new Error('Ticket no encontrado');
    }

    const currentUserId = (user._id || user.id).toString();
    const ticketUserId = ticket.user?._id ? ticket.user._id.toString() : ticket.user.toString();

    if (ticketUserId !== currentUserId && user.role !== 'admin') {
        throw new Error('No tenés permisos para cancelar esta inscripción');
    }

    if (ticket.status === 'cancelled') {
        throw new Error('El ticket ya se encuentra cancelado');
    }

    if (ticket.event && new Date(ticket.event.date) <= new Date()) {
        throw new Error('No podés cancelar un ticket de un evento que ya finalizó o comenzó');
    }

    return await cancelTicketRepo(ticketId);
};
