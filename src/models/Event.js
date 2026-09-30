import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

export const EventModel = model('events', eventSchema);