import { registerUser } from "../services/sessions.service.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const register = async (req, res) => {
    try {
        const newUser = await registerUser(req.body);
        
        return res.status(201).json({
            status: "success",
            payload: newUser
        });
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: 'error',
            message: error.message || 'Error interno del servidor'
        });
    }
};
