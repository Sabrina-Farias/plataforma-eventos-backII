import { UserModel } from "../models/User.js";
import { createHash } from "../utils/password.utils.js";

export const registerUser = async ({ first_name, last_name, email, password }) => {
    if (!first_name || !last_name || !email || !password) {
        const error = new Error('Faltan campos obligatorios');
        error.statusCode = 400;
        throw error;
    }

    if (password.length < 6) {
        const error = new Error('La contraseña debe tener al menos 6 caracteres');
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValid.test(normalizedEmail)) {
        const error = new Error('Email inválido');
        error.statusCode = 400;
        throw error;
    }

    const userExists = await UserModel.findOne({ email: normalizedEmail });
    if (userExists) {
        const error = new Error('El email ya está registrado');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await createHash(password, 10);

    const newUser = await UserModel.create({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user'
    });

    return {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
    };
};
