import { TicketModel } from "../models/Ticket.js";
import { TicketDetailDTO } from "../dto/ticket-detail.dto.js"
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";

export const createTicketRepo = async (ticketData) => {
    const ticket = await TicketModel.create(ticketData);
    const populated = await TicketModel.findById(ticket._id)
        .populate('user')
        .populate('event');
    return new TicketDetailDTO(populated);
};

export const findByEventAndUserRepo = async (userId, eventId) => {
    return await TicketModel.findOne({
        user: userId,
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};

export const findByUser = async (userId) => {
    const tickets = await TicketModel.find({ user: userId })
        .populate('event')
        .sort({ createdAt: -1 });

    return tickets.map(t => new TicketDetailDTO(t));
};

export const findTicketByIdRepo = async (ticketId) => {
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

    if (!updated) return null;
    return new TicketDetailDTO(updated);
};

export const activeTicketsByEventRepo = async (eventId) => {
    return await TicketModel.countDocuments({
        event: eventId,
        status: { $ne: 'cancelled' }
    });
};