import { getAllUsersService } from "../services/user.service.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();

        return res.status(200).json({
            status: "success",
            payload: users
        });
    } catch (error) {
        next(error);
    }
};
