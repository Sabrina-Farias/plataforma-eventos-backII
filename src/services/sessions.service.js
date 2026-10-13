import { userRepository } from "../repositories/user.repository.js";
import { createHash } from "../utils/password.utils.js";
import { AppError, ConflictError } from "../errors/app.error.js";

export const registerUser = async ({ first_name, last_name, email, password }) => {
    if (!first_name || !last_name || !email || !password) {
        throw new AppError("Faltan campos obligatorios", 400);
    }

    if (password.length < 6) {
        throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValid.test(normalizedEmail)) {
        throw new AppError("Email inválido", 400);
    }

    const userExists = await userRepository.getUserByEmail(normalizedEmail);
    if (userExists) {
        throw new ConflictError("El email ya está registrado");
    }

    const hashedPassword = await createHash(password, 10);

    const newUser = await userRepository.createUser({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
    });

    return {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
    };
};
