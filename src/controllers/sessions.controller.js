import { generateToken } from "../utils/jwt.utils.js";
import { UnauthorizedError } from "../errors/app.error.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

export const register = async (req, res, next) => {
    try {
        return res.status(201).json({
            status: "success",
            message: "Usuario registrado con éxito",
            payload: req.user
        });
    } catch (error) {
        next(error);
    }
};

export const current = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError("No autenticado");
        }

        return res.status(200).json({
            status: "success",
            payload: req.user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const tokenUser = { 
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        };

        const jwtToken = generateToken(tokenUser);

        res.cookie("currentUser", jwtToken, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            status: "success",
            message: "Login correcto"
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("currentUser", {
            httpOnly: true,
            signed: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            status: "success",
            message: "Sesión cerrada"
        });
    } catch (error) {
        next(error);
    }
};
