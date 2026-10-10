import { generateToken } from "../utils/jwt.utils.js";


/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const register = async (req, res) => {
    try {
        return res.status(201).json({
            status: "success",
            message: "Usuario registrado con éxito",
            payload: req.user
        });
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: 'error',
            message: error.message || 'Error interno del servidor'
        });
    }
};

export const current = async (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            payload: req.user
        });
    } catch {
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        });
    }
};

export const login = async (req, res) => {
    try {
        const tokenUser = { 
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }

        const jwtToken = generateToken(tokenUser);

        res.cookie('currentUser', jwtToken, {
            httpOnly:true,
            signed: true,
            maxAge: 60 * 60 * 1000,
            sameSite:'lax',
            secure: process.env.NODE_ENV === 'production'
        })

        return res.status(200).json({
            status: 'success',
            message: 'Login correcto',
        });

    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: error.message || 'Error al iniciar sesión'
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('currentUser', {
            httpOnly: true,
            signed: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(200).json({
            status: 'success',
            message: 'Sesión cerrada'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al cerrar sesión'
        });
    }
};
