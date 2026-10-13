import { EventModel } from "../models/Event.js";

export class EventDAO {
    async create(eventData) {
        return await EventModel.create(eventData);
    }

    async findById(eventId) {
        return await EventModel.findById(eventId).populate('organizer');
    }

    async paginate(filter, options) {
        return await EventModel.paginate(filter, options);
    }

    async updateById(eventId, updateData) {
        return await EventModel.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('organizer');
    }
}

export const eventDAO = new EventDAO();
