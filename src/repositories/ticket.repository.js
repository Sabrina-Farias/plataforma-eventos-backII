<<<<<<< HEAD
import { TicketModel } from "../models/Ticket.js";
import { TicketDetailDTO } from "../dto/ticket-detail.dto.js";

export const createTicketRepo = async (ticketData) => {
    const ticket = await TicketModel.create(ticketData);
    const populated = await TicketModel.findById(ticket._id)
        .populate('user')
        .populate('event');
    return new TicketDetailDTO(populated);
};

export const findActiveUserTicketInEventRepo = async (userId, eventId) => {
    return await TicketModel.findOne({
=======
import { ticketDAO } from "../dao/TicketDAO.js";
import { TicketDetailDTO } from "../dto/ticket-detail.dto.js";

export const createTicketRepo = async (ticketData) => {
    const ticket = await ticketDAO.create(ticketData);
    const populated = await ticketDAO.findById(ticket._id, ['user', 'event']);
    return new TicketDetailDTO(populated);
};

export const findByEventAndUserRepo = async (userId, eventId) => {
    return await ticketDAO.findOne({
>>>>>>> pre-entrega-7-correcciones
        user: userId,
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};

<<<<<<< HEAD
export const getReservedCapacityRepo = async (eventId) => {
    const result = await TicketModel.aggregate([
        {
            $match: {
                event: eventId,
                status: { $ne: 'cancelled' }
            }
        },
        {
            $group: {
                _id: '$event',
                totalReserved: { $sum: '$quantity' }
            }
        }
    ]);
    return result.length > 0 ? result[0].totalReserved : 0;
};

export const findMyTicketsRepo = async (userId) => {
    const tickets = await TicketModel.find({ user: userId })
        .populate('event')
        .sort({ createdAt: -1 });

    return tickets.map(t => new TicketDetailDTO(t));
};

export const findTicketsByEventRepo = async (eventId) => {
    const tickets = await TicketModel.find({ event: eventId })
        .populate('user')
        .sort({ createdAt: -1 });

=======
export const findByUser = async (userId) => {
    const tickets = await ticketDAO.find(
        { user: userId },
        { sort: { createdAt: -1 } }
    );
>>>>>>> pre-entrega-7-correcciones
    return tickets.map(t => new TicketDetailDTO(t));
};

export const findTicketByIdRepo = async (ticketId) => {
<<<<<<< HEAD
    return await TicketModel.findById(ticketId).populate('event');
};

export const cancelTicketRepo = async (ticketId) => {
    const updated = await TicketModel.findByIdAndUpdate(
        ticketId,
        {
            $set: {
                status: 'cancelled',
                cancelledAt: new Date()
            }
        },
        { new: true }
    ).populate('event').populate('user');
=======
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
>>>>>>> pre-entrega-7-correcciones

    if (!updated) return null;
    return new TicketDetailDTO(updated);
};
<<<<<<< HEAD
=======

export const activeTicketsByEventRepo = async (eventId) => {
    return await ticketDAO.countDocuments({
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};
>>>>>>> pre-entrega-7-correcciones
