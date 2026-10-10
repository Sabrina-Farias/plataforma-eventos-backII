import { UserModel } from "../models/User.js"
import { isValidPassword } from "../utils/password.utils.js"

export const getUserByEmail = async email => {
    return await UserModel.findOne({ email })
}

export const validateLogin = async( email, password ) => {
    if (!email || !password) {  
        throw new Error('El email y la contraseña son obligatorios')
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await getUserByEmail(normalizedEmail)

    if (!user) {
        throw new Error('Credenciales inválidas')
    }

    const validPassword = await isValidPassword(password, user.password)

    if (!validPassword) {
        throw new Error('Credenciales inválidas')
    }

    return({
        id: user._id,
        email: user.email,
        role: user.role
    })
}