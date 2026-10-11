import {
    purchaseTicketService,
    getMyTicketsService,
    getTicketsByEventService,
    cancelTicketService
} from "../services/ticket.service.js";

export const purchaseTicket = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { quantity = 1 } = req.body;

        const ticket = await purchaseTicketService(req.user.id, eventId, Number(quantity));

        return res.status(201).json({
            status: "success",
            payload: ticket
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "error",
            message: error.message || "Error al generar la inscripción"
        });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await getMyTicketsService(req.user.id);

        return res.status(200).json({
            status: "success",
            payload: tickets
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Error al obtener tus tickets"
        });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const { eventId } = req.params;
        const tickets = await getTicketsByEventService(eventId, req.user);

        return res.status(200).json({
            status: "success",
            payload: tickets
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "error",
            message: error.message || "Error al obtener las inscripciones"
        });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await cancelTicketService(ticketId, req.user);

        return res.status(200).json({
            status: "success",
            payload: ticket
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: "error",
            message: error.message || "Error al cancelar el ticket"
        });
    }
};
