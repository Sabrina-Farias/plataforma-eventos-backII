import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

export const UserModel = model('users', userSchema);