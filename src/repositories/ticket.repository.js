import { ticketDAO } from "../dao/TicketDAO.js";
import { TicketDetailDTO } from "../dto/ticket-detail.dto.js";

export const createTicketRepo = async (ticketData) => {
    const ticket = await ticketDAO.create(ticketData);
    const populated = await ticketDAO.findById(ticket._id, ['user', 'event']);
    return new TicketDetailDTO(populated);
};

export const findByEventAndUserRepo = async (userId, eventId) => {
    return await ticketDAO.findOne({
        user: userId,
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};

export const findByUser = async (userId) => {
    const tickets = await ticketDAO.find(
        { user: userId },
        { sort: { createdAt: -1 } }
    );
    return tickets.map(t => new TicketDetailDTO(t));
};

export const findTicketByIdRepo = async (ticketId) => {
    return await ticketDAO.findById(ticketId, ['event']);
};

export const cancelTicketRepo = async (ticketId) => {
    const updated = await ticketDAO.updateById(
        ticketId,
        {
            status: 'cancelled',
            cancelledAt: new Date()
        },
        ['event', 'user']
    );

    if (!updated) return null;
    return new TicketDetailDTO(updated);
};

export const activeTicketsByEventRepo = async (eventId) => {
    return await ticketDAO.countDocuments({
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};
