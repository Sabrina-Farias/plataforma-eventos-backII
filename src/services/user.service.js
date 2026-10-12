import { UserModel } from "../models/User.js";
import { isValidPassword } from "../utils/password.utils.js";
import { AppError, UnauthorizedError } from "../errors/app.error.js";

export const getUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
};

export const validateLogin = async (email, password) => {
    if (!email || !password) {  
        throw new AppError("El email y la contraseña son obligatorios", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
        throw new UnauthorizedError("Credenciales inválidas");
    }

    const validPassword = await isValidPassword(password, user.password);

    if (!validPassword) {
        throw new UnauthorizedError("Credenciales inválidas");
    }

    return {
        id: user._id,
        email: user.email,
        role: user.role
    };
};
