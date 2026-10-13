import { createTicketService, getMyTicketsService, cancelTicketService } from "../services/ticket.service.js";

export const createTicket = async (req, res, next) => {
    try {
        const eventId = req.params.eid || req.params.id || req.body.eventId
        
        const ticket = await createTicketService({
            eventId,
            user: req.user
        });

        res.status(201).json({
            status: 'success',
            message: 'Inscripción realizada con éxito',
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTickets = async (req, res, next) => {
    try {
        const userId = req.user._id || req.user.id;
        const tickets = await getMyTicketsService(userId);

        res.status(200).json({
            status: 'success',
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

export const cancelTicket = async (req, res, next) => {
    try {
        const { tid } = req.params;

        const cancelledTicket = await cancelTicketService({
            ticketId: tid,
            user: req.user
        });

        res.status(200).json({
            status: 'success',
            message: 'Ticket cancelado correctamente',
            data: cancelledTicket
        });
    } catch (error) {
        next(error);
    }
};
