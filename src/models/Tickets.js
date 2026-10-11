import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed'
    },
    reservationCode: {
        type: String,
        required: true,
        unique: true
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export const TicketModel = model('tickets', ticketSchema);
