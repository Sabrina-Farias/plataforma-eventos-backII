import { TicketModel } from "../models/Ticket.js";

export class TicketDAO {
    async create(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async findById(ticketId, populateOptions = []) {
        let query = TicketModel.findById(ticketId);
        populateOptions.forEach(p => {
            query = query.populate(p);
        });
        return await query;
    }

    async findOne(filter) {
        return await TicketModel.findOne(filter);
    }

    async find(filter, { sort } = {}) {
        let query = TicketModel.find(filter);
        if (sort) query = query.sort(sort);
        return await query.populate('event');
    }

    async countDocuments(filter) {
        return await TicketModel.countDocuments(filter);
    }

    async updateById(ticketId, updateData, populateOptions = []) {
        let query = TicketModel.findByIdAndUpdate(
            ticketId,
            { $set: updateData },
            { new: true }
        );
        populateOptions.forEach(p => {
            query = query.populate(p);
        });
        return await query;
    }
}

export const ticketDAO = new TicketDAO();
