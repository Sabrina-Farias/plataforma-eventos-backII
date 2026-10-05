import { UserModel } from "../models/User.js"

export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        
        return res.status(200).json({
            status: "success",
            payload: users
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener Usuarios' })
    }
}

export const createUsers = async (req, res) => {
    try {
        res.json({ message: 'Usuario Creado' })
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el Usuario' })
    }
}
