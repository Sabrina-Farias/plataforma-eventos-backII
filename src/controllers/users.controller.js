import { UserModel } from "../models/User.js"

export const getUsers = async (req, res) => {
    try {
        res.json({ message: await UserModel.find() })
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