import { registerUser } from "../services/sessions.service.js";
import { getUserByEmail } from "../services/user.service.js";
import { isValidPassword } from "../utils/password.utils.js";
import { generateToken } from "../utils/jwt.utils.js";


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
        const { email, password } = req.body 

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'El email y la contraseña son obligatorios'
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const user = await getUserByEmail(normalizedEmail)

        if (!user) {
            return res.status (401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            })
        }

        const validPassword = await isValidPassword(password, user.password)

        if (!validPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            })
        }

        const tokenUser = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        const jwtToken = generateToken(tokenUser);

        res.cookie('currentUser', jwtToken, {
            httpOnly:true,
            maxAge: 60 * 60 * 1000,
            sameSite:'lax',
            secure: process.env.NODE_ENV === 'production'
        })

        return res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
        });

    } catch {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('currentUser', {
            httpOnly: true,
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
