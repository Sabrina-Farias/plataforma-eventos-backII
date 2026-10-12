import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'finished'],
        default: 'draft',
        index: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

eventSchema.plugin(mongoosePaginate);

export const EventModel = model('events', eventSchema);
